const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')

const io = new Server(server)

io.on('connection',(socket)=>{
    console.log("someone connect in io server")
    socket.on('channel1',(arg)=>{
        console.log(arg)
        io.emit('channel1',arg)
    })
})

const path = require('path')

app.use(express.static(path.resolve(__dirname,'..','client','build')))
app.get('/',(req,res)=>{
    res.send(path.resolve(__dirname,'..','client','build','index.html'))
})

const PORT = process.env.PORT || 5000
server.listen(PORT,()=>{
    console.log(`io server listening on: ${PORT}`)
})