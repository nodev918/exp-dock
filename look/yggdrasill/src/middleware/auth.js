require('../builds/chat/chatEntities_pb')
require('../builds/chat/socketEntities_pb')
const { get, set, unset, each, toString, map, values, isEmpty } = require('lodash')
const bigintJSON = require('json-bigint')
const logger = require('../logger')
const logUtils = require('../utils/log')
const chatUtils = require('../utils/chat')
const timeUtils = require('../utils/time')
const interceptor = require('../utils/interceptor')
const portiere = require('../datasource/portiere')
const memcached = require('../datasource/memcached')
const redis = require('../datasource/redis')
const config = require('../config')
const commonUtils = require('../utils/common')
const gravitas = require('../datasource/gravitas')
const errs = require('../utils/error')

module.exports = io => {
  const authenticate = async token => {
    let authenticated

    // authenticated from memcached
    try {
      if (!authenticated) {
        authenticated = await memcached.getCache(`token:user:${token}`)
        if (authenticated) {
          authenticated = bigintJSON.parse(authenticated)
          logger.debug(logUtils.composeFields(logUtils.Constants.FieldData, JSON.stringify(authenticated)), 'Authenticated from memcached')
        }
      }
    } catch (e) {
      logger.error(logUtils.composeFields(logUtils.Constants.FieldToken, get(e, 'stack')), 'Authenticated from memcached failed')
    }

    // authenticated by portiere
    if (!authenticated) {
      authenticated = await portiere.authenticate(token)
      logger.debug(logUtils.composeFields(logUtils.Constants.FieldData, JSON.stringify(authenticated)), 'Authenticated from portiere')
    }
    return authenticated
  }

  const processSnapshot = async socket => {
    if (!get(socket, 'snapshotProcessing')) {
      set(socket, 'snapshotProcessing', true)
      const snapshot = await getSnapshot(socket)
      if (!isEmpty(snapshot) && !isEmpty(snapshot.getSnapshotItemsList())) {
        socket.emit('v1/snapshot', snapshot.serializeBinary().buffer)
      }
      set(socket, 'snapshotProcessing', false)
    }
  }

  const storeLocalSnapshot = (socket, snapshot, updatedTime) => {
    if (!isEmpty(snapshot)) {
      each(snapshot.getSnapshotItemsList(), item => {
        set(socket, `snapshot.${item.getChatId()}`, item)
      })
    }
    if (!isEmpty(updatedTime)) {
      set(socket, 'localSnapshotLastUpdated', updatedTime)
    }
  }

  const getSnapshot = async socket => {
    const currentChatID = get(socket, 'currentChatID')
    const currentAliasID = get(socket, 'currentAliasID')
    const realAliasID = get(socket, 'aliasID')
    const localSnapshotLastUpdated = get(socket, 'localSnapshotLastUpdated')
    const lastLeavingReads = get(socket, 'lastLeavingReads')

    // check snapshot last updated time
    const snapshotLastUpdated = await redis.get(`chat:snapshotLastUpdated:${realAliasID}`)
    const snapshotLastRefreshed = await redis.get(`chat:snapshotLastRefreshed:${realAliasID}`)

    if (!snapshotLastUpdated || !snapshotLastRefreshed || snapshotLastRefreshed <= get(config, 'server.snapshotForceRefreshedTime')) {
      const { snapshot, updatedTime } = await getSnapshotByRPC(realAliasID)
      storeLocalSnapshot(socket, snapshot, updatedTime)
      return snapshot
    }
    if (!commonUtils.getConfigBool(get(config, 'flags.alwaysGetSnapshot')) &&
        snapshotLastUpdated <= localSnapshotLastUpdated) {
      return null
    }

    // try to get snapshot from cache
    // add '(' means excluding this element
    // -inf means negative infinity, +inf means positive infinity
    const min = localSnapshotLastUpdated ? `(${localSnapshotLastUpdated}` : '-inf'
    const snapshotIndex = await redis.zrangebyscore(`GRA:snapshotIndex:${realAliasID}`, min, '+inf')

    // if there are no snapshot items when first time fetching, try to get it from gravitas
    if (min === '-inf' && isEmpty(snapshotIndex)) {
      const { snapshot, updatedTime } = await getSnapshotByRPC(realAliasID)
      storeLocalSnapshot(socket, snapshot, updatedTime)
      return snapshot
    }

    const fetchSnapshotItemJobs = map(snapshotIndex, async chatID => {
      // sharable snapshot items
      const snapshotItems = await redis.hgetall(`GRA:snapshotItems:${realAliasID}|${chatID}`)
      if (isEmpty(snapshotItems)) {
        unset(socket, `snapshot.${chatID}`)
      } else {
        set(socket, `snapshot.${chatID}`, transSnapshotItemsToProto(currentChatID, currentAliasID, snapshotItems, lastLeavingReads))
      }
    })

    // windup snapshot items
    let result

    try {
      await Promise.all(fetchSnapshotItemJobs)
      const snapshot = get(socket, 'snapshot')
      const snapshotItems = values(snapshot)
      if (!isEmpty(snapshotItems)) {
        result = new proto.beanfun.chat.v1.Snapshot()
        result.setSnapshotItemsList(snapshotItems)
      }
      set(socket, 'localSnapshotLastUpdated', snapshotLastUpdated)
    } catch (e) {
      logger.error(logUtils.composeFields(logUtils.Constants.FieldError, get(e, 'stack')), 'Get snapshot items cache failed, instead get snapshot by rpc')
      const { snapshot, updatedTime } = await getSnapshotByRPC(realAliasID)
      storeLocalSnapshot(socket, snapshot, updatedTime)
      result = snapshot
    }
    return result
  }

  const getSnapshotByRPC = async aliasID => {
    const rpcCommand = new proto.beanfun.chat.v1.GetSnapshotCommand([aliasID])
    const rpcResult = await gravitas.getSnapshot(rpcCommand)
    return {
      snapshot: rpcResult.getSnapshot(),
      updatedTime: rpcResult.getUpdatedTime()
    }
  }

  const transSnapshotItemsToProto = (currentChatID, currentAliasID, snapshotItems, lastLeavingReads) => {
    const result = new proto.beanfun.chat.v1.SnapshotItem()

    // check chatID
    const chatID = get(snapshotItems, 'chat_id')
    if (!chatID) {
      throw new Error('Chat id of snapshot item not found')
    }
    result.setChatId(chatID)

    // parse last message
    const lastMessage = get(snapshotItems, 'last_message') && get(snapshotItems, 'last_message') !== ''
      ? proto.beanfun.chat.v1.ChatMessage.deserializeBinary(Buffer.from(get(snapshotItems, 'last_message'), 'base64')) : null
    result.setLastMessage(lastMessage)

    // if the user in this chat, the unread count always is 0, otherwise according to snapshot value
    const unreadCount = get(snapshotItems, 'unread_count', 0)
    if (currentChatID === chatID && unreadCount > 0) {
      result.setUnreadCount(0)

      // FIXME: should move below code outside
      if (currentAliasID && lastMessage) {
        gravitas.readMessage({
          chat_id: currentChatID,
          user_id: currentAliasID,
          message_id: lastMessage.getMessageId()
        })
      }
    } else if (lastMessage && lastMessage.getMessageId() <= get(lastLeavingReads, chatID, 0)) {
      result.setUnreadCount(0)
    } else {
      result.setUnreadCount(unreadCount)
    }

    // set others fields
    result.setMentioned(get(snapshotItems, 'mentioned') === '1')
    result.setScheduled(get(snapshotItems, 'scheduled') === '1')
    result.setParticipantsCount(get(snapshotItems, 'participants_count'))
    result.setChatType(get(snapshotItems, 'chat_type'))
    result.setChatRole(get(snapshotItems, 'chat_role'))
    result.setPinned(get(snapshotItems, 'pinned') === '1')
    result.setMuted(get(snapshotItems, 'muted') === '1')
    result.setHaveApplicants(get(snapshotItems, 'have_applicants') === '1')
    result.setHaveSuspects(get(snapshotItems, 'have_suspects') === '1')
    result.setGameName(get(snapshotItems, 'game_name'))
    result.setChatSubject(get(snapshotItems, 'chat_subject'))
    result.setChatPhotoUri(get(snapshotItems, 'chat_photo_uri'))
    result.setSenderId(get(snapshotItems, 'sender_id'))
    result.setHidden(get(snapshotItems, 'hidden') === '1')
    result.setTargetId(get(snapshotItems, 'target_id'))
    result.setInvited(get(snapshotItems, 'invited') === '1')
    result.setInviter(get(snapshotItems, 'inviter'))
    result.setJoinedTime(get(snapshotItems, 'joined_time'))
    result.setInvitedTime(get(snapshotItems, 'invited_time'))
    result.setHaveWhispers(get(snapshotItems, 'have_whispers') === '1')
    result.setAliasId(get(snapshotItems, 'alias_id'))
    result.setIsOfficial(get(snapshotItems, 'is_official') === '1')
    result.setStartTime(get(snapshotItems, 'start_time'))
    return result
  }

  const checkSocketStatus = socket => {
    if (!socket || socket.disconnected) {
      logger.warn('There is a invalid snapshot timer running')
      return false
    }
    return true
  }

  const cleanSocketStatus = socket => {
    if (socket) {
      logger.warn('There is a invalid socket object exist, start cleaning')

      // clear timer for force disconnect
      clearTimeout(get(socket, 'forceDisconnectTimer'))

      // clear timer for fetching snapshot
      clearTimeout(get(socket, 'snapshotTimer'))

      // clear the other closure func
      unset(socket, 'userSubscriber')
      unset(socket, 'chatSubscriber')
      unset(socket, 'forceDisconnectTimer')
      unset(socket, 'snapshotTimer')
    }
  }

  return (socket, next) => {
    // proactively disconnect after login timeout
    const forceDisconnectTimer = setTimeout(() => {
      if (socket && !get(socket, 'authenticated')) {
        io.of('/').adapter.remoteDisconnect(socket.id, true, err => {
          if (err) {
            logger.error(logUtils.composeFields(logUtils.Constants.FieldData, socket.id, logUtils.Constants.FieldError, get(err, 'stack')), 'Remote disconnect failed')
          }
        })
      }
    }, get(config, 'server.loginTimeout'))

    set(socket, 'forceDisconnectTimer', forceDisconnectTimer)
    set(socket, 'subscribedFunctions', [])
    set(socket, 'customSessionID', `${get(config, 'server.hostName')}:${get(socket, 'id')}`)

    // listen to login
    interceptor.listenEvent(socket, 'v1/login', async (data, callback) => {
      const socketPkt = proto.beanfun.chat.v1.LoginPacket.deserializeBinary(data)
      const socketAck = new proto.beanfun.chat.v1.LoginAck()
      const token = socketPkt.getToken()
      const device = socketPkt.getDevice()
      const userAgent = socketPkt.getUserAgent()

      set(socket, 'token', token)
      set(socket, 'device', device || 'unknown')
      set(socket, 'userAgent', userAgent)

      // authenticate
      let authenticated
      try {
        authenticated = await authenticate(token)
      } catch (err) {
        const customErrCode = errs.tryGetCustomErrorCode(err)
        let m

        if (customErrCode && customErrCode === '30303') {
          socketAck.setSocketError(errs.transSocketErrToPbSocketErr(errs.ErrInvalidToken))
          m = 'Invalid token'
        } else {
          socketAck.setSocketError(errs.transSocketErrToPbSocketErr(errs.ErrUnknown))
          m = 'Authenticate failed'
        }
        commonUtils.executeCallback(callback, socketAck.serializeBinary().buffer)
        throw errs.newAppError(m, err)
      }

      // set required fields in the session
      set(socket, 'userID', get(authenticated, 'userID'))
      set(socket, 'openID', get(authenticated, 'openID'))
      set(socket, 'aliasID', toString(get(authenticated, 'aliasID')))
      set(socket, 'authenticated', true)
      logger.debug(logUtils.composeFields(
        logUtils.Constants.FieldToken, get(socket, 'token'),
        logUtils.Constants.FieldUserAgent, get(socket, 'userAgent'),
        logUtils.Constants.FieldData, JSON.stringify(authenticated)), 'User authenticated')

      // clear timer of force disconnect after authenticated
      clearTimeout(get(socket, 'forceDisconnectTimer'))

      // execute all subscribed functions
      each(get(socket, 'subscribedFunctions'), fn => { fn(socket) })

      // first fetch snapshot
      const startTime = timeUtils.getTimestamp()
      await processSnapshot(socket)
      logger.info(logUtils.composeFields(
        logUtils.Constants.FieldAliasID, get(socket, 'aliasID'),
        logUtils.Constants.FieldSessionID, get(socket, 'customSessionID'),
        logUtils.Constants.FieldElapsedTime, timeUtils.getTimestamp() - startTime),
      'First time acquire snapshot')

      // scheduled fetch snapshot
      const newSocketTimer = socket => setTimeout(async () => {
        // check whether socket is dead or disconnected
        if (checkSocketStatus(socket)) {
          // fetch snapshot
          await processSnapshot(socket)

          // add next timer to fetch snapshot continually
          set(socket, 'snapshotTimer', newSocketTimer(socket))
        } else {
          cleanSocketStatus(socket)
        }
      }, get(config, 'server.snapshotInterval'))
      set(socket, 'snapshotTimer', newSocketTimer(socket))

      // subscribe user channel
      const userSubscriber = {
        id: get(socket, 'id'),
        handler: async (path, payload) => {
          socket.emit(path, payload, () => {})
        }
      }
      set(socket, 'userSubscriber', userSubscriber)
      await chatUtils.remoteJoinChannel(io, socket, get(authenticated, 'aliasID'))
      await redis.subscribe(`channel:user:${get(authenticated, 'aliasID')}`, userSubscriber)

      // set socket session id to cache for app log check
      await memcached.setCache(`user:sessionID:${toString(get(authenticated, 'aliasID'))}`, get(socket, 'id'), 86400)
      socketAck.setSessionId(get(socket, 'id'))
      commonUtils.executeCallback(callback, socketAck.serializeBinary().buffer)
    })

    return next()
  }
}
