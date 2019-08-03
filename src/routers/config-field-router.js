const express = require('express')
const controller = require('../controllers/config-field-controller')

const router = express.Router()

router.post('/:configSetId', controller.createField)
router.put('/:id', controller.updateField)
router.delete('/:id', controller.deleteField)

module.exports = router