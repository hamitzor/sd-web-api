/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */
const { ObjectId } = require('mongoose').mongo
const { User } = require('../database/user-model')
const { UserSession } = require('../database/user-session-model')
const messages = require('../messages')('config-set-api')
const { addUserSessionLinks } = require('../util/links-creators')
const handleException = require('../util/handle-controller-exception')
const config = require('../../app.config')

exports.getAll = async (_, res) => {
  try {
    res.ok((await UserSession.find().populate('user')).map(doc => {
      const obj = doc.toObject()
      return addUserSessionLinks({ ...obj, user: { ...obj.user, pwd: undefined } })
    }))
  }
  catch (err) {
    handleException(err, res)
  }
}
exports.get = async (req, res) => {
  try {
    const { id } = req.params
    if (!ObjectId.isValid(id)) { res.badRequest(messages.idNotValid); return }
    const doc = await UserSession.findById(id).populate('user')
    if (!doc) { res.notFound(); return }
    const obj = doc.toObject()
    res.ok(doc ? addUserSessionLinks({ ...obj, user: { ...obj.user, pwd: undefined } }) : doc)
  }
  catch (err) {
    handleException(err, res)
  }
}
exports.delete = async (req, res) => {
  try {
    const { id } = req.params
    if (!ObjectId.isValid(id)) { res.badRequest(messages.idNotValid); return }
    const doc = await UserSession.findByIdAndDelete(id).populate('user')
    if (!doc) { res.notFound(); return }
    doc.user.session = undefined
    await doc.user.save()
    res.ok(id)
  }
  catch (err) {
    handleException(err, res)
  }
}
exports.create = async (req, res) => {
  try {
    const { user, pwd } = req.body
    const userDoc = await User.findOne({ user, pwd })
    if (!userDoc) { res.notFound(); return }
    const session = new UserSession({ user: userDoc._id, expireTime: new Date(Date.now() + config.auth.ttl), startTime: new Date() })
    await session.save()
    userDoc.session = session._id
    userDoc.save()
    res.setSessionCookie(session._id)
    res.ok(addUserSessionLinks(session.toObject()))
  }
  catch (err) {
    handleException(err, res)
  }
}
exports.deleteWithCookie = async (req, res) => {
  try {
    const id = req.getSessionCookie()
    if (!ObjectId.isValid(id)) { res.badRequest(messages.idNotValid); return }
    const doc = await UserSession.findByIdAndDelete(id).populate('user')
    if (!doc) { res.notFound(); return }
    doc.user.session = undefined
    await doc.user.save()
    res.clearSessionCookie()
    res.ok(id)
  }
  catch (err) {
    handleException(err, res)
  }
}