const express = require('express')
const controller = require('../controllers/user-session-controller')
const { allowAdmin, allowAuthenticated } = require('../express-middlewares/allow-role')

const router = express.Router()

router.get('/', allowAdmin(), controller.getAll)
router.get('/:id', allowAdmin(), controller.get)
router.post('/', controller.create)
router.delete('/:id', allowAdmin(), controller.delete)
router.delete('/', allowAuthenticated(), controller.deleteWithCookie)

module.exports = router