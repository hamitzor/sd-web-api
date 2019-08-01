/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

const logger = require('../util/logger')
const config = require('../../app.config')
const { ObjectId } = require('mongoose').mongo
const { ConfigSet, ConfigField } = require('../database/config-set-model')

const handleException = (err, res) => {
  console.log(err)
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
      console.log(err)
    //logger.error(err.message, err.stack)
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

const generateFieldLinks = (configId, fieldId) => ({
  self: `${rootUrl}/config/field/${configId}/${fieldId}`
})

const addFieldLinks = (field, configId) => ({ ...field, _links: generateFieldLinks(configId, field._id) })
const addConfigLinks = doc => ({ ...doc, fields: doc.fields.map(field => addFieldLinks(field, doc._id)), _links: generateConfigLinks(doc._id) })


exports.getAll = async (req, res) => {
  try {
    const data = (await ConfigField.find()).reduce((acc, field) => ({
      ...acc, [field.configSetId]: acc[field.configSetId] ? [...acc[field.configSetId], field] : [field]
    }), {})

    res.ok(Object.keys(data).map(name => ({
      name: name,
      fields: data[name]
    })))
  }
  catch (err) {
    handleException(err, res)
  }
}

exports.get = async (req, res) => {
  try {
    const { _id } = req.params
    res.ok(await ConfigField.find({ configSetId: _id }))
  }
  catch (err) {
    handleException(err, res)
  }
}

exports.create = async (req, res) => {
  try {
    const { _id } = req.body
    res.ok((await new ConfigSet({ _id }).save()).toObject())
  }
  catch (err) {
    handleException(err, res)
  }
}
//@TODO
exports.update = async (req, res) => {
  try {
    const { id } = req.params
    if (!ObjectId.isValid(id)) { res.badRequest("id is not valid"); return }
    const { name } = req.body
    res.ok(addConfigLinks((await ConfigSet.findOneAndUpdate({ _id: id }, { name }, { new: true, runValidators: true })).toObject()))
  }
  catch (err) {
    handleException(err, res)
  }
}
//@TODO
exports.delete = async (req, res) => {
  try {
    const { id } = req.params
    if (!ObjectId.isValid(id)) { res.badRequest("id is not valid"); return }
    const doc = await ConfigSet.findOneAndDelete({ _id: id })
    res.ok(doc ? doc._id : doc)
  }
  catch (err) {
    handleException(err, res)
  }
}
//@TODO
exports.createField = async (req, res) => {
  try {
    const { configSetId } = req.params
    const { key, value } = req.body
    const field = new ConfigField({ key, value, configSetId })
    await field.save()
    res.ok(field.toObject())
  }
  catch (err) {
    handleException(err, res)
  }
}

exports.updateField = async (req, res) => {
  try {
    const { configId, fieldId } = req.params
    if (!ObjectId.isValid(configId)) { res.badRequest("configId is not valid"); return }
    if (!ObjectId.isValid(fieldId)) { res.badRequest("fieldId is not valid"); return }
    const { key, value } = req.body
    const field = { key, value }
    const { n: matchCount } = await ConfigSet.updateOne({ _id: configId, 'fields.key': { $ne: key } }, { $push: { fields: field } }, { runValidators: true })
    res.ok(matchCount > 0 ? addFieldLinks(field, configId) : null)
  }
  catch (err) {
    handleException(err, res)
  }
}


/**
 *
 *





exports.deleteField = async (req, res) => {
  try {
    const { configId, fieldId } = req.params
    if (!ObjectID.isValid(configId)) { res.badRequest("configId is not valid"); return }
    if (!ObjectID.isValid(fieldId)) { res.badRequest("fieldId is not valid"); return }
    await configModel.deleteField(configId, fieldId)
    res.ok(fieldId)
  }
  catch (err) {
    handleException(err, res)
  }
}
 */