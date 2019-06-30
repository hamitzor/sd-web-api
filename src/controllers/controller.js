/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

exports.send = (res, status, payload = {}, _links = {}) => {
  if (!res.headersSent) {
    res.json({ status, payload, _links }).end()
  }
}

exports.Controller = class Controller {
  _send = exports.send
}