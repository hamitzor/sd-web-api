const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ConfigSet } = require('./config-set-model')
const messages = require('../messages')('config-field-api')

const configSetValidate = {
  validator: async configSetId => await ConfigSet.findById(configSetId) ? true : false,
  message: messages.wrongConfigSetId
}

const ConfigFieldSchema = new Schema({
  key: {
    type: String,
    index: true,
    required: true,
    trim: true
  },
  value: {
    type: String,
    default: ''
  },
  configSet: { type: Schema.Types.ObjectId, ref: 'ConfigSet', validate: configSetValidate }
}, { versionKey: false })

ConfigFieldSchema.index({ key: 1, configSet: 1 }, { unique: true })

const ConfigField = mongoose.model('ConfigField', ConfigFieldSchema)

module.exports = { ConfigField }