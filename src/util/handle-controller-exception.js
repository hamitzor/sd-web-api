const {
  DUPLICATED,
  EMPTY,
} = require('../../error-codes')

const mongoErrorToApiError = {
  required: EMPTY
}

module.exports = (err, res, collection = null) => {
  switch (err.name) {
    case 'ValidationError':
      res.badRequest(Object.keys(err.errors).reduce((acc, key) => {
        const error = err.errors[key]
        return {
          ...acc,
          [key]: mongoErrorToApiError[error.kind]
        }
      }, {}))
      break
    case 'MongoError':
      switch (err.code) {
        case 47:
          res.notFound()
          break
        case 11000:
          if (collection) {
            collection.getIndexes({ full: true }).then(indexes => {
              res.badRequest({ [Object.keys((indexes.filter(index => index.name === err.errmsg.match(/index: (.+) dup key:/)[1]))[0].key)[0]]: DUPLICATED })
            })
          }
          else {
            res.badRequest(DUPLICATED)
          }
          break
        default:
          res.internalServerError(err)
      }
      break
    default:
      res.internalServerError(err)
      console.error(err)
    //logger.error(err.message, err.stack)
  }
}
