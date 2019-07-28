const express = require('express')
const authRouter = require('./auth-router')
const errorRouter = require('./error-router')

const rootRouter = express.Router()

rootRouter.use('/auth', authRouter)
rootRouter.all('*', errorRouter)

module.exports = rootRouter