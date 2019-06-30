/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

const { Controller } = require('./controller')
const logger = require('../util/logger')
const config = require('../util/config-loader')
const authModel = require('../models/auth')

const WEB_STATUS = config.codes.web_status

const COOKIE_NAME = config.auth.cookie_name

class AuthController extends Controller {

  login = async (req, res) => {
    try {
      const { username, password } = req.params
      const newSessionId = await authModel.login({ username, password })
      if (!newSessionId) {
        this._send(res, WEB_STATUS.BAD_REQUEST, { message: 'Wrong username or password' })
        return
      }
      res.cookie(COOKIE_NAME, newSessionId, { maxAge: 999999999999 })
      this._send(res, WEB_STATUS.OK, { sessionId: newSessionId })
    }
    catch (err) {
      this._send(res, WEB_STATUS.INTERNAL_SERVER_ERROR)
      logger.logError(err.message, err.stack)
    }
  }

  register = async (req, res) => {
    try {
      const { username, password } = req.params
      if (await authModel.isUser(username)) {
        this._send(res, WEB_STATUS.FORBIDDEN)
        return
      }
      await authModel.register({ username, password })
      const newSessionId = await authModel.login({ username, password })
      res.cookie(COOKIE_NAME, newSessionId, { maxAge: 999999999999 })
      this._send(res, WEB_STATUS.OK, { sessionId: newSessionId })
    }
    catch (err) {
      this._send(res, WEB_STATUS.INTERNAL_SERVER_ERROR)
      logger.logError(err.message, err.stack)
    }
  }

  logout = async (req, res) => {
    try {
      const setSessionId = req.cookies[COOKIE_NAME]
      if (!setSessionId) {
        this._send(res, WEB_STATUS.BAD_REQUEST, { message: 'No cookie detected' })
        return
      }
      const user = await authModel.isLoggedIn(setSessionId)
      if (!user) {
        this._send(res, WEB_STATUS.BAD_REQUEST, { message: 'No sessions detected' })
        return
      }
      if (!await authModel.logout(user._id)) {
        this._send(res, WEB_STATUS.INTERNAL_SERVER_ERROR)
        logger.logError(`Cannot unset sessionId from user ${user.username}`)
        return
      }
      res.clearCookie(COOKIE_NAME)
      this._send(res, WEB_STATUS.OK)
      return
    } catch (err) {
      this._send(res, WEB_STATUS.INTERNAL_SERVER_ERROR)
      logger.logError(err.message, err.stack)
    }
  }

  isLoggedIn = async (req, res) => {
    try {
      const setSessionId = req.cookies[COOKIE_NAME]
      if (setSessionId) {
        const user = await authModel.isLoggedIn(setSessionId)
        if (user) {
          this._send(res, WEB_STATUS.OK, {
            username: user.username
          })
          return
        }
      }
      this._send(res, WEB_STATUS.NOT_FOUND)
    }
    catch (err) {
      this._send(res, WEB_STATUS.INTERNAL_SERVER_ERROR)
      logger.logError(err.message, err.stack)
    }
  }

}

module.exports = (new AuthController)