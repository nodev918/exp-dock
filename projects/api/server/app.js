const express = require('express')
const app = express()
const PORT = process.env.PORT || 5001
const path = require('path')

app.use(express.static(path.resolve(__dirname,'..','client','dist')))
app.get('/',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'..','client','dist','index.html'))
})

app.listen(PORT,()=>{
    console.log(`listening on: ${PORT}`)
})