const mongodb = require('mongodb')
const config = require('../util/config-loader')

class Model {

  constructor() {
    const MongoClient = mongodb.MongoClient
    const name = config['mongo']['name']
    const host = config['mongo']['host']
    const user = config['mongo']['user']
    const password = config['mongo']['password']
    const url = `mongodb://${user}:${password}@${host}:27017/${name}`
    this._client = new MongoClient(url, { useNewUrlParser: true })
    this._name = name
  }

  async connect() {
    if (!this._client.isConnected()) {
      await this._client.connect()
      this.db = this._client.db(this._name)
    }
  }

  async close() {
    if (this._client.isConnected()) {
      await this._client.close()
    }
  }

}

const model = new Model()

module.exports = model