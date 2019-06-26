/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

const Controller = require('./controller')
const config = require('../util/config-loader')
const {
  WEB_STATUS_OK,
  WEB_STATUS_FORBIDDEN
} = require('../util/status-codes')


class VideoController extends Controller {

  public = async (req, res) => {
    this._send(res, WEB_STATUS_OK, {
      ...config,
      mongo: undefined,
      storage: undefined
    })
  }

  private = async (req, res) => {
    if (config.web_api.private_config_client_ips.includes(req.ip)) {
      this._send(res, WEB_STATUS_OK, config)
    }
    else {
      this._send(res, WEB_STATUS_FORBIDDEN, { message: "This action is forbidden." })
    }
  }
}

module.exports = (new VideoController)