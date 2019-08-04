const { ObjectId } = require('mongoose').mongo
const { UserSession } = require('../database/user-session-model')
const messages = require('../messages')('config-set-api')
const config = require('../../app.config')
const handleException = require('../util/handle-controller-exception')

const allowRoles = (roles, checkId) => async (req, res, next) => {
  try {
    const id = req.getSessionCookie()
    if (!id) { res.forbidden(); return }
    if (!ObjectId.isValid(id)) { res.badRequest(messages.idNotValid); return }
    const doc = await UserSession.findByIdAndUpdate(id, { expireTime: new Date(Date.now() + config.auth.ttl) }, { new: true, runValidators: true }).populate('user')
    if (!doc || !doc.user) { res.forbidden(); return }
    if (!Array.isArray(roles)) {
      if (doc.user.role !== roles) { res.forbidden(); return }
    }
    else {
      if (!roles.includes(doc.user.role)) { res.forbidden(); return }
    }
    if (checkId && doc.user.role !== 'ADMIN' && doc.user._id.toString() !== req.params[checkId]) { res.forbidden(); return }
    res.setSessionCookie(id)
    req.user = doc.user
    next()
  }
  catch (err) {
    handleException(err, res)
  }
}

exports.allowAuthenticated = (checkId) => allowRoles(['ADMIN', 'USER'], checkId)
exports.allowAdmin = () => allowRoles('ADMIN')