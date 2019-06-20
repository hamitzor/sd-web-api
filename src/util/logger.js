import model from "../models/model"
import codes from "./codes-loader"


class Logger {
  constructor() {
    this._colName = "web_logs"
  }

  _now() {
    return new Date()
  }

  async _log(message, type) {
    await model.connect()
    model.db.collection(this._colName).insertOne({ date: this._now(), message, type })
  }

  logError(message) {
    this._log(message, codes["log-types"]["ERROR"])
  }

  logInfo(message) {
    this._log(message, codes["log-types"]["INFO"])
  }

}

const logger = new Logger()

export default logger