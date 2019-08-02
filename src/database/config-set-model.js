const mongoose = require('mongoose')
const Schema = mongoose.Schema


const configSetValidate = {
  validator: async configSetId => await ConfigSet.findById(configSetId) ? true : false,
  message: 'no configuration set found related with given configSetId'
}

const ConfigFieldSchema = new Schema({
  key: {
    type: String,
    index: true,
    required: true,
    trim: true
  },
  value: String,
  configSet: { type: Schema.Types.ObjectId, ref: 'ConfigSet', validate: configSetValidate }
}, { versionKey: false })

ConfigFieldSchema.index({ key: 1, configSet: 1 }, { unique: true })

const ConfigSetSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  fields: [{ type: Schema.Types.ObjectId, ref: 'ConfigField' }]
}, { versionKey: false })

const ConfigSet = mongoose.model('ConfigSet', ConfigSetSchema)
const ConfigField = mongoose.model('ConfigField', ConfigFieldSchema)

module.exports = { ConfigSet, ConfigField }