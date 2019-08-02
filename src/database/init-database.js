const config = require('../../app.config')
const mongoose = require('mongoose')

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)


const connectMongo = ({ user, pwd, host, name }) => mongoose.connect(`mongodb://${user}:${pwd}@${host}:27017/${name}`)

exports.clearDatabase = () =>
  mongoose.connection.db.listCollections().toArray().then(list =>
    Promise.all(list.map(col => mongoose.connection.db.dropCollection(col.name))).then(() => {
      process.stdout.write("    ")
      console.info("DB cleared")
    })
  )

exports.initDatabase = () => {

  if (process.env.NODE_ENV === 'test') {
    return connectMongo(config.testDb)
  }
  else {
    return connectMongo(config.db).then(() => {
      console.info('Real database initialized')
    })
  }
}