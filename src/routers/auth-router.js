const express = require('express')
const authController = require('../controllers/auth-controller')

const authRouter = express.Router()

authRouter.get('/login/:username/:password', authController.login)

authRouter.get('/logout', authController.logout)

authRouter.get('/register/:username/:password', authController.register)

authRouter.get('/is-logged-in', authController.isLoggedIn)

module.exports = authRouter