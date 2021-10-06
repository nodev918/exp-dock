module.exports = () => {
    console.log("[test]:in module wsServer")
    
    const { WebSocketServer } = require('ws')
    //import { WebSocketServer } from 'ws'
    const wss = new WebSocketServer({ port: 8001 })

    wss.on('connection', function connection(ws) {
        console.log("[ws.server]:ws connect")
        ws.on('message', function incoming(message) {
            console.log('received: %s', message)
        })

        ws.send('hello from server')
    })
    
}

