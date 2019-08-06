const express = require('express')
const controller = require('../controllers/user-session-controller')
const { allowAdmin, allowAuthenticated } = require('../express-middlewares/allow-role')

const router = express.Router()

router.get('/', allowAdmin(), controller.getAll)
router.get('/with-cookie', allowAuthenticated(), controller.getWithCookie)
router.get('/:id', allowAdmin(), controller.get)
router.post('/', controller.create)
router.delete('/with-cookie', allowAuthenticated(), controller.deleteWithCookie)
router.delete('/:id', allowAdmin(), controller.delete)

module.exports = router