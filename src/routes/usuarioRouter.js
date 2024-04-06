const express = require('express')
const usuarios = express.Router()
const controller = require('../controllers/usuariosController')

usuarios.get('/', controller.usuariosController)

module.exports = router 