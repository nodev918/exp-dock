const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io")
const io = new Server(server);
const callserver = require('./router/callserver')
const callws = require('./router/callws')

const wsServer = require('./router/wsServer')

/*
domain: stg-socket.beanfun.com
path: /ws
port: 
*/

//app.use(express.static('public'))

/* 提供網頁 */
/*
app.get('/',(req,res)=>{
    
    res.sendFile(__dirname + '/public/index.html')
    //res.send("res: /")
})
*/
//app.use(require('./router/callserver'))

wsServer()                          // websocket server

app.get('/', (req, res) => {        // http server
    res.sendFile(__dirname + '/public/index.html');
  });

io.on('connection', (socket)=>{     // socket.io server
    console.log('[io]: user connected')
    socket.broadcast.emit('message','$sys: hello user, welcome')

    socket.on('message', (msg)=>{
        console.log('request: ' + msg)
        io.emit('message',msg)
    })

    socket.on('pb', (msg)=>{
        console.log('request: ' + msg)
        io.emit('pb',msg)
        
        //callws()
        //callserver(io)
    })

    socket.on('disconnect', () =>{
        console.log('[io]: user disconnected')
    })
})



const PORT = process.env.PORT || 5000
server.listen(PORT,()=>{
    console.log(`listening: ${PORT}`)
})