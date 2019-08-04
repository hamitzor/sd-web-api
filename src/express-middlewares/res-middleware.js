const status = require('../../status-codes')
const changeCase = require('change-case')
const config = require('../../app.config')

module.exports = () => (req, res, next) => {
  Object.keys(status.web).forEach(code => {
    res[changeCase.camelCase(code)] = (payload = {}) => {
      if (!res.headersSent) {
        res.json({ status: code, payload }).end()
      }
    }
  })
  res.clearSessionCookie = () => res.clearCookie(config.auth.cookie)
  res.setSessionCookie = id => res.cookie(config.auth.cookie, id, { maxAge: config.auth.ttl, httpOnly: true, domain: '.localhost' })
  next()
}