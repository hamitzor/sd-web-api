const express = require('express')
const controller = require('../controllers/auth-controller')

const router = express.Router()

router.get('/login/:username/:password/', controller.login)

router.get('/logout/', controller.logout)

router.get('/register/:username/:password/', controller.register)

router.get('/is-logged-in/', controller.isLoggedIn)

module.exports = router