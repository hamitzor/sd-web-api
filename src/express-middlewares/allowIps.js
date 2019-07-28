const logger = require('../util/logger')
const config = require('../util/config-loader')
const { send } = require('../controllers/controller')

const WEB_STATUS = config.codes.web_status

module.exports = (whitelist = []) => {
  return (req, res, next) => {
    try {
      if (whitelist.includes(req.ip.replace('::ffff:', ''))) {
        next()
        return
      }
      send(res, WEB_STATUS.FORBIDDEN)
    }
    catch (err) {
      logger.logError(err.message, err.stack)
      send(res, WEB_STATUS.INTERNAL_SERVER_ERROR)
    }
  }
}