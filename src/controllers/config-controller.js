/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */



const logger = require('../util/logger')
const configModel = require('../database/config-model')
const { MongoError } = require('mongodb')

exports.getAll = async (req, res) => {
  try {
    const sets = await configModel.findAll()
    res.ok(sets)
  }
  catch (err) {
    res.internalServerError()
    logger.error(err.message, err.stack)
  }
}
exports.add = async (req, res) => {
  try {
    const { name } = req.body
    if (typeof name !== 'string' || name.trim() === '') { res.badRequest("name is not string or empty"); return }

    await configModel.add({ name: name.trim() })
    res.ok()
  }
  catch (err) {
    if (err instanceof MongoError && err.code === 11000) {
      res.badRequest("Duplicated name")
    }
    else {
      res.internalServerError()
      logger.error(err.message, err.stack)
    }
  }
}
exports.update = async (req, res) => {
  try {
    const { name, newName } = req.body
    if (typeof name !== 'string' || name.trim() === '') { res.badRequest("name is not string or empty"); return }
    if (typeof newName !== 'string' || newName.trim() === '') { res.badRequest("newName is not string or empty"); return }
    if (name === newName) { res.badRequest("name is equal to newName"); return }
    if ((await configModel.update({ name: name.trim(), newName: newName.trim() })).modifiedCount < 1) { res.notFound(); return }
    res.ok()
  }
  catch (err) {
    if (err instanceof MongoError && err.code === 11000) {
      res.badRequest("Duplicated name")
      return
    }
    res.internalServerError()
    logger.error(err.message, err.stack)
  }
}
exports.delete = async (req, res) => {
  try {
    const { name } = req.params
    if ((await configModel.delete({ name: name.trim() })).deletedCount < 1) { res.notFound(); return }
    res.ok()
  }
  catch (err) {
    res.internalServerError()
    logger.error(err.message, err.stack)
  }
}
exports.addField = async (req, res) => {
  try {
    const { name, key, value } = req.params
    await configModel.addField({ setName: name, key, value })
    res.ok()
  }
  catch (err) {
    res.internalServerError()
    logger.error(err.message, err.stack)
  }
}

//save
//update
//delete
//addField
//updateField
//deleteField