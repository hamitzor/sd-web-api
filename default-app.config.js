const path = require('path')

module.exports = {
  hostname: 'localhost',
  port: 3000,
  web: {
    hostname: 'localhost',
    port: 3100,
  },
  db: {
    user: '',
    pwd: '',
    host: '',
    name: '',
  },
  testDb: {
    user: '',
    pwd: '',
    host: '',
    name: ''
  },
  auth: {
    cookie: 'SESSION_COOKIE',
    ttl: 1000 * 60 * 2
  },
  storage: {
    root: path.resolve(__dirname, '../uploads'),
    avatars: 'avatars'
  }
}