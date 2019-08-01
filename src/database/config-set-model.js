const mongoose = require('mongoose')
const Schema = mongoose.Schema


const configSetIdValidate = {
  validator: async configSetId => await ConfigSet.findById(configSetId) ? true : false,
  message: 'no configuration set found related with given configSetId'
}

const ConfigFieldSchema = new Schema({
  key: {
    type: String,
    index: true,
    unique: true,
    required: true,
    trim: true
  },
  value: String,
  configSetId: {
    type: String,
    required: true,
    trim: true,
    validate: configSetIdValidate
  }
}, { versionKey: false })

ConfigFieldSchema.index({ key: 1, configSetId: 1 }, { unique: true })

const ConfigSetSchema = new Schema({
  _id: {
    type: String,
    trim: true
  }
}, { versionKey: false })

const ConfigSet = mongoose.model('ConfigSet', ConfigSetSchema)
const ConfigField = mongoose.model('ConfigField', ConfigFieldSchema)

module.exports = { ConfigSet, ConfigField }