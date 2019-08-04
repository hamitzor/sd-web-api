const config = require('../../app.config')

module.exports = () => (req, res, next) => {
  req.getSessionCookie = () => req.cookies[config.auth.cookie]
  next()
}