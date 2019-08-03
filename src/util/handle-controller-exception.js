const messages = require('../messages')('config-set-api')

module.exports = (err, res) => {
  switch (err.name) {
    case 'ValidationError':
      res.badRequest(Object.keys(err.errors).map(key => ({ field: key, message: err.errors[key].message })))
      break
    case 'MongoError':
      switch (err.code) {
        case 47:
          res.notFound()
          break
        case 11000:
          res.badRequest(messages.duplicated)
          break
        default:
          res.internalServerError()
      }
      break
    default:
      res.internalServerError(err)
      console.error(err)
    //logger.error(err.message, err.stack)
  }
}
