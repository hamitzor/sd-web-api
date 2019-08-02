const express = require('express')
const authRouter = require('./auth-router')
const errorRouter = require('./error-router')
const configRouter = require('./config-router')

const router = express.Router()

router.use('/auth', authRouter)
router.use('/config', configRouter)
router.all('*', errorRouter)

module.exports = router