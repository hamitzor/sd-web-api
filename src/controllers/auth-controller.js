/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */


const logger = require('../util/logger')
const auth = require('../database/auth-model')

const COOKIE_NAME = 'AUTH_DATA'

exports.login = async (req, res) => {
  try {
    const { username, password } = req.params
    const { sessionId: newSessionId, user } = await auth.login({ username, password })
    if (!newSessionId) {
      res.badRequest({ message: 'Wrong username or password' })
      return
    }
    res.cookie(COOKIE_NAME, newSessionId, { maxAge: Number.MAX_SAFE_INTEGER })
    res.ok({ sessionId: newSessionId, user: { username: user.username } })
  }
  catch (err) {
    res.internalServerError()
    logger.error(err.message, err.stack)
  }
}
exports.register = async (req, res) => {
  try {
    const { username, password } = req.params
    if (await auth.isUser(username)) {
      res.forbidden()
      return
    }
    await auth.register({ username, password })
    const { sessionId: newSessionId, user } = await auth.login({ username, password })
    res.cookie(COOKIE_NAME, newSessionId, { maxAge: Number.MAX_SAFE_INTEGER })
    res.ok({ sessionId: newSessionId, user: { username: user.username } })
  }
  catch (err) {
    res.internalServerError()
    logger.error(err.message, err.stack)
  }
}
exports.logout = async (req, res) => {
  try {
    const setSessionId = req.cookies[COOKIE_NAME]
    if (!setSessionId) {
      res.badRequest({ message: 'There is no session' })
      return
    }
    const user = await auth.isLoggedIn(setSessionId)
    if (!user) {
      res.badRequest({ message: 'There is no session' })
      return
    }
    if (!await auth.logout(user._id)) {
      res.internalServerError()
      logger.error(`Cannot logout user ${user.username}`)
      return
    }
    res.clearCookie(COOKIE_NAME)
    res.ok()
  } catch (err) {
    res.internalServerError()
    logger.error(err.message, err.stack)
  }
}
exports.isLoggedIn = async (req, res) => {
  try {
    const setSessionId = req.cookies[COOKIE_NAME]
    if (setSessionId) {
      const user = await auth.isLoggedIn(setSessionId)
      if (user) {
        res.ok({
          username: user.username
        })
        return
      }
    }
    res.notFound()
  }
  catch (err) {
    res.internalServerError()
    logger.error(err.message, err.stack)
  }
}