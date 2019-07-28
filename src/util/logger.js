const connectDb = require('../database/db-connection').connect
const { log: logStatus } = require('../../status-codes')


class Logger {
  constructor() {
    this._collection = 'webLogs'
  }

  _now() {
    return new Date()
  }

  async _log(message, type, stack) {
    const db = await connectDb()
    db.collection(this._collection).insertOne({ date: this._now(), message, stack, type })
  }

  logError(message, stack) {
    this._log(message, logStatus.ERROR, stack)
  }

  logInfo(message) {
    this._log(message, logStatus.INFO)
  }

}

const logger = new Logger()

module.exports = logger