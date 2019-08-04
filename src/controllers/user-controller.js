/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */
const { ObjectId } = require('mongoose').mongo
const { User } = require('../database/user-model')
const messages = require('../messages')('config-set-api')
const { addUserLinks } = require('../util/links-creators')
const handleException = require('../util/handle-controller-exception')


exports.getAll = async (_, res) => {
  try {
    res.ok((await User.find().populate('session')).map(doc => addUserLinks({ ...doc.toObject(), pwd: undefined })))
  }
  catch (err) {
    handleException(err, res)
  }
}
exports.get = async (req, res) => {
  try {
    const { id } = req.params
    if (!ObjectId.isValid(id)) { res.badRequest(messages.idNotValid); return }
    const doc = await User.findById(id).populate('session')
    res.ok(doc ? addUserLinks({ ...doc.toObject(), pwd: undefined }) : doc)
  }
  catch (err) {
    handleException(err, res)
  }
}
exports.create = async (req, res) => {
  try {
    const { name, user, pwd, role } = req.body
    res.ok(addUserLinks({ ... (await new User({ name, user, pwd, role }).save()).toObject(), pwd: undefined }))
  }
  catch (err) {
    handleException(err, res)
  }
}
exports.update = async (req, res) => {
  try {
    const { id } = req.params
    if (!ObjectId.isValid(id)) { res.badRequest(messages.idNotValid); return }
    const { name, pwd, role } = req.body
    const doc = await User.findByIdAndUpdate(id, { [name ? 'name' : '']: name, [pwd ? 'pwd' : '']: pwd, [role ? 'role' : '']: role }, { new: true, runValidators: true }).populate('session')
    res.ok(doc ? addUserLinks({ ...doc.toObject(), pwd: undefined }) : doc)
  }
  catch (err) {
    handleException(err, res)
  }
}
exports.delete = async (req, res) => {
  try {
    const { id } = req.params
    if (!ObjectId.isValid(id)) { res.badRequest(messages.idNotValid); return }
    const doc = await User.deleteOne({ _id: id })
    res.ok(doc.deletedCount > 0 ? id : null)
  }
  catch (err) {
    handleException(err, res)
  }
}