const express = require('express')
const controller = require('../controllers/config-field-controller')

const router = express.Router()

router.post('/:configSetId', controller.create)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)

module.exports = router