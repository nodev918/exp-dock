const timeUtils = require('./time')
const logUtils = require('./log')
const commonUtils = require('./common')
const errs = require('./error')
const logger = require('../logger')
const { get } = require('lodash')

const deserializeSocketPacket = (eventName, data) => {
  try {
    switch (eventName) {
      case 'v1/login':
        return proto.beanfun.chat.v1.LoginPacket.deserializeBinary(data).toObject()
      case 'v1/chat/enter':
        return proto.beanfun.chat.v1.EnterChatPacket.deserializeBinary(data).toObject()
      case 'v1/chat/leave':
        return proto.beanfun.chat.v1.LeaveChatPacket.deserializeBinary(data).toObject()
      case 'v1/message/send':
        return proto.beanfun.chat.v1.SendMessagePacket.deserializeBinary(data).toObject()
      case 'v2/message/send':
        return proto.beanfun.chat.v1.SendMessageV2Packet.deserializeBinary(data).toObject()
      case 'v1/message/forward':
        return proto.beanfun.chat.v1.ForwardMessagesPacket.deserializeBinary(data).toObject()
      case 'v1/message/history':
        return proto.beanfun.chat.v1.HistoryMessagesPacket.deserializeBinary(data).toObject()
      case 'v1/message/newest':
        return proto.beanfun.chat.v1.NewestMessagesPacket.deserializeBinary(data).toObject()
      case 'v1/message/around':
        return proto.beanfun.chat.v1.AroundMessagesPacket.deserializeBinary(data).toObject()
      case 'v1/message/next':
        return proto.beanfun.chat.v1.NextMessagesPacket.deserializeBinary(data).toObject()
      case 'v1/message/recall':
        return proto.beanfun.chat.v1.RecallMessagePacket.deserializeBinary(data).toObject()
      case 'v1/message/schedule':
        return proto.beanfun.chat.v1.ScheduleMessagePacket.deserializeBinary(data).toObject()
    }
  } catch (e) {
    logger.error(logUtils.composeFields(
      logUtils.Constants.FieldAPI, eventName,
      logUtils.Constants.FieldError, get(e, 'message'),
      logUtils.Constants.FieldStack, errs.getStack(e)), 'Cannot parse socket request')
  }
}

const listenEvent = (socket, eventName, fn) => {
  socket.on(eventName, async (data, callback) => {
    const startTime = timeUtils.getTimestamp()
    try {
      logger.debug(logUtils.composeFields(
        logUtils.Constants.FieldAliasID, get(socket, 'aliasID'),
        logUtils.Constants.FieldToken, get(socket, 'token'),
        logUtils.Constants.FieldSessionID, get(socket, 'customSessionID'),
        logUtils.Constants.FieldAPI, eventName,
        logUtils.Constants.FieldWSRequest, JSON.stringify(deserializeSocketPacket(eventName, data))),
      'Socket call (detail)')
      await fn(data, result => {
        commonUtils.executeCallback(callback, result)
        logger.info(logUtils.composeFields(
          logUtils.Constants.FieldAliasID, get(socket, 'aliasID'),
          logUtils.Constants.FieldToken, get(socket, 'token'),
          logUtils.Constants.FieldSessionID, get(socket, 'customSessionID'),
          logUtils.Constants.FieldAPI, eventName,
          logUtils.Constants.FieldElapsedTime, timeUtils.getTimestamp() - startTime),
        'Socket call (callback)')
      })
      logger.debug(logUtils.composeFields(
        logUtils.Constants.FieldAliasID, get(socket, 'aliasID'),
        logUtils.Constants.FieldToken, get(socket, 'token'),
        logUtils.Constants.FieldSessionID, get(socket, 'customSessionID'),
        logUtils.Constants.FieldAPI, eventName,
        logUtils.Constants.FieldElapsedTime, timeUtils.getTimestamp() - startTime),
      'Socket call (returning)')
    } catch (e) {
      logger.error(logUtils.composeFields(
        logUtils.Constants.FieldError, get(e, 'message'),
        logUtils.Constants.FieldStack, errs.getStack(e),
        logUtils.Constants.FieldAliasID, get(socket, 'aliasID'),
        logUtils.Constants.FieldToken, get(socket, 'token'),
        logUtils.Constants.FieldSessionID, get(socket, 'customSessionID'),
        logUtils.Constants.FieldAPI, eventName,
        logUtils.Constants.FieldElapsedTime, timeUtils.getTimestamp() - startTime),
      'Socket call')
    }
  })
}

module.exports.listenEvent = listenEvent
