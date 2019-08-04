const express = require('express')
const errorRouter = require('./error-router')
const configSetRouter = require('./config-set-router')
const configFieldRouter = require('./config-field-router')
const userRouter = require('./user-router')
const userSessionRouter = require('./user-session-router')
const allowRole = require('../express-middlewares/allow-role')

const router = express.Router()

router.use('/config', [allowRole('ADMIN')], configSetRouter)
router.use('/config-field', [allowRole('ADMIN')], configFieldRouter)
router.use('/user', userRouter)
router.use('/user-session', userSessionRouter)
router.all('*', errorRouter)

module.exports = router