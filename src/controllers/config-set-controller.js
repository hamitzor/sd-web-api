/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */
const { ObjectId } = require('mongoose').mongo
const { ConfigSet } = require('../database/config-set-model')
const {
  INVALID,
} = require('../../error-codes')
const { addConfigLinks } = require('../util/links-creators')
const handleException = require('../util/handle-controller-exception')


exports.getAll = async (req, res) => {
  try {
    res.ok((await ConfigSet.find().populate('fields')).map(doc => addConfigLinks(doc.toObject())))
  }
  catch (err) {
    handleException(err, res, ConfigSet.collection)
  }
}
exports.get = async (req, res) => {
  try {
    const { id } = req.params
    if (!ObjectId.isValid(id)) { res.badRequest({ id: INVALID }); return }
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
    handleException(err, res, ConfigSet.collection)
  }
}
exports.update = async (req, res) => {
  try {
    const { id } = req.params
    if (!ObjectId.isValid(id)) { res.badRequest({ id: INVALID }); return }
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
    if (!ObjectId.isValid(id)) { res.badRequest({ id: INVALID }); return }
    const doc = await ConfigSet.deleteOne({ _id: id })
    res.ok(doc.deletedCount > 0 ? id : null)
  }
  catch (err) {
    handleException(err, res)
  }
}