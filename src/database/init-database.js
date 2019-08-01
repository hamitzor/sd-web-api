const config = require('../../app.config')
const mongoose = require('mongoose')
const { username, password, host, name } = config.db
const url = `mongodb://${username}:${password}@${host}:27017/${name}`


const connectMongo = url => mongoose.connect(url, {
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000
})

module.exports = () => {

  if (process.env.NODE_ENV === 'development') {

    const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer

    const mongod = new MongoMemoryServer()


    return mongod.getConnectionString().then(mockUrl => {

      return connectMongo(mockUrl).then(() => {
        console.log('Development database initialized')
      })
    })
  }
  else {
    return connectMongo(url).then(() => {
      console.log('Production database initialized')
    })
  }
}