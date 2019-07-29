const authModel = require('../models/auth')
const logger = require('../util/logger')

const COOKIE_NAME = 'AUTH_DATA'

module.exports = async (req, res, next) => {
  try {
    const setSessionId = req.cookies[COOKIE_NAME]
    if (setSessionId) {
      const user = await authModel.isLoggedIn(setSessionId)
      if (user) {
        req.auth = {
          user
        }
        next()
        return
      }
    }
    res.forbidden()
  }
  catch (err) {
    logger.error(err.message, err.stack)
    res.internalServerError()
  }
}