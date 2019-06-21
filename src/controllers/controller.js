/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */


export default class Controller {
  _send = (res, status, payload, _links = {}) => {
    if (!res.headersSent) {
      res.json({ status, payload, _links }).end()
    }
  }
}