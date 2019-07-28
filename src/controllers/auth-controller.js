/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

const { Controller } = require('./controller')
const logger = require('../util/logger')
const auth = require('../database/auth-model')
const status = require('../../status-codes')

const COOKIE_NAME = 'AUTH_DATA'

class AuthController extends Controller {

  login = async (req, res) => {
    try {
      const { username, password } = req.params
      const { sessionId: newSessionId, user } = await auth.login({ username, password })
      if (!newSessionId) {
        this._send(res, status.web.BAD_REQUEST, { message: 'Wrong username or password' })
        return
      }
      res.cookie(COOKIE_NAME, newSessionId, { maxAge: Number.MAX_SAFE_INTEGER })
      this._send(res, status.web.OK, { sessionId: newSessionId, user: { username: user.username } })
    }
    catch (err) {
      this._send(res, status.web.INTERNAL_SERVER_ERROR)
      logger.logError(err.message, err.stack)
    }
  }

  register = async (req, res) => {
    try {
      const { username, password } = req.params
      if (await auth.isUser(username)) {
        this._send(res, status.web.FORBIDDEN)
        return
      }
      await auth.register({ username, password })
      const { sessionId: newSessionId, user } = await auth.login({ username, password })
      res.cookie(COOKIE_NAME, newSessionId, { maxAge: Number.MAX_SAFE_INTEGER })
      this._send(res, status.web.OK, { sessionId: newSessionId, user: { username: user.username } })
    }
    catch (err) {
      this._send(res, status.web.INTERNAL_SERVER_ERROR)
      logger.logError(err.message, err.stack)
    }
  }

  logout = async (req, res) => {
    try {
      const setSessionId = req.cookies[COOKIE_NAME]
      if (!setSessionId) {
        this._send(res, status.web.BAD_REQUEST, { message: 'There is no session' })
        return
      }
      const user = await auth.isLoggedIn(setSessionId)
      if (!user) {
        this._send(res, status.web.BAD_REQUEST, { message: 'There is no session' })
        return
      }
      if (!await auth.logout(user._id)) {
        this._send(res, status.web.INTERNAL_SERVER_ERROR)
        logger.logError(`Cannot logout user ${user.username}`)
        return
      }
      res.clearCookie(COOKIE_NAME)
      this._send(res, status.web.OK)
    } catch (err) {
      this._send(res, status.web.INTERNAL_SERVER_ERROR)
      logger.logError(err.message, err.stack)
    }
  }

  isLoggedIn = async (req, res) => {
    try {
      const setSessionId = req.cookies[COOKIE_NAME]
      if (setSessionId) {
        const user = await auth.isLoggedIn(setSessionId)
        if (user) {
          this._send(res, status.web.OK, {
            username: user.username
          })
          return
        }
      }
      this._send(res, status.web.NOT_FOUND)
    }
    catch (err) {
      this._send(res, status.web.INTERNAL_SERVER_ERROR)
      logger.logError(err.message, err.stack)
    }
  }

}

module.exports = (new AuthController)