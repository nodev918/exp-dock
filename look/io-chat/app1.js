const express = require("express")
const port = 5555
const pageServer = express()

pageServer.use(express.static('public'))

pageServer.listen(port,()=>{
    console.log("static server is listening: ",port)
})



const socketio = require("socket.io")

ioServer = socketio(pageServer,()=>{
    console.log("ioServer created")
})



