const { connection } = require('./connect')
const { ObjectID } = require('mongodb')
const { assertNoMatch, assertDuplicate } = require('./errors')

exports.findOne = async (id, projection) => {
  const doc = await connection.db.collection('configuration').findOne({ _id: ObjectID(id) }, projection)
  assertNoMatch(!doc)
  return doc
}

exports.find = async (query = {}) => await connection.db.collection('configuration').find(query).toArray()

exports.add = async doc => (await connection.db.collection('configuration').insertOne(doc)).ops[0]

exports.update = async (id, update) => {
  const doc = await connection.db.collection('configuration').findOneAndUpdate({ _id: ObjectID(id) }, update, { returnOriginal: false })
  assertNoMatch(!doc.value)
  return doc.value
}

exports.delete = async id => {
  const r = await connection.db.collection('configuration').deleteOne({ _id: ObjectID(id) })
  assertNoMatch(r.deletedCount < 1)
}

exports.findFields = async (configId) => {
  const doc = await exports.findOne(configId)
  assertNoMatch(!doc)
  const fields = doc.fields
  return fields
}

exports.findOneField = async (configId, fieldId) => {
  const doc = await exports.findOne(configId)
  assertNoMatch(!doc)
  const field = (doc.fields.filter(field => field._id.toString() == fieldId))[0]
  assertNoMatch(!field)
  return field
}

exports.createField = async (configId, field) => {
  const doc = await exports.findOne(configId)
  assertNoMatch(!doc)
  const { key, value } = field
  assertDuplicate(doc.fields.map(f => f.key).includes(field.key))
  const createdField = { _id: new ObjectID(), key, value }
  await connection.db.collection('configuration').updateOne({ _id: ObjectID(configId) }, { $push: { fields: createdField } })
  return createdField
}

exports.updateField = async (configId, fieldId, field) => {
  const doc = await exports.findOne(configId)
  assertNoMatch(!doc)
  const { key, value } = field
  assertDuplicate(doc.fields.filter(f => f.key === key && f._id.toString() !== fieldId).length > 0)

  const update = {}

  if (key !== undefined) {
    update['fields.$.key'] = key
  }
  if (value !== undefined) {
    update['fields.$.value'] = value
  }

  const r = await connection.db.collection('configuration')
    .findOneAndUpdate({ $and: [{ _id: ObjectID(configId) }, { 'fields._id': ObjectID(fieldId) }] },
      { $set: update },
      { returnOriginal: false })
  assertNoMatch(!r.value)
  return (r.value.fields.filter(f => f._id.toString() === fieldId))[0]
}

exports.deleteField = async (configId, fieldId) => {
  const r = await connection.db.collection('configuration')
    .findOneAndUpdate({ $and: [{ _id: ObjectID(configId) }, { 'fields._id': ObjectID(fieldId) }] },
      { $pull: { 'fields': { '_id': ObjectID(fieldId) } } },
      { returnOriginal: false })
  assertNoMatch(!r.value)
}