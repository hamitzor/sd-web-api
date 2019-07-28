/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

const { Controller } = require('./controller')
const { web: webStatus } = require('../../status-codes')


class ErrorController extends Controller {
  notFound = (req, res) => {
    this._send(res, webStatus.BAD_ENDPOINT)
  }
}

module.exports = (new ErrorController)