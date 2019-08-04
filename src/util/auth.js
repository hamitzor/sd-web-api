const crypto = require('crypto')

exports.generateSessionId = () => crypto.randomBytes(12).toString('hex')

exports.hashPassword = password => crypto.createHash('sha256').update(password).digest('hex')