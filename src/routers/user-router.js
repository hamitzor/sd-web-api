const express = require('express')
const controller = require('../controllers/user-controller')
const { allowAdmin, allowAuthenticated } = require('../express-middlewares/allow-role')

const router = express.Router()

router.get('/', allowAdmin(), controller.getAll)
router.get('/:id', allowAuthenticated('id'), controller.get)
router.post('/', controller.create)
router.put('/:id', allowAuthenticated('id'), controller.update)
router.delete('/:id', allowAuthenticated('id'), controller.delete)
router.delete('/:id/avatar', allowAuthenticated('id'), controller.deleteAvatar)
router.put('/:id/role', allowAdmin('id'), controller.updateUserRole)

module.exports = router