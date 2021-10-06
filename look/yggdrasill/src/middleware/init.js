const { get } = require('lodash')
const commonUtils = require('../utils/common')
const interceptor = require('../utils/interceptor')
const gravitas = require('../datasource/gravitas')
const configs = require('../config')

module.exports = () => {
  const handleInitialization = socket => {
    interceptor.listenEvent(socket, 'v1/init', async (data, callback) => {
      const mainInfo = await gravitas.getMainInfo({ alias_id: get(socket, 'aliasID') })
      const socketAck = new proto.beanfun.chat.v1.InitAck()
      socketAck.setChatsLastUpdated(get(mainInfo, 'chats_last_updated'))
      socketAck.setUsersLastUpdated(get(mainInfo, 'users_last_updated'))
      socketAck.setUserSubscriptionsLastUpdated(get(mainInfo, 'user_subscriptions_last_updated'))
      socketAck.setNotificationsLastUpdated(get(mainInfo, 'notifications_last_updated'))
      socketAck.setAssetPointLastUpdated(get(mainInfo, 'asset_point_last_updated'))
      socketAck.setAssetTreasureLastUpdated(get(mainInfo, 'asset_treasure_last_updated'))
      socketAck.setAssetBoxLastUpdated(get(mainInfo, 'asset_box_last_updated'))
      socketAck.setAssetBonusLastUpdated(get(mainInfo, 'asset_bonus_last_updated'))
      socketAck.setAssetTicketLastUpdated(get(mainInfo, 'asset_ticket_last_updated'))
      socketAck.setAssetCardLastUpdated(get(mainInfo, 'asset_card_last_updated'))
      socketAck.setAssetTradeCenterLastUpdated(get(mainInfo, 'asset_trade_center_last_updated'))
      socketAck.setAssetTradeCenterHistoryLastUpdated(get(mainInfo, 'asset_trade_center_history_last_updated'))
      socketAck.setJollybuyLastUpdated(get(mainInfo, 'jollybuy_last_updated'))
      socketAck.setSystemUnavailable(commonUtils.getConfigBool(get(configs, 'flags.serviceUnavailable')))
      socketAck.setUnavailableHint(get(configs, 'flags.unavailableHint'))
      commonUtils.executeCallback(callback, socketAck.serializeBinary().buffer)
    })
  }

  return (socket, next) => {
    const subscribedFunctions = get(socket, 'subscribedFunctions')
    subscribedFunctions.push(handleInitialization)
    return next()
  }
}
