/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */
const logger = require('../util/logger')
const config = require('../../app.config')
const { ObjectId } = require('mongoose').mongo
const { ConfigSet, ConfigField } = require('../database/config-set-model')

const handleException = (err, res) => {
  console.error(err)
  switch (err.name) {
    case 'ValidationError':
      res.badRequest(Object.keys(err.errors).map(key => ({ field: key, message: err.errors[key].message })))
      break
    case 'MongoError':
      switch (err.code) {
        case 47:
          res.notFound()
          break
        case 11000:
          res.badRequest("Duplicated field")
          break
        default:
          res.internalServerError()
      }
      break
    default:
      res.internalServerError(err)
      console.error(err)
      logger.error(err.message, err.stack)
  }
}

const rootUrl = `${config.port === 443 ? 'https' : 'http'}://${config.hostname}:${config.port}`
const generateConfigLinks = id => ({
  collection: `${rootUrl}/config`,
  create: `${rootUrl}/config`,
  self: `${rootUrl}/config/${id}`,
  fields: `${rootUrl}/config/field/${id}`,
  createField: `${rootUrl}/config/field/${id}`
})

const generateFieldLinks = (fieldId) => ({
  self: `${rootUrl}/config/field/${fieldId}`
})

const addFieldLinks = field => ({ ...field, _links: generateFieldLinks(field._id) })
const addConfigLinks = doc => ({ ...doc, fields: doc.fields.map(field => addFieldLinks(field)), _links: generateConfigLinks(doc._id) })

exports.getAll = async (_, res) => {
  try {
    res.ok((await ConfigSet.find().populate('fields')).map(doc => addConfigLinks(doc.toObject())))
  }
  catch (err) {
    handleException(err, res)
  }
}
exports.get = async (req, res) => {
  try {
    const { id } = req.params
    if (!ObjectId.isValid(id)) { res.badRequest("id is not valid"); return }
    res.ok(addConfigLinks((await ConfigSet.findById(id).populate('fields')).toObject()))
  }
  catch (err) {
    handleException(err, res)
  }
}
exports.create = async (req, res) => {
  try {
    const { name } = req.body
    res.ok(addConfigLinks((await new ConfigSet({ name }).save()).toObject()))
  }
  catch (err) {
    handleException(err, res)
  }
}
exports.update = async (req, res) => {
  try {
    const { id } = req.params
    if (!ObjectId.isValid(id)) { res.badRequest("id is not valid"); return }
    const { name } = req.body
    res.ok(addConfigLinks((await ConfigSet.findByIdAndUpdate(id, { name }, { new: true, runValidators: true }).populate('fields')).toObject()))
  }
  catch (err) {
    handleException(err, res)
  }
}
exports.delete = async (req, res) => {
  try {
    const { id } = req.params
    if (!ObjectId.isValid(id)) { res.badRequest("id is not valid"); return }
    const doc = await ConfigSet.deleteOne({ _id: id })
    res.ok(doc.deletedCount > 0 ? id : null)
  }
  catch (err) {
    handleException(err, res)
  }
}
exports.createField = async (req, res) => {
  try {
    const { configSetId } = req.params
    if (!ObjectId.isValid(configSetId)) { res.badRequest("configSetId is not valid"); return }
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
    if (!ObjectId.isValid(id)) { res.badRequest("id is not valid"); return }
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
    if (!ObjectId.isValid(id)) { res.badRequest("id is not valid"); return }
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