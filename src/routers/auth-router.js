const express = require('express')
const authController = require('../controllers/auth-controller')
const config = require('../util/config-loader')
const formatRoute = require('../util/format-route')

const authRouter = express.Router()

authRouter.get(formatRoute(config.web_api.route.auth.login, { username: ':username', password: ':password' }), authController.login)

authRouter.get(config.web_api.route.auth.logout, authController.logout)

authRouter.get(formatRoute(config.web_api.route.auth.register, { username: ':username', password: ':password' }), authController.register)

authRouter.get(config.web_api.route.auth.is_logged_in, authController.isLoggedIn)

module.exports = authRouter