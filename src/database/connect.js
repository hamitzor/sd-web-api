const mongodb = require('mongodb')
const config = require('../../app.config')

const client = new mongodb.MongoClient(`mongodb://${config.db.username}:${config.db.password}@${config.db.host}:27017/${config.db.name}`, { useNewUrlParser: true })

let connection = { db: {} }

const connectDb = async () => {
  if (!client.isConnected()) {
    await client.connect()
    connection.db = client.db(config.db.name)
  }
}

module.exports = { connectDb, connection }