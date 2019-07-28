const connectDb = require('./db-connection').connect
const { ObjectId } = require('mongodb')
const { generateSessionId, hashPassword } = require('../util/auth')

exports.login = async ({ username, password }) => {
  const db = await connectDb()
  const user = await db.collection('users').findOne({
    username,
    password: hashPassword(password)
  })
  if (user) {
    const sessionId = generateSessionId()
    await db.collection('users').updateOne({ _id: ObjectId(user._id) }, { $set: { sessionId, lastLoginTime: new Date() } })
    return { sessionId, user }
  }
  return {}
}

exports.logout = async userId => {
  const db = await connectDb()
  const r = await db.collection('users').updateOne({ _id: ObjectId(userId) }, { $unset: { sessionId: 1 } })
  if (r.matchedCount !== 1 || r.modifiedCount !== 1) {
    return false
  }
  return true
}

exports.isLoggedIn = async sessionId => {
  const db = await connectDb()
  const user = await db.collection('users').findOne({
    sessionId
  })
  return user
}

exports.isUser = async username => {
  const db = await connectDb()
  const user = await db.collection('users').findOne({
    username
  })
  return user
}

exports.register = async ({ username, password }) => {
  const db = await connectDb()
  await db.collection('users').insertOne({
    username,
    password: hashPassword(password),
    videos: []
  })
}