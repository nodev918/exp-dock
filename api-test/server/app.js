const express = require('express')
const app = express()
const PORT = process.env.PORT || 5555

app.get('/',(req,res)=>{
    console.log("postman to: /")
    res.send("hello")
})

app.get('/test',(req,res)=>{
    console.log("postman to: /test")
})

app.listen(PORT,()=>{
    console.log(`listening on: ${PORT}`)
})