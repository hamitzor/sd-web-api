/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */


module.exports = class Controller {
  _send = (res, status, payload = {}, _links = {}) => {
    if (!res.headersSent) {
      res.json({ status, payload, _links }).end()
    }
  }
}