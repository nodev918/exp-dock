const { get, set, size, isEmpty, map, forEach, last } = require('lodash')
const commonUtils = require('../utils/common')
const chatUtils = require('../utils/chat')
const interceptor = require('../utils/interceptor')
const gravitas = require('../datasource/gravitas')
const errs = require('../utils/error')
const logger = require('../logger')
const logUtils = require('../utils/log')
const redis = require('../datasource/redis')
const config = require('../config')

module.exports = io => {
  const enableBystander = commonUtils.getConfigBool(get(config, 'featureFlags.enableBystander'))

  const getUnreadMessages = (socket, chatID, startedMessageID, userID) => {
    const rpcCommand = new proto.beanfun.chat.v1
      .GetUnreadMessagesCommand([chatID, startedMessageID, userID])
    gravitas.getUnreadMessages(rpcCommand).then(rpcResult => {
      const messages = rpcResult.getMessagesList()

      // check if can keep receiving new message
      if (get(socket, `keepReceivingNewMessage.${chatID}`)) {
        return null
      }

      // check if can keep receiving unread message
      if (!get(socket, `keepReceivingUnreadMessages.${chatID}`)) {
        return null
      }

      // FIXME: should be fine tuned
      // if there are no unread messages, enable the switch to allow online new message come in
      if (isEmpty(messages)) {
        set(socket, `keepReceivingNewMessage.${chatID}`, true)
        set(socket, `keepReceivingUnreadMessages.${chatID}`, false)
        return null
      }

      // packet the unread messages and wait ack before fetch next messages
      const hasUnread = rpcResult.getHasUnread()
      const socketPkt = new proto.beanfun.chat.v1.ReceiveMessagePacket()
      socketPkt.setMessagesList(messages)
      socketPkt.setHasUnread(hasUnread)
      // emit to client and wait for ack, check callback
      socket.emit('v1/message/receive', socketPkt.serializeBinary().buffer, data => {
        const socketAck = proto.beanfun.chat.v1.ReceiveMessageAck.deserializeBinary(data)
        getUnreadMessages(socket, chatID, socketAck.getLastMessageId(), userID)
      })
    }).catch(err => {
      logger.error(logUtils.composeFields(
        logUtils.Constants.FieldSessionID, get(socket, 'customSessionID'),
        logUtils.Constants.FieldError, errs.getStack(err)), 'get unread messages failed')
    })
  }

  // handle event which enter chat
  const handleEnteringChat = socket => {
    interceptor.listenEvent(socket, 'v1/chat/enter', async (data, callback) => {
      const socketPkt = proto.beanfun.chat.v1.EnterChatPacket.deserializeBinary(data)
      const socketAck = new proto.beanfun.chat.v1.EnterChatAck()
      const currentChatID = get(socket, 'currentChatID')
      const chatID = socketPkt.getChatId()
      const userID = socketPkt.getUserId()
      const lastMessageID = socketPkt.getLastMessageId()

      if (!chatID) {
        const m = 'Socket enter chat failed: There is no chat id'
        logger.error(logUtils.composeFields(
          logUtils.Constants.FieldUserID, userID,
          logUtils.Constants.FieldSessionID, get(socket, 'customSessionID')), m)
        commonUtils.executeCallback(callback, errs.transSocketErrToPbSocketErr(errs.ErrInvalidChatID).serializeBinary().buffer)
        throw errs.newAppError(m)
      }

      // leave old chat
      try {
        if (currentChatID && currentChatID !== chatID) {
          await chatUtils.remoteLeaveChannel(io, socket, currentChatID)
          await redis.unsubscribe(`channel:chat:${currentChatID}`, get(socket, 'chatSubscriber'))
        }
      } catch (err) {
        const m = 'Socket enter chat failed: Unsubscribe chat failed'
        logger.error(logUtils.composeFields(
          logUtils.Constants.FieldSessionID, get(socket, 'customSessionID'),
          logUtils.Constants.FieldChatID, currentChatID,
          logUtils.Constants.FieldUserID, userID), m)
        commonUtils.executeCallback(callback, errs.transSocketErrToPbSocketErr(errs.ErrRemoteLeaveChat).serializeBinary().buffer)
        throw errs.newAppError(m, err)
      }

      // get needed data of ack
      let rpcResult
      try {
        rpcResult = await gravitas.socketEnterChat(
          new proto.beanfun.chat.v1.SocketEnterChatCommand([chatID, userID, lastMessageID]))
      } catch (err) {
        const m = 'Socket enter chat failed: Call gravitas socket enter chat failed'
        logger.error(logUtils.composeFields(
          logUtils.Constants.FieldSessionID, get(socket, 'customSessionID'),
          logUtils.Constants.FieldChatID, chatID,
          logUtils.Constants.FieldUserID, userID), m)
        const customErrorCode = errs.tryGetCustomErrorCode(err)
        if (customErrorCode) {
          socketAck.setSocketError(new proto.beanfun.chat.v1.SocketError([customErrorCode, get(err, 'details')]))
        } else {
          socketAck.setSocketError(errs.transSocketErrToPbSocketErr(errs.ErrSocketEnterChat))
        }
        commonUtils.executeCallback(callback, socketAck.serializeBinary().buffer)
        throw errs.newAppError(m, err)
      }

      const isBlocking = rpcResult.getIsBlocking()
      set(socket, `blocking:${chatID}`, isBlocking)

      // windup ack
      socketAck.setMessagesList(rpcResult.getMessagesList())
      socketAck.setUpdatedMessageIdsList(rpcResult.getUpdatedMessageIdsList())
      socketAck.setChatsLastUpdated(rpcResult.getChatsLastUpdatedTime())
      socketAck.setPinsLastUpdated(rpcResult.getPinsLastUpdatedTime())
      socketAck.setOthersLastRead(rpcResult.getOthersLastReadId())
      socketAck.setSelfLastRead(rpcResult.getSelfLastReadId())
      socketAck.setUnreadMentionMessageId(rpcResult.getEarliestMentionId())
      socketAck.setHasNext(rpcResult.getHasNext())
      socketAck.setVoteLastUpdated(rpcResult.getVotesLastUpdatedTime())

      // return directly if blocking
      if (isBlocking) {
        commonUtils.executeCallback(callback, socketAck.serializeBinary().buffer)
        return
      }

      // enter new chat
      set(socket, `keepReceivingNewMessage.${chatID}`, false)
      set(socket, `keepReceivingUnreadMessages.${chatID}`, true)
      set(socket, 'currentChatID', chatID)
      set(socket, 'currentAliasID', userID)

      // if enter chat as participant then delete isBystander flag
      if (enableBystander) {
        const isBystander = get(socket, 'isBystander')
        if (isBystander && isBystander === true) {
          delete socket['isBystander']
        }
      }

      try {
        if (!get(socket, 'chatSubscriber')) {
          set(socket, 'chatSubscriber', {
            id: get(socket, 'id'),
            handler: async (path, payload, filters) => {
              if (!commonUtils.getConfigBool(get(config, 'flags.doNotHandleEvent'))) {
                // // FIXME: should be fine tuned
                const currentChatID = get(socket, 'currentChatID')
                const currentAliasID = get(socket, 'currentAliasID')
                const sessionID = get(socket, 'customSessionID')

                logger.debug(logUtils.composeFields(
                  logUtils.Constants.FieldPath, path,
                  logUtils.Constants.FieldSessionID, sessionID,
                  logUtils.Constants.FieldChatID, currentChatID,
                  logUtils.Constants.FieldUserID, currentAliasID), 'Got Socket Event')

                let doEmit = true
                switch (path) {
                  case 'v1/message/receive':
                    // do not broadcast if user stop to receiving new message
                    if (!get(socket, `keepReceivingNewMessage.${currentChatID}`)) {
                      doEmit = false
                    }

                    // do not broadcast if user should filter
                    forEach(filters, filter => {
                      if (filter.sessionID && filter.sessionID === sessionID) {
                        doEmit = false
                      }
                      if (filter.aliasID && filter.aliasID === currentAliasID) {
                        doEmit = false
                      }
                    })
                    break
                }
                if (commonUtils.getConfigBool(get(config, 'flags.doNotEmitEvent'))) {
                  doEmit = false
                }

                // emit the event
                if (doEmit) {
                  logger.debug(logUtils.composeFields(
                    logUtils.Constants.FieldPath, path,
                    logUtils.Constants.FieldSessionID, sessionID,
                    logUtils.Constants.FieldChatID, currentChatID,
                    logUtils.Constants.FieldUserID, currentAliasID), 'Got Socket Event')
                  socket.emit(path, payload)
                }
              }
            }
          })
        }

        await chatUtils.remoteJoinChannel(io, socket, chatID)
        await redis.subscribe(`channel:chat:${chatID}`, get(socket, 'chatSubscriber'))
      } catch (err) {
        const m = 'Socket enter chat failed: Subscribe chat failed'
        logger.error(logUtils.composeFields(
          logUtils.Constants.FieldSessionID, get(socket, 'customSessionID'),
          logUtils.Constants.FieldChatID, chatID,
          logUtils.Constants.FieldUserID, userID), m)
        commonUtils.executeCallback(callback, errs.transSocketErrToPbSocketErr(errs.ErrRemoteJoinChat).serializeBinary().buffer)
        throw errs.newAppError(m, err)
      }

      commonUtils.executeCallback(callback, socketAck.serializeBinary().buffer)

      // start to get unread messages continually
      if (rpcResult.getHasNext()) {
        const lastMessage = last(rpcResult.getMessagesList())
        getUnreadMessages(socket, chatID, lastMessage.getMessageId(), userID)
      } else {
        set(socket, `keepReceivingNewMessage.${chatID}`, true)
        set(socket, `keepReceivingUnreadMessages.${chatID}`, false)
      }
    })
  }

  // handle event which leave chat
  const handleLeavingChat = socket => {
    interceptor.listenEvent(socket, 'v1/chat/leave', async (data, callback) => {
      const socketPkt = proto.beanfun.chat.v1.LeaveChatPacket.deserializeBinary(data)
      const chatID = socketPkt.getChatId()
      const userID = socketPkt.getUserId()

      if (enableBystander) {
        const isBystander = get(socket, 'isBystander')
        if (isBystander && isBystander === true) {
          commonUtils.executeCallback(callback, errs.transSocketErrToPbSocketErr(errs.ErrInvalidOperation).serializeBinary().buffer)
          return
        }
      }

      // leave old chat
      try {
        await chatUtils.remoteLeaveChannel(io, socket, chatID)
        await redis.unsubscribe(`channel:chat:${chatID}`, get(socket, 'chatSubscriber'))
      } catch (err) {
        const m = 'Unsubscribe to channel failed'
        logger.error(logUtils.composeFields(
          logUtils.Constants.FieldSessionID, get(socket, 'customSessionID')), m)
        commonUtils.executeCallback(callback, errs.transSocketErrToPbSocketErr(errs.ErrRemoteLeaveChat).serializeBinary().buffer)
        throw errs.newAppError(m, err)
      }

      // delete old chat record
      delete socket.currentChatID
      delete socket.currentAliasID
      delete socket[`keepReceivingUnreadMessages.${chatID}`]
      delete socket[`keepReceivingNewMessage.${chatID}`]
      delete socket['isBystander']

      // leave chat
      const rpcResult = await gravitas.socketLeaveChat(
        new proto.beanfun.chat.v1.SocketLeaveChatCommand([chatID, userID, get(socket, `blocking:${chatID}`, false)]))

      // record last leaving read id
      set(socket, `lastLeavingReads.${chatID}`, rpcResult.getReadId())

      // windup
      const leaveChatAck = new proto.beanfun.chat.v1.LeaveChatAck()
      leaveChatAck.setMessagesList(rpcResult.getMessagesList())
      leaveChatAck.setSocketError(new proto.beanfun.chat.v1.SocketError())
      commonUtils.executeCallback(callback, leaveChatAck.serializeBinary().buffer)
    })
  }

  const handleBystanderEnterChat = socket => {
    interceptor.listenEvent(socket, 'v1/chat/bystanderEnter', async (data, callback) => {
      const socketPkt = proto.beanfun.chat.v1.ByStanderEnterChatPacket.deserializeBinary(data)
      const socketAck = new proto.beanfun.chat.v1.ByStanderEnterChatAck()
      const currentChatID = get(socket, 'currentChatID')
      const chatID = socketPkt.getChatId()
      const realUserID = socketPkt.getRealUserId()

      if (!chatID) {
        const m = 'Socket bystander enter chat failed: There is no chat id'
        logger.error(logUtils.composeFields(
          logUtils.Constants.FieldUserID, realUserID,
          logUtils.Constants.FieldSessionID, get(socket, 'customSessionID')), m)
        commonUtils.executeCallback(callback, errs.transSocketErrToPbSocketErr(errs.ErrInvalidChatID).serializeBinary().buffer)
        throw errs.newAppError(m)
      }

      // leave old chat
      try {
        if (currentChatID && currentChatID !== chatID) {
          await chatUtils.remoteLeaveChannel(io, socket, currentChatID)
          await redis.unsubscribe(`channel:chat:${currentChatID}`, get(socket, 'chatSubscriber'))
        }
      } catch (err) {
        const m = 'Socket bystander enter chat failed: Unsubscribe chat failed'
        logger.error(logUtils.composeFields(
          logUtils.Constants.FieldSessionID, get(socket, 'customSessionID'),
          logUtils.Constants.FieldChatID, currentChatID,
          logUtils.Constants.FieldUserID, realUserID), m)
        commonUtils.executeCallback(callback, errs.transSocketErrToPbSocketErr(errs.ErrRemoteLeaveChat).serializeBinary().buffer)
        throw errs.newAppError(m, err)
      }

      // get needed data of ack
      let rpcResult
      try {
        rpcResult = await gravitas.socketBystanderEnterChat(
          new proto.beanfun.chat.v1.SocketBystanderEnterChatCommand([chatID, realUserID]))
      } catch (err) {
        const m = 'Socket bystander enter chat failed: Call gravitas socket enter chat failed'
        logger.error(logUtils.composeFields(
          logUtils.Constants.FieldSessionID, get(socket, 'customSessionID'),
          logUtils.Constants.FieldChatID, chatID,
          logUtils.Constants.FieldUserID, realUserID), m)
        const customErrorCode = errs.tryGetCustomErrorCode(err)
        if (customErrorCode) {
          socketAck.setSocketError(new proto.beanfun.chat.v1.SocketError([customErrorCode, get(err, 'details')]))
        } else {
          socketAck.setSocketError(errs.transSocketErrToPbSocketErr(errs.ErrSocketEnterChat))
        }
        commonUtils.executeCallback(callback, socketAck.serializeBinary().buffer)
        throw errs.newAppError(m, err)
      }

      // windup ack
      socketAck.setMessagesList(rpcResult.getMessagesList())
      socketAck.setChatsLastUpdated(rpcResult.getChatsLastUpdatedTime())
      socketAck.setPinsLastUpdated(rpcResult.getPinsLastUpdatedTime())
      socketAck.setVoteLastUpdated(rpcResult.getVotesLastUpdatedTime())

      // enter new chat
      set(socket, `keepReceivingNewMessage.${chatID}`, true)
      set(socket, `keepReceivingUnreadMessages.${chatID}`, false)
      set(socket, 'currentChatID', chatID)
      set(socket, 'currentAliasID', realUserID)
      // add bystander flag for blocking participant operation
      set(socket, 'isBystander', true)

      try {
        if (!get(socket, 'chatSubscriber')) {
          set(socket, 'chatSubscriber', {
            id: get(socket, 'id'),
            handler: async (path, payload, filters) => {
              if (!commonUtils.getConfigBool(get(config, 'flags.doNotHandleEvent'))) {
                // // FIXME: should be fine tuned
                const currentChatID = get(socket, 'currentChatID')
                const currentAliasID = get(socket, 'currentAliasID')
                const sessionID = get(socket, 'customSessionID')

                logger.debug(logUtils.composeFields(
                  logUtils.Constants.FieldPath, path,
                  logUtils.Constants.FieldSessionID, sessionID,
                  logUtils.Constants.FieldChatID, currentChatID,
                  logUtils.Constants.FieldUserID, currentAliasID), 'Got Socket Event')

                let doEmit = true
                switch (path) {
                  case 'v1/message/receive':
                    // do not broadcast if user stop to receiving new message
                    if (!get(socket, `keepReceivingNewMessage.${currentChatID}`)) {
                      doEmit = false
                    }

                    // do not broadcast if user should filter
                    forEach(filters, filter => {
                      if (filter.sessionID && filter.sessionID === sessionID) {
                        doEmit = false
                      }
                      if (filter.aliasID && filter.aliasID === currentAliasID) {
                        doEmit = false
                      }
                    })
                    break
                }
                if (commonUtils.getConfigBool(get(config, 'flags.doNotEmitEvent'))) {
                  doEmit = false
                }

                // emit the event
                if (doEmit) {
                  logger.debug(logUtils.composeFields(
                    logUtils.Constants.FieldPath, path,
                    logUtils.Constants.FieldSessionID, sessionID,
                    logUtils.Constants.FieldChatID, currentChatID,
                    logUtils.Constants.FieldUserID, currentAliasID), 'Got Socket Event')
                  socket.emit(path, payload)
                }
              }
            }
          })
        }

        await chatUtils.remoteJoinChannel(io, socket, chatID)
        await redis.subscribe(`channel:chat:${chatID}`, get(socket, 'chatSubscriber'))
      } catch (err) {
        const m = 'Socket enter chat failed: Subscribe chat failed'
        logger.error(logUtils.composeFields(
          logUtils.Constants.FieldSessionID, get(socket, 'customSessionID'),
          logUtils.Constants.FieldChatID, chatID,
          logUtils.Constants.FieldUserID, realUserID), m)
        commonUtils.executeCallback(callback, errs.transSocketErrToPbSocketErr(errs.ErrRemoteJoinChat).serializeBinary().buffer)
        throw errs.newAppError(m, err)
      }

      commonUtils.executeCallback(callback, socketAck.serializeBinary().buffer)
    })
  }

  const handleBystanderLeavingChat = socket => {
    interceptor.listenEvent(socket, 'v1/chat/bystanderLeave', async (data, callback) => {
      const socketPkt = proto.beanfun.chat.v1.ByStanderLeaveChatPacket.deserializeBinary(data)
      const chatID = socketPkt.getChatId()
      const realRserID = socketPkt.getRealUserId()

      // leave old chat
      try {
        await chatUtils.remoteLeaveChannel(io, socket, chatID)
        await redis.unsubscribe(`channel:chat:${chatID}`, get(socket, 'chatSubscriber'))
      } catch (err) {
        const m = 'Unsubscribe to channel failed'
        logger.error(logUtils.composeFields(
          logUtils.Constants.FieldSessionID, get(socket, 'customSessionID')), m)
        commonUtils.executeCallback(callback, errs.transSocketErrToPbSocketErr(errs.ErrRemoteLeaveChat).serializeBinary().buffer)
        throw errs.newAppError(m, err)
      }

      // delete old chat record
      delete socket.currentChatID
      delete socket.currentAliasID
      delete socket[`keepReceivingUnreadMessages.${chatID}`]
      delete socket[`keepReceivingNewMessage.${chatID}`]
      delete socket['isBystander']

      // leave chat
      await gravitas.socketBystanderLeaveChat(
        new proto.beanfun.chat.v1.SocketBystanderLeaveChatCommand([chatID, realRserID, get(socket, `blocking:${chatID}`, false)]))

      // windup
      const leaveChatAck = new proto.beanfun.chat.v1.ByStanderLeaveChatAck()
      leaveChatAck.setSocketError(new proto.beanfun.chat.v1.SocketError())
      commonUtils.executeCallback(callback, leaveChatAck.serializeBinary().buffer)
    })
  }

  const handleSendingTyping = socket => {
    interceptor.listenEvent(socket, 'v1/typing/send', async (data, callback) => {
      if (enableBystander) {
        const isBystander = get(socket, 'isBystander')
        if (isBystander && isBystander === true) {
          commonUtils.executeCallback(callback, errs.transSocketErrToPbSocketErr(errs.ErrInvalidOperation).serializeBinary().buffer)
          return
        }
      }

      const currentChatID = get(socket, 'currentChatID')
      socket.to(currentChatID).volatile.emit('v1/typing/receive', data)
      commonUtils.executeCallback(callback, {})
    })
  }

  // handle event which send message
  const handleSendingMessage = socket => {
    interceptor.listenEvent(socket, 'v1/message/send', async (data, callback) => {
      const socketPkt = proto.beanfun.chat.v1.SendMessagePacket.deserializeBinary(data)
      const socketAck = new proto.beanfun.chat.v1.SendMessageAck()

      if (enableBystander) {
        const isBystander = get(socket, 'isBystander')
        if (isBystander && isBystander === true) {
          commonUtils.executeCallback(callback, errs.transSocketErrToPbSocketErr(errs.ErrInvalidOperation).serializeBinary().buffer)
          return
        }
      }

      // check request id
      let hasRequestID = false
      const requestID = socketPkt.getRequestId()
      if (requestID) {
        if (requestID === get(socket, 'lastRequestID') && get(socket, 'lastRequestMessage')) {
          commonUtils.executeCallback(callback, get(socket, 'lastRequestMessage'))
          return
        }
        hasRequestID = true
      }

      const rawMessage = new proto.beanfun.chat.v1.RawMessage()
      rawMessage.setMimeType(socketPkt.getMimeType())
      rawMessage.setContent(socketPkt.getContent())
      rawMessage.setMetadata(socketPkt.getMetadata())
      rawMessage.setTtl(socketPkt.getTtl())
      rawMessage.setExpiredTime(socketPkt.getExpiredTime())

      const rpcCommand = new proto.beanfun.chat.v1.SendMessageCommand()
      rpcCommand.setChatId(socketPkt.getChatId())
      rpcCommand.setSenderId(socketPkt.getSenderId())
      rpcCommand.setRawMessage(rawMessage)
      rpcCommand.setReplyMessage(socketPkt.getReplyMessage())
      rpcCommand.setDevice(get(socket, 'device'))
      rpcCommand.setSessionId(get(socket, 'customSessionID'))
      let rpcResult

      try {
        rpcResult = await gravitas.sendMessage(rpcCommand)
      } catch (err) {
        const m = 'Send message failed'
        const socketErr = (errs.ErrSendMessage.clone).withMessage(get(err, 'message'))
        socketAck.setSocketError(errs.transSocketErrToPbSocketErr(socketErr))
        commonUtils.executeCallback(callback, socketAck.serializeBinary().buffer)
        throw errs.newAppError(m, err)
      }

      // compose socketAck for ack to client in this callback
      const chatMessage = rpcResult.getMessage()
      socketAck.setMessage(chatMessage)
      const buffer = socketAck.serializeBinary().buffer
      commonUtils.executeCallback(callback, buffer)

      // store last requested message
      if (hasRequestID) {
        set(socket, 'lastRequestID', requestID)
        set(socket, 'lastRequestMessage', buffer)
      }
    })
  }

  const handleForwardingMessages = socket => {
    interceptor.listenEvent(socket, 'v1/message/forward', async (data, callback) => {
      const socketPkt = proto.beanfun.chat.v1.ForwardMessagesPacket.deserializeBinary(data)
      const socketAck = new proto.beanfun.chat.v1.ForwardMessagesAck()
      const chatIDs = socketPkt.getChatIdsList()
      const senderIDs = socketPkt.getSenderIdsList()

      if (enableBystander) {
        const isBystander = get(socket, 'isBystander')
        if (isBystander && isBystander === true) {
          commonUtils.executeCallback(callback, errs.transSocketErrToPbSocketErr(errs.ErrInvalidOperation).serializeBinary().buffer)
          return
        }
      }

      // check requested payload if valid
      if (size(chatIDs) === 0 || size(chatIDs) !== size(senderIDs)) {
        socketAck.setSocketError(errs.transSocketErrToPbSocketErr(errs.ErrSendMessage))
        commonUtils.executeCallback(callback, socketAck.serializeBinary().buffer)
        throw errs.newAppError('Invalid arguments')
      }

      // compose demand messages
      const messageList = []
      forEach(chatIDs, (chatID, idx) => {
        forEach(socketPkt.getRawMessagesList(), rawMessage => {
          const demandMessage = new proto.beanfun.chat.v1.DemandMessage()
          demandMessage.setChatId(chatID)
          demandMessage.setSenderId(senderIDs[idx])
          demandMessage.setRawMessage(rawMessage)
          messageList.push(demandMessage)
        })
      })

      // call batch send messages to gravitas
      const rpcCommand = new proto.beanfun.chat.v1.BatchSendMessagesCommand()
      rpcCommand.setDevice(get(socket, 'device'))
      rpcCommand.setMessagesList(messageList)
      rpcCommand.setSessionId(get(socket, 'id'))
      let rpcResult

      try {
        rpcResult = await gravitas.batchSendMessages(rpcCommand)
      } catch (err) {
        const m = 'Forward messages failed'
        socketAck.setSocketError(errs.transSocketErrToPbSocketErr(errs.ErrSendMessage))
        commonUtils.executeCallback(callback, socketAck.serializeBinary().buffer)
        throw errs.newAppError(m, err)
      }

      // socketAck to client
      socketAck.setMessagesList(rpcResult.getMessagesList())
      socketAck.setFailedChatIdsList(rpcResult.getFailedChatIdsList())
      commonUtils.executeCallback(callback, socketAck.serializeBinary().buffer)
    })
  }

  // handle event which send message
  const handleSendingMessageV2 = socket => {
    interceptor.listenEvent(socket, 'v2/message/send', async (data, callback) => {
      const socketPkt = proto.beanfun.chat.v1.SendMessageV2Packet.deserializeBinary(data)
      const socketAck = new proto.beanfun.chat.v1.SendMessageAck()

      if (enableBystander) {
        const isBystander = get(socket, 'isBystander')
        if (isBystander && isBystander === true) {
          commonUtils.executeCallback(callback, errs.transSocketErrToPbSocketErr(errs.ErrInvalidOperation).serializeBinary().buffer)
          return
        }
      }

      // check request id
      const requestID = socketPkt.getRequestId()
      if (requestID !== '0') {
        if (requestID === get(socket, 'lastRequestID')) {
          socketAck.setSocketError(errs.transSocketErrToPbSocketErr(errs.ErrSendMessage))
          commonUtils.executeCallback(callback, socketAck.serializeBinary().buffer)
        }
        set(socket, 'lastRequestID', requestID)
      }

      const rpcCommand = new proto.beanfun.chat.v1.SendMessageCommand()
      rpcCommand.setChatId(socketPkt.getChatId())
      rpcCommand.setSenderId(socketPkt.getSenderId())
      rpcCommand.setRawMessage(socketPkt.getRawMessage())
      rpcCommand.setReplyMessage(socketPkt.getReplyMessage())
      rpcCommand.setDevice(get(socket, 'device'))
      let rpcResult

      try {
        rpcResult = await gravitas.sendMessage(rpcCommand)
      } catch (err) {
        const m = 'Send message failed'
        const socketErr = (errs.ErrSendMessage.clone).withMessage()
        socketAck.setSocketError(errs.transSocketErrToPbSocketErr(socketErr))
        commonUtils.executeCallback(callback, socketAck.serializeBinary().buffer)
        throw errs.newAppError(m, err)
      }

      // compose socketAck for ack to client in this callback
      const chatMessage = rpcResult.getMessage()
      socketAck.setMessage(chatMessage)
      const buffer = socketAck.serializeBinary().buffer
      commonUtils.executeCallback(callback, buffer)
    })
  }

  const handleHistoryMessages = socket => {
    interceptor.listenEvent(socket, 'v1/message/history', async (data, callback) => {
      const socketPkt = proto.beanfun.chat.v1.HistoryMessagesPacket.deserializeBinary(data)
      const socketAck = new proto.beanfun.chat.v1.HistoryMessagesAck()
      const rpcCommand = new proto.beanfun.chat.v1
        .GetHistoryMessageCommand([socketPkt.getChatId(), socketPkt.getMessageId(), socketPkt.getUserId()])
      const rpcResult = await gravitas.getHistoryMessages(rpcCommand)
      const messages = rpcResult.getMessagesList()
      socketAck.setMessagesList(messages)
      socketAck.setSocketError(new proto.beanfun.chat.v1.SocketError())
      commonUtils.executeCallback(callback, socketAck.serializeBinary().buffer)
    })
  }

  const handleNewestMessages = socket => {
    interceptor.listenEvent(socket, 'v1/message/newest', async (data, callback) => {
      const socketPkt = proto.beanfun.chat.v1.NewestMessagesPacket.deserializeBinary(data)
      const socketAck = new proto.beanfun.chat.v1.NewestMessagesAck()
      set(socket, `keepReceivingNewMessage.${socketPkt.getChatId()}`, true)
      set(socket, `keepReceivingUnreadMessages.${socketPkt.getChatId()}`, false)
      const rpcCommand = new proto.beanfun.chat.v1
        .GetNewestMessagesCommand([socketPkt.getChatId(), socketPkt.getUserId()])
      const rpcResult = await gravitas.getNewestMessages(rpcCommand)
      const messages = rpcResult.getMessagesList()
      socketAck.setMessagesList(messages)
      socketAck.setSocketError(new proto.beanfun.chat.v1.SocketError())
      commonUtils.executeCallback(callback, socketAck.serializeBinary().buffer)
    })
  }

  const handleAroundMessages = socket => {
    interceptor.listenEvent(socket, 'v1/message/around', async (data, callback) => {
      const socketPkt = proto.beanfun.chat.v1.AroundMessagesPacket.deserializeBinary(data)
      const socketAck = new proto.beanfun.chat.v1.AroundMessagesAck()
      const rpcCommand = new proto.beanfun.chat.v1
        .GetAroundMessagesCommand([socketPkt.getChatId(), socketPkt.getMessageId(), socketPkt.getUserId()])
      set(socket, `keepReceivingNewMessage.${socketPkt.getChatId()}`, false)
      set(socket, `keepReceivingUnreadMessages.${socketPkt.getChatId()}`, false)
      const rpcResult = await gravitas.getAroundMessages(rpcCommand)
      const messages = rpcResult.getMessagesList()
      socketAck.setMessagesList(messages)
      socketAck.setSocketError(new proto.beanfun.chat.v1.SocketError())
      commonUtils.executeCallback(callback, socketAck.serializeBinary().buffer)
    })
  }

  const handleNextMessages = socket => {
    interceptor.listenEvent(socket, 'v1/message/next', async (data, callback) => {
      const socketPkt = proto.beanfun.chat.v1.NextMessagesPacket.deserializeBinary(data)
      const socketAck = new proto.beanfun.chat.v1.NextMessagesAck()
      const rpcCommand = new proto.beanfun.chat.v1
        .GetUnreadMessagesCommand([socketPkt.getChatId(), socketPkt.getMessageId(), socketPkt.getUserId()])
      const rpcResult = await gravitas.getNextMessages(rpcCommand)
      const messages = rpcResult.getMessagesList()
      if (isEmpty(messages)) {
        set(socket, `keepReceivingNewMessage.${socketPkt.getChatId()}`, true)
        set(socket, `keepReceivingUnreadMessages.${socketPkt.getChatId()}`, false)
      }
      socketAck.setMessagesList(messages)
      socketAck.setSocketError(new proto.beanfun.chat.v1.SocketError())
      commonUtils.executeCallback(callback, socketAck.serializeBinary().buffer)
    })
  }

  const handleRecallMessage = socket => {
    interceptor.listenEvent(socket, 'v1/message/recall', async (data, callback) => {
      const socketPkt = proto.beanfun.chat.v1.RecallMessagePacket.deserializeBinary(data)
      const socketAck = new proto.beanfun.chat.v1.RecallMessageAck()

      if (enableBystander) {
        const isBystander = get(socket, 'isBystander')
        if (isBystander && isBystander === true) {
          commonUtils.executeCallback(callback, errs.transSocketErrToPbSocketErr(errs.ErrInvalidOperation).serializeBinary().buffer)
          return
        }
      }

      const rpcCommand = new proto.beanfun.chat.v1
        .RecallMessageCommand([socketPkt.getChatId(), socketPkt.getMessageId(), socketPkt.getRecallerId()])
      let rpcResult

      try {
        rpcResult = await gravitas.recallMessage(rpcCommand)
      } catch (err) {
        const m = 'Recall message failed'
        socketAck.setSocketError(errs.transSocketErrToPbSocketErr(errs.ErrRecallMessage))
        commonUtils.executeCallback(callback, socketAck.serializeBinary().buffer)
        throw errs.newAppError(m, err)
      }

      const chatMessage = rpcResult.getMessage()
      socketAck.setRecalledMessage(chatMessage)
      commonUtils.executeCallback(callback, socketAck.serializeBinary().buffer)

      // broadcast to everyone in this chat (include self)
      const messageEventItem = new proto.beanfun.chat.v1.MessageEventItem()
      messageEventItem.setMessageEventType(proto.beanfun.chat.v1.MessageEventType.MESSAGE_EVENT_TYPE_RECALLED)
      messageEventItem.setMessageId(socketPkt.getMessageId())
      messageEventItem.setMessage(chatMessage)
      messageEventItem.setChatId(socketPkt.getChatId())
      const messageEvent = new proto.beanfun.chat.v1.MessageEvent()
      messageEvent.addMessageEventItems(messageEventItem)
      redis.publish(`channel:chat:${socketPkt.getChatId()}`, JSON.stringify({
        path: 'v1/event/messages',
        payload: Buffer.from(messageEvent.serializeBinary().buffer).toString('base64')
      }))
      commonUtils.executeCallback(callback, socketAck.serializeBinary().buffer)
    })
  }

  const handleReadMessages = socket => {
    interceptor.listenEvent(socket, 'v1/read/send', async (data, callback) => {
      const socketPkt = proto.beanfun.chat.v1.SendReadPacket.deserializeBinary(data)
      const socketAck = new proto.beanfun.chat.v1.SendReadAck()

      if (enableBystander) {
        const isBystander = get(socket, 'isBystander')
        if (isBystander && isBystander === true) {
          commonUtils.executeCallback(callback, errs.transSocketErrToPbSocketErr(errs.ErrInvalidOperation).serializeBinary().buffer)
          return
        }
      }

      await Promise.all(map(socketPkt.getReadsList(), read =>
        gravitas.readMessage({
          user_id: read.getSenderId(),
          chat_id: read.getChatId(),
          message_id: read.getMessageId()
        })
      ))
      commonUtils.executeCallback(callback, socketAck.serializeBinary().buffer)
    })
  }

  const handleScheduleMessage = socket => {
    interceptor.listenEvent(socket, 'v1/message/schedule', async (data, callback) => {
      const socketPkt = proto.beanfun.chat.v1.ScheduleMessagePacket.deserializeBinary(data)
      const socketAck = new proto.beanfun.chat.v1.ScheduleMessageAck()

      if (enableBystander) {
        const isBystander = get(socket, 'isBystander')
        if (isBystander && isBystander === true) {
          commonUtils.executeCallback(callback, errs.transSocketErrToPbSocketErr(errs.ErrInvalidOperation).serializeBinary().buffer)
          return
        }
      }

      // check request id
      const requestID = socketPkt.getRequestId()
      if (requestID !== '0') {
        if (requestID === get(socket, 'lastRequestID')) {
          socketAck.setSocketError(errs.transSocketErrToPbSocketErr(errs.ErrSendScheduleMessage))
          commonUtils.executeCallback(callback, socketAck.serializeBinary().buffer)
        }
        set(socket, 'lastRequestID', requestID)
      }

      const rpcCommand = new proto.beanfun.chat.v1.SendScheduleMessageCommand()
      rpcCommand.setChatId(socketPkt.getChatId())
      rpcCommand.setSenderId(socketPkt.getSenderId())
      rpcCommand.setRawMessage(socketPkt.getRawMessage())
      rpcCommand.setReplyMessage(socketPkt.getReplyMessage())
      rpcCommand.setScheduleTime(socketPkt.getScheduleTime())
      rpcCommand.setDevice(get(socket, 'device'))
      let rpcResult

      try {
        rpcResult = await gravitas.sendScheduleMessage(rpcCommand)
      } catch (err) {
        const m = 'Send schedule message failed'
        logger.error(logUtils.composeFields(
          logUtils.Constants.FieldSessionID, get(socket, 'customSessionID')), m)
        const socketErr = (errs.ErrSendScheduleMessage.clone).withMessage(get(err, 'message'))
        socketAck.setSocketError(errs.transSocketErrToPbSocketErr(socketErr))
        commonUtils.executeCallback(callback, socketAck.serializeBinary().buffer)
        throw errs.newAppError(m, err)
      }

      socketAck.setScheduleId(rpcResult.getScheduleId())
      socketAck.setSocketError(new proto.beanfun.chat.v1.SocketError())
      commonUtils.executeCallback(callback, socketAck.serializeBinary().buffer)
    })
  }

  return (socket, next) => {
    const subscribedFunctions = get(socket, 'subscribedFunctions')
    subscribedFunctions.push(handleSendingMessage)
    subscribedFunctions.push(handleForwardingMessages)
    subscribedFunctions.push(handleSendingMessageV2)
    subscribedFunctions.push(handleEnteringChat)
    subscribedFunctions.push(handleLeavingChat)
    subscribedFunctions.push(handleSendingTyping)
    subscribedFunctions.push(handleHistoryMessages)
    subscribedFunctions.push(handleNewestMessages)
    subscribedFunctions.push(handleAroundMessages)
    subscribedFunctions.push(handleNextMessages)
    subscribedFunctions.push(handleRecallMessage)
    subscribedFunctions.push(handleReadMessages)
    subscribedFunctions.push(handleScheduleMessage)
    if (enableBystander) {
      subscribedFunctions.push(handleBystanderEnterChat)
      subscribedFunctions.push(handleBystanderLeavingChat)
    }
    return next()
  }
}
