const express = require('express')
const configController = require('../controllers/config-controller')
const config = require('../util/config-loader')
const configRouter = express.Router()

configRouter.get(config.web_api.route.config.public, configController.public)
configRouter.get(config.web_api.route.config.private, configController.private)

module.exports = configRouter