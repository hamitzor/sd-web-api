/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

const { Controller } = require('./controller')
const config = require('../util/config-loader')

const WEB_STATUS = config.codes.web_status

class ErrorController extends Controller {
  index = (req, res) => {
    this._send(res, WEB_STATUS.BAD_ENDPOINT)
  }
}

module.exports = (new ErrorController)