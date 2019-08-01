/**
 *
 *
 * const { connection } = require('./connect')
const { ObjectId } = require('mongodb')
const { generateSessionId, hashPassword } = require('../util/auth')

exports.login = async ({ username, password }) => {
  const user = await connection.db.collection('users').findOne({
    username,
    password: hashPassword(password)
  })
  if (user) {
    const sessionId = generateSessionId()
    await connection.db.collection('users').updateOne({ _id: ObjectId(user._id) }, { $set: { sessionId, lastLoginTime: new Date() } })
    return { sessionId, user }
  }
  return {}
}

exports.logout = async userId => {
  const r = await connection.db.collection('users').updateOne({ _id: ObjectId(userId) }, { $unset: { sessionId: 1 } })
  if (r.matchedCount !== 1 || r.modifiedCount !== 1) {
    return false
  }
  return true
}

exports.isLoggedIn = async sessionId => {
  const user = await connection.db.collection('users').findOne({
    sessionId
  })
  return user
}

exports.isUser = async username => {
  const user = await connection.db.collection('users').findOne({
    username
  })
  return user
}

exports.register = async ({ username, password }) => {
  await connection.db.collection('users').insertOne({
    username,
    password: hashPassword(password),
    videos: []
  })
}
 */