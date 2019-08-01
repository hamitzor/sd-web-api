const express = require('express')
const configController = require('../controllers/config-controller')

const configRouter = express.Router()

configRouter.get('/', configController.getAll)
configRouter.get('/:_id', configController.get)
configRouter.post('/', configController.create)
configRouter.put('/:_id', configController.update)
configRouter.delete('/:_id', configController.delete)
configRouter.post('/field/:configSetId', configController.createField)
configRouter.put('/field/:_id', configController.updateField)
//configRouter.delete('/field/:configId/:fieldId', configController.deleteField)

module.exports = configRouter