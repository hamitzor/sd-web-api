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

router.use('/static', staticRouter)
router.use('/config', allowAdmin(), configSetRouter)
router.use('/config-field', allowAdmin(), configFieldRouter)
router.use('/user', /*responseDelayer(1000),*/ userRouter)
router.use('/user-session', /*responseDelayer(1000),*/ userSessionRouter)
router.all('*', errorRouter)

module.exports = router
