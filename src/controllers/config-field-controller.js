/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */
//const logger = require('../util/logger')
const { ObjectId } = require('mongoose').mongo
const { ConfigSet } = require('../database/config-set-model')
const { ConfigField } = require('../database/config-field-model')
const messages = require('../messages')('config-set-api')
const { addFieldLinks } = require('../util/links-creators')
const handleException = require('../util/handle-controller-exception')

exports.createField = async (req, res) => {
  try {
    const { configSetId } = req.params
    if (!ObjectId.isValid(configSetId)) { res.badRequest(messages.configSetIdNotValid); return }
    const { key, value } = req.body
    const field = new ConfigField({ key, value, configSet: configSetId })
    await field.save()
    await ConfigSet.findByIdAndUpdate(configSetId, { $push: { fields: field._id } })
    res.ok(addFieldLinks(field.toObject()))
  }
  catch (err) {
    handleException(err, res)
  }
}
exports.updateField = async (req, res) => {
  try {
    const { id } = req.params
    if (!ObjectId.isValid(id)) { res.badRequest(messages.idNotValid); return }
    const { key, value } = req.body
    const doc = await ConfigField.findByIdAndUpdate(id, { [key ? "key" : ""]: key, [value ? "value" : ""]: value }, { new: true, runValidators: true })
    res.ok(doc ? addFieldLinks(doc.toObject()) : doc)
  }
  catch (err) {
    handleException(err, res)
  }
}
exports.deleteField = async (req, res) => {
  try {
    const { id } = req.params
    if (!ObjectId.isValid(id)) { res.badRequest(messages.idNotValid); return }
    const doc = await ConfigField.findByIdAndDelete(id)
    if (doc) {
      await ConfigSet.updateOne({ _id: doc.configSet }, { $pull: { fields: id } })
      res.ok(id)
    }
    else {
      res.ok(null)
    }
  }
  catch (err) {
    handleException(err, res)
  }
}