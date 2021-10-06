import protoRoot from './proto/proto';

const lookupPktByPath = path => {
    switch (path) {
        case 'v1/chat/enter':
            return protoRoot.lookupType('beanfun.chat.v1.EnterChatPacket')
        case 'v1/login':
            return protoRoot.lookupType('beanfun.chat.v1.LoginPacket')
        default:
            return null
    }
}

const lookupAckByPath = path => {
    switch (path) {
        case 'v1/chat/enter':
            return protoRoot.lookupType('beanfun.chat.v1.EnterChatAck')
        case 'v1/login':
            return protoRoot.lookupType('beanfun.chat.v1.LoginAck')
        case 'v1/init':
            return protoRoot.lookupType('beanfun.chat.v1.InitAck')
        case 'v1/snapshot':
            return protoRoot.lookupType('beanfun.chat.v1.Snapshot')
        default:
            return null
    }
}

class Helper {
    constructor() {}

    static doEncode(path, json) {
        const pbInstance = lookupPktByPath(path)
        if (pbInstance) {
            return pbInstance.encode(json).finish()
        }
        return null
    }

    static doDecode(path, buf) {
        const pbInstance = lookupAckByPath(path)
        if (pbInstance) {
            return pbInstance.decode(buf)
        }
        return null
    }
}

export default Helper