const model = require('./model')
const { ObjectId } = require('mongodb')
const { generateSessionId, hashPassword } = require('../util/auth')

const login = async ({ username, password }) => {
  await model.connect()
  const user = await model.db.collection('users').findOne({
    username,
    password: hashPassword(password)
  })
  if (user) {
    const sessionId = generateSessionId()
    await model.db.collection('users').updateOne({ _id: ObjectId(user._id) }, { $set: { sessionId } })
    return { sessionId, user }
  }
  return {}
}

const logout = async (userId) => {
  await model.connect()
  const r = await model.db.collection('users').updateOne({ _id: ObjectId(userId) }, { $unset: { sessionId: 1 } })
  if (r.matchedCount !== 1 || r.modifiedCount !== 1) {
    return false
  }
  return true
}

const isLoggedIn = async (sessionId) => {
  await model.connect()
  const user = await model.db.collection('users').findOne({
    sessionId
  })
  return user
}

const isUser = async (username) => {
  await model.connect()
  const user = await model.db.collection('users').findOne({
    username
  })
  return user
}

const register = async ({ username, password }) => {
  await model.connect()
  await model.db.collection('users').insertOne({
    username,
    password: hashPassword(password),
    videos: []
  })
}

module.exports = { login, logout, isLoggedIn, isUser, register }