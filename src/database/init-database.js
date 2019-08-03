const config = require('../../app.config')
const mongoose = require('mongoose')
const delay = require('delay')

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)


const connectMongo = ({ user, pwd, host, name }) => mongoose.connect(`mongodb://${user}:${pwd}@${host}:27017/${name}`)

exports.clearDatabase = async () => {
  const collections = await mongoose.connection.db.listCollections().toArray()
  for (const collection of collections) {
    await mongoose.connection.db.collection(collection.name).deleteMany()
  }
  console.info('Database cleared')
}

exports.initDatabase = async () => {
  if (process.env.NODE_ENV === 'test') {
    await connectMongo(config.testDb)
    await delay(500)
    console.info('Test database initialized')
  }
  else {
    connectMongo(config.db)
    await delay(500)
    console.info('Real database initialized')
  }
}