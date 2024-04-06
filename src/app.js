const express = require('express')
const app = express();

const usuarios = require('./routes/usuarioRouter')
app.use(usuarios)
const chat =require('/routes/chatRouter')
app.use(chat)
const api = require('/routes/apiRouter')
app.use(api)

app.listen(3000, ()=>{
    console.log ('waiting connection')    
})

