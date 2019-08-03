const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ConfigSetSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  fields: [{ type: Schema.Types.ObjectId, ref: 'ConfigField' }]
}, { versionKey: false })

const ConfigSet = mongoose.model('ConfigSet', ConfigSetSchema)

module.exports = { ConfigSet }