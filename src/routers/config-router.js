const express = require('express')
const configController = require('../controllers/config-controller')

const configRouter = express.Router()

configRouter.get('/', configController.getAll)
configRouter.get('/:id', configController.get)
configRouter.post('/', configController.create)
configRouter.put('/:id', configController.update)
configRouter.delete('/:id', configController.delete)
configRouter.post('/field/:configId', configController.createField)
configRouter.put('/field/:configId/:fieldId', configController.updateField)
//configRouter.delete('/field/:configId/:fieldId', configController.deleteField)

module.exports = configRouter