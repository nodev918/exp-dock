# Socket IO API Specification 

## v1/login
- Desc: 用戶身分驗證，只有驗證完 Socket 連線才會註冊其餘事件，另外沒註冊的話 30s 後會自動斷開連線
- Req: [LoginPacket](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FsocketEntities.proto&version=GBmaster)
- Resp: [LoginAck](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FsocketEntities.proto&version=GBmaster)
- Who should listen:
    - [ ] client
    - [X] server
- Example:
    ```javascript
    let loginPacket = new proto.beanfun.chat.v1.LoginPacket()
    loginPacket.setToken('ServerToken01')
    loginPacket.setDevice('de5c4d9e-e4b3-44e8-b865-040fd1693b38')
    loginPacket.setUserAgent('Android/9/Sony/Sony G8342/1.10.14/101403')
    socket.emit('v1/login', loginPacket, logicAck => {
        // deserialize binary
        const ack = proto.beanfun.chat.v1.LoginAck.deserializeBinary(logicAck)
        // ...
    })
    ```

## v1/init
- Desc: 初始化，取得服務是否可用及各物件最後更新時間，讓 Client 可以判斷是否與 Server 重新同步資料
- Req: X
- Resp: [InitAck](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FsocketEntities.proto&version=GBmaster)
- Who should listen:
    - [ ] client
    - [X] server
- Example:
    ```javascript
    socket.emit('v1/init', {}, initAck => {
        // deserialize binary
        const ack = proto.beanfun.chat.v1.InitAck.deserializeBinary(initAck)
        // ...
    })
    ```

## v2/message/send
- Desc: 發送訊息
- Req: [SendMessageV2Packet](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FsocketEntities.proto&version=GBmaster)
- Resp: [SendMessageAck](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FsocketEntities.proto&version=GBmaster)
- Who should listen:
    - [ ] client
    - [X] server
- Example:
    ```javascript
    let sendMessagePacket = new proto.beanfun.chat.v1.SendMessagePacket()
    sendMessagePacket.setSenderId('230293358579289000')
    sendMessagePacket.setChatId('217654321001000000')
    sendMessagePacket.setMimeType(proto.beanfun.chat.v1.MimeType.APPLICATION_X_BEANFUN_TEXT)
    sendMessagePacket.setContent('Hello')
    socket.emit('v1/message/send', sendMessagePacket, sendMessageAck => {
        // deserialize binary
        const ack = proto.beanfun.chat.v1.SendMessageAck.deserializeBinary(sendMessageAck)
        // ...
    })
    ```

## v1/message/schedule
- Desc: 發送未來訊息
- Req: [ScheduleMessagePacket](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FsocketEntities.proto&version=GBmaster)
- Resp: [ScheduleMessageAck](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FsocketEntities.proto&version=GBmaster)
- Who should listen:
    - [ ] client
    - [X] server
- Example:
    ```javascript
    let packet = new proto.beanfun.chat.v1.ScheduleMessagePacket()
    let rawMsg = new proto.beanfun.chat.v1.RawMessage()
    rawMsg.setMimeType(proto.beanfun.chat.v1.MimeType.APPLICATION_X_BEANFUN_TEXT)
    rawMsg.setContent('Hello')
    packet.setSenderId('230293358579289000')
    packet.setChatId('217654321001000000')
    packet.setRawMessage(rawMsg)
    socket.emit('v1/message/schedule', packet, resp => {
        // deserialize binary
        const ack = proto.beanfun.chat.v1.ScheduleMessageAck.deserializeBinary(resp)
        // ...
    })
    ```

## v1/message/forward
- Desc: 轉傳訊息
- Req: [ForwardMessagesPacket](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FsocketEntities.proto&version=GBmaster)
- Resp: [ForwardMessagesAck](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FsocketEntities.proto&version=GBmaster)
- Who should listen:
    - [ ] client
    - [X] server
- Example:
    ```javascript
    let forwardMessagesPacket = new proto.beanfun.chat.v1.ForwardMessagesPacket()
    forwardMessagesPacket.setSenderIdsList(['230293358579289000'])
    forwardMessagesPacket.setChatIdsList(['217654321001000000'])
    forwardMessagesPacket.setRawMessagesList([new proto.beanfun.chat.v1.RawMessage([80, 'Hi'])])
    socket.emit('v1/message/forward', forwardMessagesPacket, forwardMessagesAck => {
        // deserialize binary
        const ack = proto.beanfun.chat.v1.ForwardMessagesAck.deserializeBinary(forwardMessagesAck)
        // ...
    })
    ```

## v1/message/receive
- Desc: 接收訊息
- Req: [ReceiveMessagePacket](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FsocketEntities.proto&version=GBmaster)
- Resp: [ReceiveMessageAck](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FsocketEntities.proto&version=GBmaster)
- Who should listen:
    - [X] client
    - [ ] server
- Example:
    ```javascript
    socket.on('v1/message/receive', (data, callback) => {
        // deserialize binary
        const packet = proto.beanfun.chat.v1.ReceiveMessagePacket.deserializeBinary(data)
        // ...
        // ack after above finish
        const lastMessage = messages[messages.length - 1]
        let ack = new proto.beanfun.chat.v1.ReceiveMessageAck()
        ack.setLastMessageId(lastMessage.getMessageId())
        callback(ack)
    })
    ```

## v1/message/history
- Desc: 取得歷史訊息
- Req: [HistoryMessagesPacket](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FsocketEntities.proto&version=GBmaster)
- Resp: [HistoryMessagesAck](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FsocketEntities.proto&version=GBmaster)
- Who should listen:
    - [ ] client
    - [X] server
- Example:
    ```javascript
    let historyMessagesPacket = new proto.beanfun.chat.v1.HistoryMessagesPacket()
    historyMessagesPacket.setUserId('230293358579289000')
    historyMessagesPacket.setChatId('217654321001000000')
    historyMessagesPacket.setMessageId('260497719649370112')
    socket.emit('v1/message/history', historyMessagesPacket, historyMessagesAck => {
        // deserialize binary
        const ack = proto.beanfun.chat.v1.HistoryMessagesAck.deserializeBinary(historyMessagesAck)
        // ...
    })
    ```

## v1/message/next
- Desc: 取得下批訊息
- Req: [NextMessagesPacket](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FsocketEntities.proto&version=GBmaster)
- Resp: [NextMessagesAck](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FsocketEntities.proto&version=GBmaster)
- Who should listen:
    - [ ] client
    - [X] server
- Example:
    ```javascript
    let nextMessagesPacket = new proto.beanfun.chat.v1.NextMessagesPacket()
    nextMessagesPacket.setUserId('230293358579289000')
    nextMessagesPacket.setChatId('217654321001000000')
    nextMessagesPacket.setMessageId('260497719649370112')
    socket.emit('v1/message/next', nextMessagesPacket, nextMessagesAck => {
        // deserialize binary
        const ack = proto.beanfun.chat.v1.NextMessagesAck.deserializeBinary(nextMessagesAck)
        // ...
    })
    ```

## v1/message/around
- Desc: 取得上下文訊息
- Req: [AroundMessagesPacket](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FsocketEntities.proto&version=GBmaster)
- Resp: [AroundMessagesAck](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FsocketEntities.proto&version=GBmaster)
- Who should listen:
    - [ ] client
    - [X] server
- Example:
    ```javascript
    let aroundMessagesPacket = new proto.beanfun.chat.v1.AroundMessagesPacket()
    aroundMessagesPacket.setUserId('230293358579289000')
    aroundMessagesPacket.setChatId('217654321001000000')
    aroundMessagesPacket.setMessageId('260497719649370112')
    socket.emit('v1/message/around', aroundMessagesPacket, aroundMessagesAck => {
        // deserialize binary
        const ack = proto.beanfun.chat.v1.AroundMessagesAck.deserializeBinary(aroundMessagesAck)
        // ...
    })
    ```

## v1/message/newest
- Desc: 取得最新訊息
- Req: [NewestMessagesPacket](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FsocketEntities.proto&version=GBmaster)
- Resp: [NewestMessagesAck](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FsocketEntities.proto&version=GBmaster)
- Who should listen:
    - [ ] client
    - [X] server
- Example:
    ```javascript
    let newestMessagesPacket = new proto.beanfun.chat.v1.NewestMessagesPacket()
    newestMessagesPacket.setUserId('230293358579289000')
    newestMessagesPacket.setChatId('217654321001000000')
    socket.emit('v1/message/around', newestMessagesPacket, newestMessagesAck => {
        // deserialize binary
        const ack = proto.beanfun.chat.v1.NewestMessagesAck.deserializeBinary(newestMessagesAck)
        // ...
    })
    ```

## v1/message/recall
- Desc: 回收訊息
- Req: [RecallMessagePacket](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FsocketEntities.proto&version=GBmaster)
- Resp: [RecallMessageAck](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FsocketEntities.proto&version=GBmaster)
- Who should listen:
    - [ ] client
    - [X] server
- Example:
    ```javascript
    let recallMessagePacket = new proto.beanfun.chat.v1.RecallMessagePacket()
    recallMessagePacket.setRecallerId('230293358579289000')
    recallMessagePacket.setChatId('217654321001000000')
    recallMessagePacket.setMessageId('260497719649370112')
    socket.emit('v1/message/recall', recallMessagePacket, recallMessageAck => {
        // deserialize binary
        const ack = proto.beanfun.chat.v1.RecallMessageAck.deserializeBinary(recallMessagePacket)
        // ...
    })
    ```

## v1/event/users
- Desc: 取得用戶更新事件，當 Server 有使用者相關變動就會推送
- Req: X
- Resp: [UserEvent](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FchatEntities.proto&version=GBmaster)
- Who should listen:
    - [X] client
    - [ ] server
- Example:
    ```javascript
    socket.on('v1/event/users', (data, callback) => {
        // deserialize binary
        const event = proto.beanfun.chat.v1.UserEvent.deserializeBinary(data)
        // ...
    })
    ```

## v1/event/chats
- Desc: 取得聊天室更新事件，當 Server 有聊天室相關變動就會推送
- Req: X
- Resp: [ChatEvent](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FchatEntities.proto&version=GBmaster)
- Who should listen:
    - [X] client
    - [ ] server
- Example:
    ```javascript
    socket.on('v1/event/chats', (data, callback) => {
        // deserialize binary
        const event = proto.beanfun.chat.v1.ChatEvent.deserializeBinary(data)
        // ...
    })
    ```

## v1/event/messages
- Desc: 取得訊息更新事件
- Req: X
- Resp: [MessageEvent](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FchatEntities.proto&version=GBmaster)
- Who should listen:
    - [X] client
    - [ ] server
- Example:
    ```javascript
    socket.on('v1/event/messages', (data, callback) => {
        // deserialize binary
        const event = proto.beanfun.chat.v1.MessageEvent.deserializeBinary(data)
        // ...
    })
    ```

## v1/event/pinnedMessages
- Desc: 取得置頂訊息更新事件
- Req: X
- Resp: [PinnedMessageEvent](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FchatEntities.proto&version=GBmaster)
- Who should listen:
    - [X] client
    - [ ] server
- Example:
    ```javascript
    socket.on('v1/event/pinnedMessages', (data, callback) => {
        // deserialize binary
        const event = proto.beanfun.chat.v1.PinnedMessageEvent.deserializeBinary(data)
        // ...
    })
    ```

## v1/event/friends
- Desc: 取得好友更新事件
- Req: X
- Resp: [FriendEvent](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FchatEntities.proto&version=GBmaster)
- Who should listen:
    - [X] client
    - [ ] server
- Example:
    ```javascript
    socket.on('v1/event/friends', (data, callback) => {
        // deserialize binary
        const event = proto.beanfun.chat.v1.FriendEvent.deserializeBinary(data)
        // ...
    })
    ```
  
## v1/event/scheduleMessage/add
- Desc: 取得未來訊息新增事件
- Req: X
- Resp: [AddScheduleMessageEvent](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FchatEntities.proto&version=GBmaster)
- Who should listen:
    - [X] client
    - [ ] server
- Example:
    ```javascript
    socket.on('v1/event/scheduleMessage/add', (data, callback) => {
        // deserialize binary
        const event = proto.beanfun.chat.v1.AddScheduleMessageEvent.deserializeBinary(data)
        // ...
    })
    ```
  
## v1/event/scheduleMessage/delete
- Desc: 取得未來訊息刪除事件
- Req: X
- Resp: [DeleteScheduleMessageEvent](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FchatEntities.proto&version=GBmaster)
- Who should listen:
    - [X] client
    - [ ] server
- Example:
    ```javascript
    socket.on('v1/event/scheduleMessage/delete', (data, callback) => {
        // deserialize binary
        const event = proto.beanfun.chat.v1.DeleteScheduleMessageEvent.deserializeBinary(data)
        // ...
    })
    ```
  
## v1/event/whisperMessage/unlock
- Desc: 解鎖私密訊息事件
- Req: X
- Resp: [UnlockWhisperMessageEvent](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FchatEntities.proto&version=GBmaster)
- Who should listen:
    - [X] client
    - [ ] server
- Example:
    ```javascript
    socket.on('v1/event/whisperMessage/unlock', (data, callback) => {
        // deserialize binary
        const event = proto.beanfun.chat.v1.UnlockWhisperMessagesEvent.deserializeBinary(data)
        // ...
    })
    ```
  
## v1/event/notification/add
- Desc: 新增通知事件
- Req: X
- Resp: [AddNotificationEvent](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FchatEntities.proto&version=GBmaster)
- Who should listen:
    - [X] client
    - [ ] server
- Example:
    ```javascript
    socket.on('v1/event/notification/add', (data, callback) => {
        // deserialize binary
        const event = proto.beanfun.chat.v1.AddNotificationEvent.deserializeBinary(data)
        // ...
    })
    ```

## v1/snapshot
- Desc: 取得聊天室列表快照，通常由 Server 不斷同步更新給 Client
- Req: X
- Resp: [Snapshot](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FchatEntities.proto&version=GBmaster)
- Who should listen:
    - [X] client
    - [ ] server
- Example:
    ```javascript
    socket.on('v1/snapshot', (data, callback) => {
        // deserialize binary
        const event = proto.beanfun.chat.v1.Snapshot.deserializeBinary(data)
        // ...
    })
    ```

## v1/chat/enter
- Desc: 進入聊天室
- Req: [EnterChatPacket](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FsocketEntities.proto&version=GBmaster)
- Resp: [EnterChatAck](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FsocketEntities.proto&version=GBmaster)
- Who should listen:
    - [ ] client
    - [X] server
- Example:
    ```javascript
    let enterChatPacket = new proto.beanfun.chat.v1.EnterChatPacket()
    enterChatPacket.setUserId('230293358579289000')
    enterChatPacket.setChatId('217654321001000000')
    enterChatPacket.setLastMessageId('260497719649370112')
    socket.emit('v1/chat/enter', enterChatPacket, enterChatAck => {
        // deserialize binary
        const ack = proto.beanfun.chat.v1.EnterChatAck.deserializeBinary(enterChatPacket)
        // ...
    })
    ```

## v1/chat/leave
- Desc: 離開聊天室
- Req: [LeaveChatPacket](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FsocketEntities.proto&version=GBmaster)
- Resp: [LeaveChatAck](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FsocketEntities.proto&version=GBmaster)
- Who should listen:
    - [ ] client
    - [X] server
- Example:
    ```javascript
    let leaveChatPacket = new proto.beanfun.chat.v1.LeaveChatPacket()
    leaveChatPacket.setUserId('230293358579289000')
    leaveChatPacket.setChatId('217654321001000000')
    socket.emit('v1/chat/leave', leaveChatPacket, leaveChatAck => {
        // deserialize binary
        const ack = proto.beanfun.chat.v1.LeaveChatAck.deserializeBinary(leaveChatPacket)
        // ...
    })
    ```

## v1/read/receive
- Desc: 取得已讀
- Req: [ReceiveReadPacket](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FsocketEntities.proto&version=GBmaster)
- Resp: X
- Who should listen:
    - [X] client
    - [ ] server
- Example:
    ```javascript
    socket.on('v1/read/receive', (data, callback) => {
        // deserialize binary
        const packet = proto.beanfun.chat.v1.ReceiveReadPacket.deserializeBinary(data)
        // ...
    })
    ```

## v1/read/send
- Desc: 發送已讀
- Req: [SendReadPacket](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FsocketEntities.proto&version=GBmaster)
- Resp: [SendReadAck](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FsocketEntities.proto&version=GBmaster)
- Who should listen:
    - [ ] client
    - [X] server
- Example:
    ```javascript
    let sendReadPacket = new proto.beanfun.chat.v1.SendReadPacket()
    sendReadPacket.setReadsList([new proto.beanfun.chat.v1.Read(['230293358579289000','230293358579289001','230293358579289002'])])
    socket.emit('v1/read/send', sendReadPacket, sendReadAck => {
        // deserialize binary
        const ack = proto.beanfun.chat.v1.SendReadAck.deserializeBinary(sendReadPacket)
        // ...
    })
    ```

## v1/typing/send
- Desc: 發送正在輸入中的狀態
- Req: [TypingPacket](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FsocketEntities.proto&version=GBmaster)
- Resp: X
- Who should listen:
    - [ ] client
    - [X] server
- Example:
    ```javascript
    let typingPacket = new proto.beanfun.chat.v1.TypingPacket()
    typingPacket.setSenderId('230293358579289000')
    socket.emit('v1/typing/send', typingPacket)
    ```

## v1/typing/receive
- Desc: 取得已讀
- Req: [TypingPacket](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FsocketEntities.proto&version=GBmaster)
- Resp: X
- Who should listen:
    - [X] client
    - [ ] server
- Example:
    ```javascript
    socket.on('v1/typing/receive', (data, callback) => {
        // deserialize binary
        const packet = proto.beanfun.chat.v1.TypingPacket.deserializeBinary(data)
        // ...
    })
    ```
## v1/event/chats/vote
- Desc: 取得投票公告更新事件
- Req: X
- Resp: [ChatVoteEvent](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FchatEntities.proto&version=GBmaster&line=963&lineEnd=971&lineStartColumn=1&lineEndColumn=2&lineStyle=plain&_a=contents)
- Who should listen:
  - [X] client
  - [ ] server

## v1/event/chats/blacklist
- Desc: 取得黑名單列表更新事件
- Req: X
- Resp: [ChatBlacklistUpdateEvent](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FchatEntities.proto&version=GBmaster&line=979&lineEnd=982&lineStartColumn=1&lineEndColumn=2&lineStyle=plain&_a=contents)
- Who should listen:
  - [X] client
  - [ ] server

## v1/event/chats/sendMessageConstraint
- Desc: 取得禁言設定更新事件
- Req: X
- Resp: [ChatSendMessageConstraintUpdateEvent](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FchatEntities.proto&version=GBmaster&line=990&lineEnd=995&lineStartColumn=1&lineEndColumn=2&lineStyle=plain&_a=contents)
- Who should listen:
  - [X] client
  - [ ] server

## v1/event/jollybuy
- Desc: 有閑更新事件
- Req: X
- Resp: [JollyBuyEvent](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FchatEntities.proto&version=GBmaster&line=946&lineEnd=948&lineStartColumn=1&lineEndColumn=2&lineStyle=plain&_a=contents)
- Who should listen:
  - [X] client
  - [ ] server

## v1/event/user/logout
- Desc: 使用者登出事件
- Req: X
- Resp: [LogoutEvent](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FchatEntities.proto&version=GBmaster&line=954&lineEnd=957&lineStartColumn=1&lineEndColumn=2&lineStyle=plain&_a=contents)
- Who should listen:
  - [X] client
  - [ ] server

## v1/event/alias/delete
- Desc: 使用者身份刪除事件
- Req: X
- Resp: [AliasDeletedEvent](https://beango.visualstudio.com/BeanGoAPP/_git/rocks?path=%2Fchat%2FchatEntities.proto&version=GBmaster&line=990&lineEnd=995&lineStartColumn=1&lineEndColumn=2&lineStyle=plain&_a=contents)
- Who should listen:
  - [X] client
  - [ ] server

# Socket IO Connection Manual

## 1. connect to socket io endpoint
- 第一種方式: 直接使用 websocket transport
    ```javascript
    const socket = io({
        transports: ['websocket'],
        path: '/ws'
    })
    ```
- 第二種方式: 網路不穩時可切換回 polling，穩定再使用 websocket
    ```javascript
    const socket = io({
        transports: ['polling', 'websocket'],
        path: '/ws'
    })
    ```

## 2. send login packet in 30s, otherwise you will be force logout
```javascript
let loginPacket = new proto.beanfun.chat.v1.LoginPacket()
loginPacket.setToken('ServerToken01')
loginPacket.setDevice('de5c4d9e-e4b3-44e8-b865-040fd1693b38')
loginPacket.setUserAgent('Android/9/Sony/Sony G8342/1.10.14/101403')
socket.emit('v1/login', loginPacket, logicAck => {
    // deserialize binary
    const ack = proto.beanfun.chat.v1.LoginAck.deserializeBinary(logicAck)
    // ...
})
```

# Socket IO Connection Endpoints

## staging
- Endpoint: `https://stg-socket.beanfun.com`
- Path: `/ws`

## production
- Endpoint: TBD
- Path: `/ws`
