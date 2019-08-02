const express = require('express')
const controller = require('../controllers/error-controller')

const router = express.Router()

router.all('*', controller.notFound)

module.exports = router