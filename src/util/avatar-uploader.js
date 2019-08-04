const multer = require('multer')
const config = require('../../app.config')
const crypto = require('crypto')
const mimeTypes = require('mime-types')
const path = require('path')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(config.storage.root, config.storage.avatars))
  },
  filename: function (req, file, cb) {
    const id = crypto.randomBytes(3).toString('hex')
    const extension = mimeTypes.extension(file.mimetype)
    cb(null, `${id}.${extension}`)
  }
})

const limits = {
  fileSize: 100 * 1024 * 1024,
  files: 1
}

const fileFilter = (req, file, callback) => {
  const regex = /^image/
  if (!regex.test(file.mimetype)) {
    callback(new multer.MulterError())
  }
  else {
    callback(null, true)
  }
}


const avatarUploader = multer({
  storage,
  limits,
  fileFilter
})

module.exports = avatarUploader.single('avatar')