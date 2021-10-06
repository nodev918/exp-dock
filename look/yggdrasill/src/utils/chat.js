require('../builds/chat/chatEntities_pb')

const remoteLeaveChannel = async (io, socket, channel) =>
  new Promise((resolve, reject) => {
    io.of('/').adapter.remoteLeave(socket.id, channel, err => {
      if (!err) { resolve() } else { reject(err) }
    })
  })

const remoteJoinChannel = async (io, socket, channel) =>
  new Promise((resolve, reject) => {
    io.of('/').adapter.remoteJoin(socket.id, channel, err => {
      if (!err) { resolve() } else { reject(err) }
    })
  })

module.exports.remoteLeaveChannel = remoteLeaveChannel
module.exports.remoteJoinChannel = remoteJoinChannel
