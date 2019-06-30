/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

const { Controller } = require('./controller')
const videoUploader = require('../util/video-uploader')
const multer = require('multer')
const logger = require('../util/logger')
const model = require('../models/model')
const { ObjectId } = require('mongodb')
const config = require('../util/config-loader')
const fetch = require('cross-fetch')
const assert = require('assert')
const formatRoute = require('../util/format-route')
const { webAddress, cvAddress } = require('../util/address')

const WEB_STATUS = config.codes.web_status
const CV_STATUS = config.codes.cv_status


const videoRouteInfo = config.web_api.route.video

const videoUrl = (name, id) => webAddress + videoRouteInfo.sub_route +
  formatRoute(videoRouteInfo[name], id !== undefined ? { video_id: id } : undefined)

const objectDetectionRouteInfo = config.web_api.route.object_detection

const objectDetectionUrl = (name, id) => webAddress + objectDetectionRouteInfo.sub_route +
  formatRoute(objectDetectionRouteInfo[name], id !== undefined ? { video_id: id } : undefined)

const cvObjectDetectionRouteInfo = config.cv_api.route.object_detection

const cvObjectDetectionUrl = (name, mapping) => cvAddress + cvObjectDetectionRouteInfo.sub_route +
  formatRoute(cvObjectDetectionRouteInfo[name], mapping)


const generateLinks = (id) => {
  return {
    delete: id === undefined ? undefined : videoUrl('delete', id),
    update: id === undefined ? undefined : videoUrl('put', id),
    add: videoUrl('post'),
    videos: videoUrl('get_all')
  }
}

class VideoController extends Controller {

  get = async (req, res) => {
    const { videoId } = req.params

    if (!req.auth.user.videos.map(id => id.toString()).includes(videoId)) {
      this._send(res, WEB_STATUS.FORBIDDEN)
    }

    try {
      if (!ObjectId.isValid(videoId)) { throw new Error('Invalid videoId') }
    } catch (err) {
      this._send(res, WEB_STATUS.BAD_REQUEST, { message: err.message })
      return
    }

    try {
      await model.connect()

      const video = await model.db.collection('videos').findOne({ _id: ObjectId(videoId) }, { projection: { 'object_detection.detections': 0 } })

      if (video) {
        const _links = {
          self: videoUrl('get', videoId),
          'start-object-detection': objectDetectionUrl('start', videoId),
          'cancel-object-detection': objectDetectionUrl('cancel', videoId),
          ...generateLinks(videoId)
        }

        this._send(res, WEB_STATUS.OK, video, _links)
      }
      else {
        this._send(res, WEB_STATUS.NOT_FOUND)
      }
    } catch (err) {
      this._send(res, WEB_STATUS.INTERNAL_SERVER_ERROR)
      logger.logError(err.message, err.stack)
    }
  }

  getAll = async (req, res) => {
    try {

      await model.connect()

      let videos = await model.db.collection('videos').find({ _id: { $in: req.auth.user.videos } }, { projection: { 'object_detection.detections': 0 } }).toArray()
      videos = videos.map(video => ({
        ...video,
        _links: {
          self: videoUrl('get', video._id),
          'start-object-detection': objectDetectionUrl('start', video._id),
          'cancel-object-detection': objectDetectionUrl('cancel', video._id),
          ...generateLinks(video._id)
        }
      }))

      const _links = {
        self: videoUrl('get_all'),
        ...generateLinks()
      }

      this._send(res, WEB_STATUS.OK, videos, _links)

    } catch (err) {
      this._send(res, WEB_STATUS.INTERNAL_SERVER_ERROR)
      logger.logError(err.message, err.stack)
    }
  }

  delete = async (req, res) => {
    const { videoId } = req.params

    if (!req.auth.user.videos.map(id => id.toString()).includes(videoId)) {
      this._send(res, WEB_STATUS.FORBIDDEN)
    }

    try {
      if (!ObjectId.isValid(videoId)) { throw new Error('Invalid videoId') }
    } catch (err) {
      this._send(res, WEB_STATUS.BAD_REQUEST, { message: err.message })
      return
    }

    try {
      await model.connect()

      const deleteInfo = await model.db.collection('videos').deleteOne({ _id: ObjectId(videoId) })

      const deletedCount = deleteInfo.deletedCount

      if (deletedCount === 1) {

        const _links = {
          self: videoUrl('delete', videoId),
          ...generateLinks()
        }

        this._send(res, WEB_STATUS.OK, {}, _links)
      }
      else {
        this._send(res, WEB_STATUS.NOT_FOUND)
      }
    } catch (err) {
      this._send(res, WEB_STATUS.INTERNAL_SERVER_ERROR)
      logger.logError(err.message, err.stack)
    }
  }

  post = (req, res) => {
    videoUploader(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        logger.logError(err.message, err.stack)
        this._send(res, WEB_STATUS.BAD_REQUEST)
      } else if (err) {
        logger.logError(err.message, err.stack)
        this._send(res, WEB_STATUS.INTERNAL_SERVER_ERROR)
      }
      else {
        try {
          const videoFile = req.file

          let { title } = req.body

          try {
            if (!videoFile) { throw new Error('Invalid videoFile') }
            if (!title) { throw new Error('Invalid title') }
            if (!title.trim()) { throw new Error('Invalid title') }
          } catch (err) {
            this._send(res, WEB_STATUS.BAD_REQUEST, { message: err.message })
            return
          }

          const filename = videoFile.filename

          await model.connect()
          const insertInfo = await model.db.collection('videos').insertOne({ filename, date: new Date() })
          const id = insertInfo.insertedId

          const userId = req.auth.user._id

          await model.db.collection('users').updateOne({ _id: ObjectId(userId) }, { $push: { videos: id } })

          const endpoint = cvObjectDetectionUrl('extract_video_metadata', { video_id: id })

          const metadata = await (await fetch(endpoint)).json()

          if (metadata.status !== WEB_STATUS.OK) {
            throw Error('CV module failed during metadata extraction')
          }

          const video = {
            title: title,
            length: metadata.payload.length,
            extension: filename.split('.').pop(),
            name: filename,
            size: metadata.payload.size,
            fps: metadata.payload.fps,
            frame_count: metadata.payload.frame_count,
            width: metadata.payload.width,
            height: metadata.payload.height,
            thumbnail: metadata.payload.thumbnail,
            object_detection: {
              status: CV_STATUS.NOT_STARTED,
              progress: 0,
              detections: []
            }
          }

          const updateInfo = await model.db.collection('videos').updateOne({ _id: ObjectId(id) }, { $set: video })

          assert.equal(1, updateInfo.matchedCount)
          assert.equal(1, updateInfo.modifiedCount)

          const uploadedVideo = await model.db.collection('videos').findOne({ _id: ObjectId(id) }, { projection: { 'object_detection.detections': 0 } })

          const _links = {
            self: videoUrl('get', id),
            'start-object-detection': objectDetectionUrl('start', id),
            'cancel-object-detection': objectDetectionUrl('cancel', id),
            ...generateLinks(id)
          }

          this._send(res, WEB_STATUS.OK, uploadedVideo, _links)

        }
        catch (err) {
          logger.logError(err.message, err.stack)
          this._send(res, WEB_STATUS.INTERNAL_SERVER_ERROR)
        }
      }
    })
  }

  put = (req, res) => {
    (multer().none())(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        logger.logError(err.message, err.stack)
        this._send(res, WEB_STATUS.BAD_REQUEST)
      } else if (err) {
        logger.logError(err.message, err.stack)
        this._send(res, WEB_STATUS.INTERNAL_SERVER_ERROR)
      }
      else {

        const { videoId } = req.params

        if (!req.auth.user.videos.map(id => id.toString()).includes(videoId)) {
          this._send(res, WEB_STATUS.FORBIDDEN)
        }

        let { title } = req.body

        try {
          if (!ObjectId.isValid(videoId)) { throw new Error('Invalid videoId') }
          if (title === '') { throw new Error('Invalid title') }
          if (title !== undefined && !title.trim()) { throw new Error('Invalid title') }
        } catch (err) {
          this._send(res, WEB_STATUS.BAD_REQUEST, { message: err.message })
          return
        }

        try {
          await model.connect()
          const updateInfo = await model.db.collection('videos').updateOne({ _id: ObjectId(videoId) }, { $set: { title } })

          if (updateInfo.matchedCount === 0) {
            this._send(res, WEB_STATUS.BAD_REQUEST, { message: 'Invalid videoId' })
            return
          }

          if (updateInfo.modifiedCount === 0) {
            throw new Error('Video with id ' + videoId + ' could not be updated.')
          }

          const video = await model.db.collection('videos').findOne({ _id: ObjectId(videoId) }, { projection: { 'object_detection.detections': 0 } })

          const _links = {
            self: videoUrl('get', videoId),
            'start-object-detection': objectDetectionUrl('start', videoId),
            'cancel-object-detection': objectDetectionUrl('cancel', videoId),
            ...generateLinks(videoId)
          }

          this._send(res, WEB_STATUS.OK, video, _links)

        } catch (err) {
          this._send(res, WEB_STATUS.INTERNAL_SERVER_ERROR)
          logger.logError(err.message, err.stack)
        }
      }
    })
  }
}

module.exports = (new VideoController)