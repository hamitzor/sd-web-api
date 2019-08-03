const express = require('express')
const authRouter = require('./auth-router')
const errorRouter = require('./error-router')
const configSetRouter = require('./config-set-router')
const configFieldRouter = require('./config-field-router')

const router = express.Router()

router.use('/auth', authRouter)
router.use('/config', configSetRouter)
router.use('/config-field', configFieldRouter)
router.all('*', errorRouter)

module.exports = router