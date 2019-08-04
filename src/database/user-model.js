const { hashPassword } = require('../util/auth')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: String,
    index: true,
    required: true,
    trim: true,
    unique: true
  },
  pwd: {
    type: String,
    required: true,
    minlength: 4,
  },
  role: {
    type: String,
    required: true,
    enum: ['ADMIN', 'USER']
  },
  session: {
    type: Schema.Types.ObjectId,
    ref: 'UserSession'
  }
}, { versionKey: false })

UserSchema.pre('findOne', function (next) {
  const filter = this.getQuery()
  if (filter.pwd) {
    this.setQuery({ ...filter, pwd: hashPassword(filter.pwd) })
  }
  next()
})

UserSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate()
  if (update.pwd) {
    this.setUpdate({ ...update, pwd: hashPassword(update.pwd) })
  }
  next()
})

UserSchema.pre('save', function (next) {
  if (this.isModified('pwd')) {
    this.pwd = hashPassword(this.pwd)
  }
  next()
})

const User = mongoose.model('User', UserSchema)

module.exports = { User }