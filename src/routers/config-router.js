const express = require('express')
const configController = require('../controllers/config-controller')
const config = require('../util/config-loader')
const configRouter = express.Router()
const allowIps = require('../express-middlewares/allowIps')


configRouter.get(config.web_api.route.config.public, configController.public)

configRouter.get(config.web_api.route.config.private, allowIps(config.web_api.private_config_client_ips), configController.private)

module.exports = configRouter