const model = require("../models/model")
const codes = require("./codes-loader")


class Logger {
  constructor() {
    this._colName = "web_logs"
  }

  _now() {
    return new Date()
  }

  async _log(message, type, stack) {
    await model.connect()
    model.db.collection(this._colName).insertOne({ date: this._now(), message, stack, type })
  }

  logError(message, stack) {
    this._log(message, codes.log_type.ERROR, stack)
  }

  logInfo(message) {
    this._log(message, codes.log_type.INFO)
  }

}

const logger = new Logger()

module.exports = logger