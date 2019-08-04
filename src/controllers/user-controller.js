/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */
const { ObjectId } = require('mongoose').mongo
const { User } = require('../database/user-model')
const messages = require('../messages')('config-set-api')
const { addUserLinks, createAvatarLink } = require('../util/links-creators')
const handleException = require('../util/handle-controller-exception')
const avatarUploader = require('../util/avatar-uploader')
const MulterError = require('multer').MulterError
const fs = require('fs')
const path = require('path')
const config = require('../../app.config')


exports.getAll = async (_, res) => {
  try {
    res.ok((await User.find().populate('session')).map(doc => addUserLinks({ ...doc.toObject(), pwd: undefined })))
  }
  catch (err) {
    handleException(err, res)
  }
}
exports.get = async (req, res) => {
  try {
    const { id } = req.params
    if (!ObjectId.isValid(id)) { res.badRequest(messages.idNotValid); return }
    const doc = await User.findById(id).populate('session')
    res.ok(doc ? addUserLinks({ ...doc.toObject(), pwd: undefined }) : doc)
  }
  catch (err) {
    handleException(err, res)
  }
}
exports.create = (req, res) => {
  avatarUploader(req, res, async (err) => {
    if (err instanceof MulterError) {
      res.badRequest(err)
    } else if (err) {
      handleException(err)
    }
    else {
      try {
        const avatar = req.file
        const { name, user, pwd } = req.body
        res.ok(addUserLinks({ ...(await new User({ name, user, pwd, avatar: avatar ? createAvatarLink(avatar.filename) : undefined, role: 'USER' }).save()).toObject(), pwd: undefined }))
      }
      catch (err) {
        handleException(err, res)
      }
    }
  })
}
exports.update = async (req, res) => {
  avatarUploader(req, res, async (err) => {
    if (err instanceof MulterError) {
      res.badRequest(err)
    } else if (err) {
      handleException(err)
    }
    else {
      try {
        const { id } = req.params
        if (!ObjectId.isValid(id)) { res.badRequest(messages.idNotValid); return }
        const avatar = req.file
        const { name, pwd } = req.body
        const doc = await User.findByIdAndUpdate(id, { [name ? 'name' : '']: name, [pwd ? 'pwd' : '']: pwd, [avatar ? 'avatar' : '']: avatar ? createAvatarLink(avatar.filename) : undefined }, { new: true, runValidators: true }).populate('session')
        res.ok(doc ? addUserLinks({ ...doc.toObject(), pwd: undefined }) : doc)
      }
      catch (err) {
        handleException(err, res)
      }
    }
  })
}
exports.delete = async (req, res) => {
  try {
    const { id } = req.params
    if (!ObjectId.isValid(id)) { res.badRequest(messages.idNotValid); return }
    const doc = await User.findByIdAndDelete(id)
    res.ok(doc ? id : null)
    if (doc.avatar) {
      const filename = doc.avatar.split('/').pop()
      fs.unlinkSync(path.resolve(config.storage.root, config.storage.avatars, filename))
    }
  }
  catch (err) {
    handleException(err, res)
  }
}
exports.deleteAvatar = async (req, res) => {
  try {
    const { id } = req.params
    if (!ObjectId.isValid(id)) { res.badRequest(messages.idNotValid); return }
    const doc = await User.findByIdAndUpdate(id, { avatar: undefined }, { runValidators: true })
    res.ok()
    if (doc.avatar) {
      const filename = doc.avatar.split('/').pop()
      fs.unlinkSync(path.resolve(config.storage.root, config.storage.avatars, filename))
    }
  }
  catch (err) {
    handleException(err, res)
  }
}
exports.changeRole = async (req, res) => {
  try {
    const { id } = req.params
    if (!ObjectId.isValid(id)) { res.badRequest(messages.idNotValid); return }
    const { role } = req.body
    const doc = await User.findByIdAndUpdate(id, { role }, { new: true, runValidators: true }).populate('session')
    res.ok(doc ? addUserLinks({ ...doc.toObject(), pwd: undefined }) : doc)
  }
  catch (err) {
    handleException(err, res)
  }
}