const mongodb = require('mongodb')
const config = require('../util/config-loader')


class DbConnection {
  static client = new mongodb.MongoClient(`mongodb://${config.db.username}:${config.db.password}@${config.db.host}:27017/${config.db.name}`, { useNewUrlParser: true })
  static connect = async () => {
    if (!DbConnection.client.isConnected()) {
      await DbConnection.client.connect()
      DbConnection.db = DbConnection.client.db(config.db.name)
    }
    return DbConnection.db
  }
}

module.exports = DbConnection