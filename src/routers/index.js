const express = require('express')
const authRouter = require('./auth-router')
const errorRouter = require('./error-router')
const configRouter = require('./config-router')

const rootRouter = express.Router()

rootRouter.use('/auth', authRouter)
rootRouter.use('/config', configRouter)
rootRouter.all('*', errorRouter)

module.exports = rootRouter