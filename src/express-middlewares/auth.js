const authModel = require('../models/auth')
const logger = require('../util/logger')
const config = require('../util/config-loader')
const { send } = require('../controllers/controller')

const WEB_STATUS = config.codes.web_status

const COOKIE_NAME = config.auth.cookie_name

exports.authChecker = async (req, res, next) => {
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
    send(res, WEB_STATUS.FORBIDDEN)
  }
  catch (err) {
    logger.logError(err.message, err.stack)
    send(res, WEB_STATUS.INTERNAL_SERVER_ERROR)
  }
}