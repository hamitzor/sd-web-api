const { MongoError } = require('mongodb')

const _assertError = (condition, code) => {
  if (condition) {
    throw new MongoError({
      code
    })
  }
}


const assertNoMatch = condition => _assertError(condition, 47)
const assertDuplicate = condition => _assertError(condition, 11000)



module.exports = { assertNoMatch, assertDuplicate }