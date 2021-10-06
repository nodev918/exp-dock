require('../builds/chat/chatting_pb')
const protoLoader = require('@grpc/proto-loader')
const grpc = require('grpc')
const path = require('path')
const { get } = require('lodash')
const logger = require('../logger')
const logUtils = require('../utils/log')
const config = require('../config')

let messageServiceClient, readServiceClient, chatStatusServiceClient

const init = () => {
  const hosts = get(config, 'connections.grpc.gravitas.host')
  const packageDefinition = protoLoader.loadSync(path.join(__dirname, '/../../rocks/chat/chatting.proto'), {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  })
  const packageObject = grpc.loadPackageDefinition(packageDefinition)
  messageServiceClient = new packageObject.beanfun.chat.v1.MessageService(hosts, grpc.credentials.createInsecure())
  readServiceClient = new packageObject.beanfun.chat.v1.ReadService(hosts, grpc.credentials.createInsecure())
  chatStatusServiceClient = new packageObject.beanfun.chat.v1.ChatStatusService(hosts, grpc.credentials.createInsecure())

  healthCheck()
    .then(() => logger.info('Connect to gravitas succeed'))
    .catch(err => logger.error(logUtils.composeFields(logUtils.Constants.FieldError, JSON.stringify(err)), 'Connect to gravitas failed'))
}

const healthCheck = () =>
  new Promise((resolve, reject) => {
    // TODO health check by gRPC
    resolve()
  })

const sendMessage = async command =>
  new Promise((resolve, reject) => {
    messageServiceClient.makeUnaryRequest('/beanfun.chat.v1.MessageService/SendMessage',
      input => input.serializeBinary(),
      output => proto.beanfun.chat.v1.SendMessageResult.deserializeBinary(output),
      command,
      (err, res) => {
        if (!err) { resolve(res) } else { reject(err) }
      })
  })

const batchSendMessages = async command =>
  new Promise((resolve, reject) => {
    messageServiceClient.makeUnaryRequest('/beanfun.chat.v1.MessageService/BatchSendMessages',
      input => input.serializeBinary(),
      output => proto.beanfun.chat.v1.BatchSendMessagesResult.deserializeBinary(output),
      command,
      (err, res) => {
        if (!err) { resolve(res) } else { reject(err) }
      })
  })

const getUnreadMessages = async command =>
  new Promise((resolve, reject) => {
    messageServiceClient.makeUnaryRequest('/beanfun.chat.v1.MessageService/GetUnreadMessages',
      input => input.serializeBinary(),
      output => proto.beanfun.chat.v1.GetUnreadMessagesResult.deserializeBinary(output),
      command,
      (err, res) => {
        if (!err) { resolve(res) } else { reject(err) }
      })
  })

const getHistoryMessages = async command =>
  new Promise((resolve, reject) => {
    messageServiceClient.makeUnaryRequest('/beanfun.chat.v1.MessageService/GetHistoryMessages',
      input => input.serializeBinary(),
      output => proto.beanfun.chat.v1.GetHistoryMessagesResult.deserializeBinary(output),
      command,
      (err, res) => {
        if (!err) { resolve(res) } else { reject(err) }
      })
  })

const getNextMessages = async command =>
  new Promise((resolve, reject) => {
    messageServiceClient.makeUnaryRequest('/beanfun.chat.v1.MessageService/GetUnreadMessages',
      input => input.serializeBinary(),
      output => proto.beanfun.chat.v1.GetUnreadMessagesResult.deserializeBinary(output),
      command,
      (err, res) => {
        if (!err) { resolve(res) } else { reject(err) }
      })
  })

const getAroundMessages = async command =>
  new Promise((resolve, reject) => {
    messageServiceClient.makeUnaryRequest('/beanfun.chat.v1.MessageService/GetAroundMessages',
      input => input.serializeBinary(),
      output => proto.beanfun.chat.v1.GetAroundMessagesResult.deserializeBinary(output),
      command,
      (err, res) => {
        if (!err) { resolve(res) } else { reject(err) }
      })
  })

const getNewestMessages = async command =>
  new Promise((resolve, reject) => {
    messageServiceClient.makeUnaryRequest('/beanfun.chat.v1.MessageService/GetNewestMessages',
      input => input.serializeBinary(),
      output => proto.beanfun.chat.v1.GetNewestMessagesResult.deserializeBinary(output),
      command,
      (err, res) => {
        if (!err) { resolve(res) } else { reject(err) }
      })
  })

const catchUpAllEvents = async (payload, callback) => {
  const call = chatStatusServiceClient.catchUpAllEvents(payload)

  call.on('data', event => {
    callback(event)
  })

  call.on('status', status => {
    // logger.info(logUtils.composeFields(logUtils.Constants.FieldGRPCResult, status), 'catch up all events processed')
  })
  call.on('error', err => {
    logger.error(logUtils.composeFields(logUtils.Constants.FieldError, err), 'catch up all event failed')
  })
}

const getMainInfo = async payload =>
  new Promise((resolve, reject) => {
    chatStatusServiceClient.getMainInfo(payload, (err, res) => {
      if (!err) { resolve(res) } else { reject(err) }
    })
  })

const getSnapshot = async command =>
  new Promise((resolve, reject) => {
    chatStatusServiceClient.makeUnaryRequest('/beanfun.chat.v1.ChatStatusService/GetSnapshot',
      input => input.serializeBinary(),
      output => proto.beanfun.chat.v1.GetSnapshotResult.deserializeBinary(output),
      command,
      (err, res) => {
        if (!err) { resolve(res) } else { reject(err) }
      })
  })

const readMessage = async (payload) =>
  new Promise((resolve, reject) => {
    readServiceClient.readMessage(payload, (err, res) => {
      if (!err) { resolve(res) } else { reject(err) }
    })
  })

const readNewestMessage = async (payload) =>
  new Promise((resolve, reject) => {
    readServiceClient.readNewestMessage(payload, (err, res) => {
      if (!err) { resolve(res) } else { reject(err) }
    })
  })

const recallMessage = async command =>
  new Promise((resolve, reject) => {
    messageServiceClient.makeUnaryRequest('/beanfun.chat.v1.MessageService/RecallMessage',
      input => input.serializeBinary(),
      output => proto.beanfun.chat.v1.RecallMessageResult.deserializeBinary(output),
      command,
      (err, res) => {
        if (!err) { resolve(res) } else { reject(err) }
      })
  })

const getChatMainInfo = async (payload) =>
  new Promise((resolve, reject) => {
    chatStatusServiceClient.getChatMainInfo(payload, (err, res) => {
      if (!err) { resolve(res) } else { reject(err) }
    })
  })

const sendScheduleMessage = async command =>
  new Promise((resolve, reject) => {
    messageServiceClient.makeUnaryRequest('/beanfun.chat.v1.MessageService/SendScheduleMessage',
      input => input.serializeBinary(),
      output => proto.beanfun.chat.v1.SendScheduleMessageResult.deserializeBinary(output),
      command,
      (err, res) => {
        if (!err) { resolve(res) } else { reject(err) }
      })
  })

const getEarliestUnreadMentionMessage = async (payload) =>
  new Promise((resolve, reject) => {
    messageServiceClient.getEarliestUnreadMentionMessage(payload, (err, res) => {
      if (!err) { resolve(res) } else { reject(err) }
    })
  })

const socketEnterChat = async command =>
  new Promise((resolve, reject) => {
    chatStatusServiceClient.makeUnaryRequest('/beanfun.chat.v1.ChatStatusService/SocketEnterChat',
      input => input.serializeBinary(),
      output => proto.beanfun.chat.v1.SocketEnterChatResult.deserializeBinary(output),
      command,
      (err, res) => {
        if (!err) { resolve(res) } else { reject(err) }
      })
  })

const socketLeaveChat = async command =>
  new Promise((resolve, reject) => {
    chatStatusServiceClient.makeUnaryRequest('/beanfun.chat.v1.ChatStatusService/SocketLeaveChat',
      input => input.serializeBinary(),
      output => proto.beanfun.chat.v1.SocketLeaveChatResult.deserializeBinary(output),
      command,
      (err, res) => {
        if (!err) { resolve(res) } else { reject(err) }
      })
  })

const socketBystanderEnterChat = async command =>
  new Promise((resolve, reject) => {
    chatStatusServiceClient.makeUnaryRequest('/beanfun.chat.v1.ChatStatusService/SocketBystanderEnterChat',
      input => input.serializeBinary(),
      output => proto.beanfun.chat.v1.SocketBystanderEnterChatResult.deserializeBinary(output),
      command,
      (err, res) => {
        if (!err) { resolve(res) } else { reject(err) }
      }
    )
  })

const socketBystanderLeaveChat = async command =>
  new Promise((resolve, reject) => {
    chatStatusServiceClient.makeUnaryRequest('/beanfun.chat.v1.ChatStatusService/SocketBystanderLeaveChat',
      input => input.serializeBinary(),
      _ => null,
      command,
      (err, res) => {
        if (!err) { resolve(res) } else { reject(err) }
      }
    )
  })

module.exports.init = init
module.exports.healthCheck = healthCheck
module.exports.sendMessage = sendMessage
module.exports.batchSendMessages = batchSendMessages
module.exports.getUnreadMessages = getUnreadMessages
module.exports.getAroundMessages = getAroundMessages
module.exports.getHistoryMessages = getHistoryMessages
module.exports.getNextMessages = getNextMessages
module.exports.getNewestMessages = getNewestMessages
module.exports.catchUpAllEvents = catchUpAllEvents
module.exports.getSnapshot = getSnapshot
module.exports.readMessage = readMessage
module.exports.readNewestMessage = readNewestMessage
module.exports.recallMessage = recallMessage
module.exports.getChatMainInfo = getChatMainInfo
module.exports.getMainInfo = getMainInfo
module.exports.sendScheduleMessage = sendScheduleMessage
module.exports.getEarliestUnreadMentionMessage = getEarliestUnreadMentionMessage
module.exports.socketEnterChat = socketEnterChat
module.exports.socketLeaveChat = socketLeaveChat
module.exports.socketBystanderEnterChat = socketBystanderEnterChat
module.exports.socketBystanderLeaveChat = socketBystanderLeaveChat