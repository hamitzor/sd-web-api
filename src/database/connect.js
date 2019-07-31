const config = require('../../app.config')
const mongoose = require('mongoose')
const { username, password, host, name } = config.db
const url = `mongodb://${username}:${password}@${host}:27017/${name}`
mongoose.connect(url, { useNewUrlParser: true })