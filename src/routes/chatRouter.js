const express = require('express')
const chat = express.Router()
const controller = require ('../controllers/chatController')

chat.get('/',controller.chatController)


module.exports = chat