const config = require('../../app.config')
const express = require('express')
const errorRouter = require('./error-router')
const configSetRouter = require('./config-set-router')
const configFieldRouter = require('./config-field-router')
const userRouter = require('./user-router')
const userSessionRouter = require('./user-session-router')
const { allowAdmin } = require('../express-middlewares/allow-role')
const responseDelayer = require('../express-middlewares/response-delayer')

const router = express.Router()

const staticRouter = express.static(config.storage.root)

const delay = 1000

router.use('/static', responseDelayer(delay), staticRouter)
router.use('/config', [allowAdmin(), responseDelayer(delay)], configSetRouter)
router.use('/config-field', [allowAdmin(), responseDelayer(delay)], configFieldRouter)
router.use('/user', responseDelayer(delay), userRouter)
router.use('/user-session', responseDelayer(delay), userSessionRouter)
router.all('*', errorRouter)

module.exports = router
