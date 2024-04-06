const express = require('express')
const api = express.Router()
const controller = require('../controllers/apiController')

api.get('/', controller.apiController)

module.exports = api