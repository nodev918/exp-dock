require('../builds/chat/chatEntities_pb')
require('../builds/chat/socketEntities_pb')
const { get, mapValues, isObject, isArray, camelCase, upperFirst, forEach, trimEnd, shuffle } = require('lodash')
const commonUtils = require('../utils/common')
const gravitas = require('../datasource/gravitas')

module.exports = () => {
  return (socket, next) => {
    const packetMap = new Map()
    packetMap.set('v1/login', 'LoginPacket')
    packetMap.set('v1/chat/enter', 'EnterChatPacket')
    packetMap.set('v1/message/send', 'SendMessagePacket')
    packetMap.set('v2/message/send', 'SendMessageV2Packet')
    packetMap.set('v1/message/receive', 'ReceiveMessageAck')
    packetMap.set('v1/message/history', 'HistoryMessagesPacket')
    packetMap.set('v1/message/next', 'NextMessagesPacket')
    packetMap.set('v1/message/around', 'AroundMessagesPacket')
    packetMap.set('v1/message/newest', 'NewestMessagesPacket')
    packetMap.set('v1/message/recall', 'RecallMessagePacket')
    packetMap.set('v1/chat/enter', 'EnterChatPacket')
    packetMap.set('v1/chat/leave', 'LeaveChatPacket')
    packetMap.set('v1/read/send', 'SendReadPacket')
    packetMap.set('v1/message/forward', 'ForwardMessagesPacket')
    packetMap.set('v1/read/send', 'SendReadPacket')
    packetMap.set('v1/message/forward', 'ForwardMessagesPacket')
    packetMap.set('v2/message/forward', 'ForwardMessagesV2Packet')
    packetMap.set('v1/typing/send', 'TypingPacket')
    packetMap.set('v1/typing/receive', 'TypingPacket')
    // packetMap.set('v1/init', 'ForwardMessagesPacket')

    const ackMap = new Map()
    ackMap.set('v1/login', 'LoginAck')
    ackMap.set('v1/chat/enter', 'EnterChatAck')
    ackMap.set('v1/snapshot', 'Snapshot')
    ackMap.set('v1/event/messages', 'MessageEvent')
    ackMap.set('v1/event/pinnedMessages', 'PinnedMessageEvent')
    ackMap.set('v1/read/receive', 'ReceiveReadPacket')
    ackMap.set('v1/message/receive', 'ReceiveMessagePacket')
    ackMap.set('v1/chat/leave', 'LeaveChatAck')
    ackMap.set('v1/chat/enter', 'EnterChatAck')
    ackMap.set('v1/message/recall', 'RecallMessageAck')
    ackMap.set('v1/message/send', 'SendMessageAck')
    ackMap.set('v2/message/send', 'SendMessageAck')
    ackMap.set('v1/message/forward', 'ForwardMessagesAck')
    ackMap.set('v1/message/around', 'AroundMessagesAck')
    ackMap.set('v1/message/next', 'NextMessagesAck')
    ackMap.set('v1/message/history', 'HistoryMessagesAck')
    ackMap.set('v1/message/newest', 'NewestMessagesAck')
    ackMap.set('v1/message/forward', 'ForwardMessagesAck')
    ackMap.set('v1/typing/send', 'TypingPacket')
    ackMap.set('v1/init', 'InitAck')

    socket.on('v1/bot/sendMessages', async (data, callback) => {
      const request = commonUtils.transformRequest(data)
      const amount = get(request, 'amount', 10)
      const interval = get(request, 'interval', 1000)
      const payload = get(request, 'payload')
      const msg = get(payload, 'raw_message')
      const msgType = get(msg, 'mime_type')
      let count = 0

      if (msgType !== 80) {
        // eslint-disable-next-line standard/no-callback-literal
        callback({ success: false })
      }

      const iter = setInterval(async () => {
        if (count++ === amount) {
          clearInterval(iter)
          // eslint-disable-next-line standard/no-callback-literal
          callback({ success: true })
        } else {
          const rawMessage = new proto.beanfun.chat.v1.RawMessage()
          rawMessage.setContent(shuffle(['今晚有空嗎?', '安安你好', '現在疫情嚴重大家盡量別出門喔', '可以跟我說一下現在幾點嗎?', '大家最近不要出國喔!'])[0])
          rawMessage.setMimeType(msgType)
          const command = new proto.beanfun.chat.v1.SendMessageCommand()
          command.setDevice(get(socket, 'device'))
          command.setChatId(get(payload, 'chat_id'))
          command.setSenderId(get(socket, 'aliasID'))
          command.setRawMessage(rawMessage)
          await gravitas.sendMessage(command).then(messageResult => {})
        }
      }, interval)
    })

    const genPbObject = (key, val, parentObj) => {
      if (!isArray(val) && !isObject(val)) {
        parentObj[`set${upperFirst(camelCase(key))}`](val)
        return
      }

      if (isArray(val)) {
        if (typeof val[0] === 'string' || typeof val[0] === 'number') {
          parentObj[`set${upperFirst(camelCase(key))}List`](val)
        } else {
          forEach(val, (newVal, newKey) => {
            genPbObject(`${trimEnd(upperFirst(camelCase(key)), 's')}`, newVal, parentObj)
          })
          // parentObj[`set${upperFirst(camelCase(key))}List`](list)
        }
        return
      }

      if (isObject(val)) {
        const obj = new proto.beanfun.chat.v1[`${upperFirst(camelCase(key))}`]()
        mapValues(val, (newVal, newKey) => {
          genPbObject(newKey, newVal, obj)
        })
        try {
          parentObj[`set${upperFirst(camelCase(key))}`](obj)
        } catch (e) {
          parentObj[`add${upperFirst(camelCase(key))}s`](obj)
        }
      }
    }

    socket.on('v1/debug/encode', (data, callback) => {
      const request = commonUtils.transformRequest(data)
      const eventName = get(request, 'eventName')
      const eventPayload = get(request, 'eventPayload')
      try {
        const packet = new proto.beanfun.chat.v1[packetMap.get(eventName)]()

        if (eventName === 'v1/message/forward') {
          packet.setSenderIdsList(get(eventPayload, 'user_ids'))
          packet.setChatIdsList(get(eventPayload, 'chat_ids'))
          packet.setRawMessagesList([new proto.beanfun.chat.v1.RawMessage([80, 'Hi'])])
          commonUtils.executeCallback(callback, packet.serializeBinary().buffer)
          return
        }

        if (eventName === 'v2/message/send') {
          const packet = new proto.beanfun.chat.v1.SendMessageV2Packet()
          packet.setChatId('217654321001000000')
          packet.setSenderId('230293358579288000')
          packet.setRequestId('100')
          packet.setRawMessage(new proto.beanfun.chat.v1.RawMessage([80, 'Hi']))
          commonUtils.executeCallback(callback, packet.serializeBinary().buffer)
          return
        }

        if (eventName === 'v2/message/forward') {
          const msg = new proto.beanfun.chat.v1.DemandMessage()
          msg.setChatId('217654321001000000')
          msg.setSenderId('230293358579288000')
          msg.setRawMessage(new proto.beanfun.chat.v1.RawMessage([80, 'Hi']))
          packet.setMessagesList([msg])
          commonUtils.executeCallback(callback, packet.serializeBinary().buffer)
          return
        }

        if (eventName === 'v1/init') {
          commonUtils.executeCallback(callback, {})
          return
        }

        if (eventName === 'v1/read/send') {
          packet.addReads(new proto.beanfun.chat.v1.Read([get(eventPayload, 'chat_id'), get(eventPayload, 'message_id'), get(eventPayload, 'sender_id')]))
          commonUtils.executeCallback(callback, packet.serializeBinary().buffer)
          return
        }

        mapValues(eventPayload, (val, key) => {
          genPbObject(key, val, packet)
        })
        commonUtils.executeCallback(callback, packet.serializeBinary().buffer)
      } catch (err) {
        commonUtils.executeCallback(callback, `encode failed: ${get(err, 'stack')}`)
      }
    })

    socket.on('v1/debug/decode', (data, callback) => {
      const request = commonUtils.transformRequest(data)
      const eventName = get(request, 'eventName')
      const eventPayload = get(request, 'eventPayload')

      try {
        const pb = proto.beanfun.chat.v1[ackMap.get(eventName)].deserializeBinary(eventPayload)
        commonUtils.executeCallback(callback, pb.toObject())
      } catch (err) {
        commonUtils.executeCallback(callback, `decode failed: ${get(err, 'stack')}`)
      }
    })

    socket.on('v1/ping', (data, callback) => {
      commonUtils.executeCallback(callback, { pong: 'PONG' })
    })

    return next()
  }
}
