import multer from "multer"
import config from "./config-loader"
import crypto from "crypto"


const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    cb(null, config.storage.videos)
  },
  filename: function (_, file, cb) {
    const id = crypto.randomBytes(20).toString('hex')
    cb(null, `${id}_${file.originalname}`)
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

export default videoUploader.single("videoFile")