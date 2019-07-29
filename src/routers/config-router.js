const express = require('express')
const configController = require('../controllers/config-controller')

const configRouter = express.Router()

configRouter.get('/', configController.getAll)
configRouter.post('/', configController.add)
configRouter.put('/', configController.update)
configRouter.delete('/:name', configController.delete)
configRouter.post('/:setName/', configController.addField)
configRouter.put('/:setName', configController.updateField)
configRouter.delete('/field/:name', configController.deleteField)

module.exports = configRouter