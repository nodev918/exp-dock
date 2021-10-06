require('../builds/google/status_pb')
require('../builds/google/error_detail_pb')
const { get, find } = require('lodash')

class AppError extends Error {
  constructor (message, cause) {
    super(message)
    this.cause = cause
  }
}

class SocketError {
  constructor (code = 99999, message = 'unknown error') {
    this._code = code
    this._message = message
  }

  get json () {
    return {
      code: this._code,
      message: this._message
    }
  }

  get code () {
    return this._code
  }

  get message () {
    return this._message
  }

  get clone () {
    return Object.assign(Object.create(this), this)
  }

  withMessage (msg) {
    this._message = msg
    return this
  }
}

const tryGetCustomErrorCode = data => {
  let result = ''

  if (data) {
    // get status bytes array
    const buffer = get(data, 'metadata._internal_repr.grpc-status-details-bin.0')
    if (!buffer || typeof buffer === 'string') {
      return result
    }

    // get status proto struct
    const status = proto.google.rpc.Status.deserializeBinary(buffer)
    if (!status) {
      return result
    }

    // try to get detail
    const detail = find(status.getDetailsList(), detail => detail.getTypeName() === 'google.rpc.RequestInfo')
    if (detail) {
      const requestInfo = detail.unpack(proto.google.rpc.RequestInfo.deserializeBinary, detail.getTypeName())
      result = requestInfo.getServingData()
    }
  }
  return result
}

const newAppError = (message, cause) => {
  return new AppError(message, cause)
}

const getStack = err => {
  if (err instanceof AppError) {
    return get(err, 'cause')
  }
  return get(err, 'stack')
}

const transSocketErrToPbSocketErr = err => {
  return new proto.beanfun.chat.v1.SocketError([get(err, 'code'), get(err, 'message')])
}

// yggdrasill own error code between 50000 and 59999
module.exports = {
  ErrInvalidToken: new SocketError(50000, 'invalid token'),
  ErrInvalidUserAgent: new SocketError(50001, 'invalid user agent'),
  ErrInvalidChatID: new SocketError(50002, 'invalid chat id'),
  ErrInvalidUserID: new SocketError(50003, 'invalid user id'),
  ErrInvalidPacket: new SocketError(50004, 'invalid packet format'),
  ErrInvalidOperation: new SocketError(50005, 'invalid operation'),
  ErrRemoteJoinChat: new SocketError(50010, 'join chat failed'),
  ErrRemoteLeaveChat: new SocketError(50011, 'leave chat failed'),
  ErrSendMessage: new SocketError(50012, 'send message failed'),
  ErrRecallMessage: new SocketError(50013, 'recall message failed'),
  ErrReadMessage: new SocketError(50014, 'read message failed'),
  ErrSendScheduleMessage: new SocketError(50015, 'send schedule message failed'),
  ErrSocketEnterChat: new SocketError(50016, 'socket enter chat failed'),
  ErrUnknown: new SocketError(59999, 'unknown error'),

  newAppError: newAppError,
  getStack: getStack,
  tryGetCustomErrorCode: tryGetCustomErrorCode,
  transSocketErrToPbSocketErr: transSocketErrToPbSocketErr
}
