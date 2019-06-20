/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */


export default class Controller {
  _send = (res, status, data) => {
    if (!res.headersSent) {
      res.json({ status, data }).end()
    }
  }
}