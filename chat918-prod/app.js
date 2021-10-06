
/*
const express = require('express')
const app = express()


const http = require('http')
const server = http.createServer(app)


const {Server} = require("socket.io")
const io = new Server(server)
*/
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);


const { Server } = require("socket.io")
const io = new Server(server);


//app.use(express.static('public'))

/* 提供網頁 */
/*
app.get('/',(req,res)=>{
    
    res.sendFile(__dirname + '/public/index.html')
    //res.send("res: /")
})
*/
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });
/*
io.on('connection',(socket)=>{
    console.log('a user connected')
})
*/
io.on('connection', (socket)=>{
    console.log('a user connected')
    socket.broadcast.emit('message','welcome to Linee')

    socket.on('message', (msg)=>{
        console.log('client says: ' + msg)
        io.emit('message',msg)
    })

    socket.on('disconnect', () =>{
        console.log('user disconnected')
    })
})



const PORT = process.env.PORT || 5000
server.listen(PORT,()=>{
    console.log(`listening: ${PORT}`)
})