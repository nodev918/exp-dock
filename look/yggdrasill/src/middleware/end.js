const { get, unset } = require('lodash')
const logger = require('../logger')
const logUtils = require('../utils/log')
const redis = require('../datasource/redis')
const gravitas = require('../datasource/gravitas')

module.exports = () => {
  const handleDisconnect = socket => {
    socket.on('disconnect', async reason => {
      logger.debug(logUtils.composeFields(
        logUtils.Constants.FieldSessionID, get(socket, 'customSessionID'),
        logUtils.Constants.FieldAliasID, get(socket, 'aliasID'),
        logUtils.Constants.FieldReason, reason), 'Socket is disconnected')
      clearTimeout(get(socket, 'forceDisconnectTimer'))
      clearTimeout(get(socket, 'snapshotTimer'))
      unset(socket, 'forceDisconnectTimer')
      unset(socket, 'snapshotTimer')

      // unsubscribe user channel
      await redis.unsubscribe(`channel:user:${get(socket, 'aliasID')}`, get(socket, 'userSubscriber'))
      unset(socket, 'userSubscriber')

      const currentChatID = get(socket, 'currentChatID')
      const currentAliasID = get(socket, 'currentAliasID')
      if (currentChatID) {
        // unsubscribe chat channel
        await redis.unsubscribe(`channel:chat:${currentChatID}`, get(socket, 'chatSubscriber'))
        unset(socket, 'chatSubscriber')

        if (currentAliasID) {
          // read newest message if the user still in current chat
          gravitas.readNewestMessage({
            chat_id: currentChatID,
            user_id: currentAliasID
          })
        }
      }
    })
  }

  return (socket, next) => {
    const subscribedFunctions = get(socket, 'subscribedFunctions')
    subscribedFunctions.push(handleDisconnect)
    return next()
  }
}
