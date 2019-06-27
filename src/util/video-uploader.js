const multer = require('multer')
const config = require('./config-loader')
const crypto = require('crypto')
const mimeTypes = require('mime-types')


const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    cb(null, config.storage.videos)
  },
  filename: function (_, file, cb) {
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
  const regex = /^video/
  if (!regex.test(file.mimetype)) {
    callback(new multer.MulterError())
  }
  else {
    callback(null, true)
  }
}


const videoUploader = multer({
  storage,
  limits,
  fileFilter
})

module.exports = videoUploader.single('videoFile')