const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ConfigSetSchema = new Schema({
  name: {
    type: String,
    index: true,
    unique: true,
    required: true,
    trim: true
  },
  fields: {
    type: [
      {
        key: {
          type: String,
          index: true,
          unique: true,
          required: true,
          trim: true
        },
        value: String
      }
    ],
    default: []
  },
}, { collection: 'configSets' })

const ConfigSet = mongoose.model('ConfigSet', ConfigSetSchema)

module.exports = { ConfigSet, ConfigSetSchema }