/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

const Controller = require('./controller')
const logger = require('../util/logger')
const model = require('../models/model')
const { ObjectId } = require('mongodb')
const { generateSessionId, hashPassword } = require('../util/auth')
const {
  WEB_STATUS_BAD_REQUEST,
  WEB_STATUS_INTERNAL_SERVER_ERROR,
  WEB_STATUS_OK,
  WEB_STATUS_NOT_FOUND,
  WEB_STATUS_FORBIDDEN
} = require('../util/status-codes')

const COOKIE_NAME = 'SD_SESSION_ID'

class AuthController extends Controller {

  login = async (req, res) => {
    try {
      const { username, password } = req.params
      const newSessionId = await this._login(username, password)
      if (!newSessionId) {
        this._send(res, WEB_STATUS_BAD_REQUEST, { message: 'Wrong username or password' })
        return
      }
      res.cookie(COOKIE_NAME, newSessionId)
      this._send(res, WEB_STATUS_OK, { sessionId: newSessionId })
    }
    catch (err) {
      this._send(res, WEB_STATUS_INTERNAL_SERVER_ERROR)
      logger.logError(err.message, err.stack)
    }
  }

  register = async (req, res) => {
    try {
      const { username, password } = req.params
      if (await this._isUser(username)) {
        this._send(res, WEB_STATUS_FORBIDDEN)
        return
      }
      await this._register(username, password)
      await this._login(username, password)
      const newSessionId = await this._login(username, password)
      res.cookie(COOKIE_NAME, newSessionId)
      this._send(res, WEB_STATUS_OK, { sessionId: newSessionId })
    }
    catch (err) {
      this._send(res, WEB_STATUS_INTERNAL_SERVER_ERROR)
      logger.logError(err.message, err.stack)
    }
  }

  logout = async (req, res) => {
    try {
      const setSessionId = req.cookies[COOKIE_NAME]
      if (!setSessionId) {
        this._send(res, WEB_STATUS_BAD_REQUEST, { message: 'No cookie detected' })
        return
      }
      const user = await this._isLoggedIn(setSessionId)
      if (!user) {
        this._send(res, WEB_STATUS_BAD_REQUEST, { message: 'No sessions detected' })
        return
      }
      if (!await this._logout(user._id)) {
        this._send(res, WEB_STATUS_INTERNAL_SERVER_ERROR)
        logger.logError(`Cannot unset sessionId from user ${user.username}`, stack)
        return
      }
      res.clearCookie(COOKIE_NAME)
      this._send(res, WEB_STATUS_OK)
      return
    } catch (err) {
      this._send(res, WEB_STATUS_INTERNAL_SERVER_ERROR)
      logger.logError(err.message, err.stack)
    }
  }

  isLoggedIn = async (req, res) => {
    try {
      const setSessionId = req.cookies[COOKIE_NAME]
      if (setSessionId) {
        const user = await this._isLoggedIn(setSessionId)
        if (user) {
          this._send(res, WEB_STATUS_OK, {
            username: user.username
          })
          return
        }
      }
      this._send(res, WEB_STATUS_NOT_FOUND)
    }
    catch (err) {
      this._send(res, WEB_STATUS_INTERNAL_SERVER_ERROR)
      logger.logError(err.message, err.stack)
    }
  }

  _login = async (username, password) => {
    await model.connect()
    const user = await model.db.collection('users').findOne({
      username,
      password: hashPassword(password)
    })
    if (user) {
      const sessionId = generateSessionId()
      await model.db.collection('users').updateOne({ _id: ObjectId(user._id) }, { $set: { sessionId } })
      return sessionId
    }
    return null
  }

  _logout = async (userId) => {
    await model.connect()
    const r = await model.db.collection('users').updateOne({ _id: ObjectId(userId) }, { $unset: { sessionId: 1 } })
    if (r.matchedCount !== 1 || r.modifiedCount !== 1) {
      return false
    }
    return true
  }

  _isLoggedIn = async (sessionId) => {
    await model.connect()
    const user = await model.db.collection('users').findOne({
      sessionId
    })
    return user
  }

  _isUser = async (username) => {
    await model.connect()
    const user = await model.db.collection('users').findOne({
      username
    })
    return user
  }

  _register = async (username, password) => {
    await model.connect()
    await model.db.collection('users').insertOne({
      username,
      password: hashPassword(password)
    })
  }


}

module.exports = (new AuthController)