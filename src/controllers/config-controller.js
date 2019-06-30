/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

const { Controller } = require('./controller')
const config = require('../util/config-loader')

const WEB_STATUS = config.codes.web_status


class VideoController extends Controller {

  public = async (req, res) => {
    this._send(res, WEB_STATUS.OK, {
      ...config,
      mongo: undefined,
      storage: undefined
    })
  }

  private = async (req, res) => {
    this._send(res, WEB_STATUS.OK, config)
  }
}

module.exports = (new VideoController)