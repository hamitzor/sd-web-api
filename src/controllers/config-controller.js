/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

const logger = require('../util/logger')
const config = require('../../app.config')
const configModel = require('../database/config-model')
const { MongoError, ObjectID } = require('mongodb')

const handleException = (err, res) => {
  if (err instanceof MongoError && err.code === 47) {
    res.notFound()
    return
  }
  if (err instanceof MongoError && err.code === 11000) {
    res.badRequest("Duplicated field")
    return
  }
  res.internalServerError()
  logger.error(err.message, err.stack)
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
    const docs = await configModel.find()
    res.ok(docs.map(addConfigLinks))
  }
  catch (err) {
    handleException(err, res)
  }
}

exports.get = async (req, res) => {
  try {
    const { id } = req.params
    if (!ObjectID.isValid(id)) { res.badRequest("id is not valid"); return }
    const doc = await configModel.findOne(id)
    res.ok(addConfigLinks(doc))
  }
  catch (err) {
    handleException(err, res)
  }
}

exports.create = async (req, res) => {
  try {
    const { name } = req.body
    if (typeof name !== 'string' || name.trim() === '') { res.badRequest("name is not string or empty"); return }

    const doc = await configModel.add({ name: name.trim(), fields: [] })
    res.ok(addConfigLinks(doc))
  }
  catch (err) {
    handleException(err, res)
  }
}

exports.update = async (req, res) => {
  try {
    const { id } = req.params
    if (!ObjectID.isValid(id)) { res.badRequest("id is not valid"); return }
    const { name } = req.body
    if (typeof name !== 'string' || name.trim() === '') { res.badRequest("name is not string or empty"); return }
    const doc = await configModel.update(id, { $set: { name: name.trim() } })
    res.ok(addConfigLinks(doc))
  }
  catch (err) {
    handleException(err, res)
  }
}

exports.delete = async (req, res) => {
  try {
    const { id } = req.params
    if (!ObjectID.isValid(id)) { res.badRequest("id is not valid"); return }
    await configModel.delete(id)
    res.ok(id)
  }
  catch (err) {
    handleException(err, res)
  }
}

exports.getAllFields = async (req, res) => {
  try {
    const { configId } = req.params
    if (!ObjectID.isValid(configId)) { res.badRequest("configId is not valid"); return }
    const fields = await configModel.findFields(configId)
    res.ok(fields.map(field => addFieldLinks(field, configId)))
  }
  catch (err) {
    handleException(err, res)
  }
}

exports.getField = async (req, res) => {
  try {
    const { configId, fieldId } = req.params
    if (!ObjectID.isValid(configId)) { res.badRequest("configId is not valid"); return }
    if (!ObjectID.isValid(fieldId)) { res.badRequest("fieldId is not valid"); return }
    const field = await configModel.findOneField(configId, fieldId)
    res.ok(addFieldLinks(field, configId))
  }
  catch (err) {
    handleException(err, res)
  }
}

exports.createField = async (req, res) => {
  try {
    const { configId } = req.params
    const { key, value } = req.body
    if (!ObjectID.isValid(configId)) { res.badRequest("configId is not valid"); return }
    if (typeof key !== 'string' || key.trim() === '') { res.badRequest("key is not string or empty"); return }
    const field = await configModel.createField(configId, { key, value })
    res.ok(addFieldLinks(field, configId))
  }
  catch (err) {
    handleException(err, res)
  }
}

exports.updateField = async (req, res) => {
  try {
    const { configId, fieldId } = req.params
    if (!ObjectID.isValid(configId)) { res.badRequest("configId is not valid"); return }
    if (!ObjectID.isValid(fieldId)) { res.badRequest("fieldId is not valid"); return }
    const { key, value } = req.body
    if (key === undefined && value === undefined) { res.badRequest("there is no update"); return }
    if (key !== undefined && typeof key !== 'string') { res.badRequest("key is not valid"); return }
    if (typeof key === 'string' && !key.trim()) { res.badRequest("key is not valid"); return }
    const field = await configModel.updateField(configId, fieldId, { key, value })
    res.ok(addFieldLinks(field, configId))
  }
  catch (err) {
    handleException(err, res)
  }
}

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