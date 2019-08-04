const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSessionSchema = new Schema({
  startTime: {
    type: Date,
    required: true
  },
  expireTime: {
    type: Date,
    required: true
  },
  user: { type: Schema.Types.ObjectId, ref: 'User' }
}, { versionKey: false })

const UserSession = mongoose.model('UserSession', UserSessionSchema)

setInterval(async () => {
  const expiredSessions = await UserSession.find({ expireTime: { $lte: new Date() } }).populate('user')
  for (const session of expiredSessions) {
    if (session.user) {
      session.user.session = undefined
      await session.user.save()
    }
    await session.remove()
  }
}, 1000 * 60)

module.exports = { UserSession }