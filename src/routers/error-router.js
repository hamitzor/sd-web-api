const express = require('express')
const errorController = require('../controllers/error-controller')

const errorRouter = express.Router()

errorRouter.all('*', errorController.notFound)

module.exports = errorRouter