const status = require('../../status-codes')
const changeCase = require('change-case')


module.exports = () => (req, res, next) => {
  Object.keys(status.web).forEach(code => {
    res[changeCase.camelCase(code)] = (payload = {}, _links = {}) => {
      if (!res.headersSent) {
        res.json({ status: code, payload, _links }).end()
      }
    }
  })
  next()
}