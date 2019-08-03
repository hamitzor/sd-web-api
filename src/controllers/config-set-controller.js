/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */
//const logger = require('../util/logger')
const { ObjectId } = require('mongoose').mongo
const { ConfigSet } = require('../database/config-set-model')
const messages = require('../messages')('config-set-api')
const { addConfigLinks } = require('../util/links-creators')
const handleException = require('../util/handle-controller-exception')


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
    if (!ObjectId.isValid(id)) { res.badRequest(messages.idNotValid); return }
    const doc = await ConfigSet.findById(id).populate('fields')
    res.ok(doc ? addConfigLinks(doc.toObject()) : doc)
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
    if (!ObjectId.isValid(id)) { res.badRequest(messages.idNotValid); return }
    const { name } = req.body
    const doc = await ConfigSet.findByIdAndUpdate(id, { [name ? "name" : ""]: name }, { new: true, runValidators: true }).populate('fields')
    res.ok(doc ? addConfigLinks(doc.toObject()) : doc)
  }
  catch (err) {
    handleException(err, res)
  }
}
exports.delete = async (req, res) => {
  try {
    const { id } = req.params
    if (!ObjectId.isValid(id)) { res.badRequest(messages.idNotValid); return }
    const doc = await ConfigSet.deleteOne({ _id: id })
    res.ok(doc.deletedCount > 0 ? id : null)
  }
  catch (err) {
    handleException(err, res)
  }
}