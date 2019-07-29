const { connection } = require('./connect')


exports.findAll = async () => {
  return await connection.db.collection('configuration').find({}).toArray()
}
exports.add = async ({ name, fields = {} }) => {
  await connection.db.collection('configuration').insertOne({
    name,
    fields
  })
}
exports.update = async ({ name, newName }) => {
  return await connection.db.collection('configuration').updateOne({ name }, { $set: { name: newName } })
}
exports.delete = async ({ name }) => {
  return await connection.db.collection('configuration').deleteOne({ name })
}
exports.saveField = async ({ setName, key, value }) => {
  await connection.db.collection('configuration').updateOne({ name: setName }, { $set: { [`fields.${key}`]: value } })
}
