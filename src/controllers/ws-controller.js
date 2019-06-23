/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */
const logger = require('../util/logger')

module.exports = class WsController {
  _send = (ws, status, payload = {}) => {
    ws.send(JSON.stringify({
      status,
      payload
    }), err => {
      if (err) {
        logger.logError(err.message, err.stack)
        ws.close()
      }
    })
  }

  _sendAndClose = (ws, status, payload = {}) => {
    ws.send(JSON.stringify({
      status,
      payload
    }), err => {
      ws.close()
      if (err) {
        logger.logError(err.message, err.stack)
      }
    })
  }
}