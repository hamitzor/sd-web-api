const express = require('express')
const controller = require('../controllers/config-set-controller')

const router = express.Router()

router.get('/', controller.getAll)
router.get('/:id', controller.get)
router.post('/', controller.create)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)
router.post('/field/:configSetId', controller.createField)
router.put('/field/:id', controller.updateField)
router.delete('/field/:id', controller.deleteField)

module.exports = router