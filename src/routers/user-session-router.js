const express = require('express')
const controller = require('../controllers/user-session-controller')

const router = express.Router()

router.get('/', controller.getAll)
router.get('/:id', controller.get)
router.post('/', controller.create)
router.delete('/:id', controller.delete)
router.delete('/', controller.deleteWithCookie)

module.exports = router