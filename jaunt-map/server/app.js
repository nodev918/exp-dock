const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
var cors = require('cors')
const path = require('path')

app.use(express.json())
app.use(cors())

app.use(express.static(path.resolve(__dirname,'..','client','dist')))
app.get('/',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'client','dist','index.html'))
})

app.get('/test',(req,res)=>{
    console.log("request in")
    res.json({data:"server response"})
    //res.send("hello from server")
})

app.listen(PORT,()=>{
    console.log(`listening on: ${PORT}`)
})