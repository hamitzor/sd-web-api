const { ObjectId } = require('mongoose').mongo
const { UserSession } = require('../database/user-session-model')
const messages = require('../messages')('config-set-api')
const config = require('../../app.config')
const handleException = require('../util/handle-controller-exception')

module.exports = role => async (req, res, next) => {
  try {
    const id = req.getSessionCookie()
    if (!id) { res.forbidden(); return }
    if (!ObjectId.isValid(id)) { res.badRequest(messages.idNotValid); return }
    const doc = await UserSession.findByIdAndUpdate(id, { expireTime: new Date(Date.now() + config.auth.ttl) }, { new: true, runValidators: true }).populate('user')
    if (!doc || !doc.user || doc.user.role !== role) { res.forbidden(); return }
    res.setSessionCookie(id)
    req.user = doc.user
    next()
  }
  catch (err) {
    handleException(err, res)
  }
}