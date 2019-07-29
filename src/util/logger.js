const { connection } = require('../database/connect')

const { log: logStatus } = require('../../status-codes')


class Logger {
  constructor() {
    this._collection = 'webLogs'
  }

  _now() {
    return new Date()
  }

  async _log(message, type, stack) {
    connection.db.collection(this._collection).insertOne({ date: this._now(), message, stack, type })
  }

  error(message, stack) {
    this._log(message, logStatus.ERROR, stack)
  }

  info(message) {
    this._log(message, logStatus.INFO)
  }

}

const logger = new Logger()

module.exports = logger