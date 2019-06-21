/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import Controller from "./controller"
import validator from "validator"
import videoUploader from "../util/video-uploader"
import multer from "multer"
import logger from "../util/logger"
import model from "../models/model"
import codes from "../util/codes-loader"
import { ObjectId } from "mongodb"
import config from "../util/config-loader"
import fetch from "cross-fetch"
import assert from "assert"
import formatRoute from "../util/format-route"


class VideoController extends Controller {

  getVideo = async (req, res) => {
    const { videoId } = req.params

    try {
      if (!videoId) { throw new Error("Invalid videoId") }
      if (!ObjectId.isValid(videoId)) { throw new Error("Invalid videoId") }
    } catch (err) {
      this._send(res, codes.web_api_status.BAD_REQUEST, { message: err.message })
      return
    }

    try {
      await model.connect()
      const video = await model.db.collection("videos").findOne({ _id: ObjectId(videoId) })

      if (video) {
        this._send(res, codes.web_api_status.OK, video)
      }
      else {
        this._send(res, codes.web_api_status.NOT_FOUND)
      }
    } catch (err) {
      this._send(res, codes.web_api_status.INTERNAL_SERVER_ERROR)
      logger.logError(err.message)
    }

  }

  getVideos = async (req, res) => {
    try {
      await model.connect()
      const videos = await model.db.collection("videos").find().toArray()
      this._send(res, codes.web_api_status.OK, videos)

    } catch (err) {
      this._send(res, codes.web_api_status.INTERNAL_SERVER_ERROR)
      logger.logError(err.message)
    }
  }

  deleteVideo = async (req, res) => {
    const { videoId } = req.params
    try {
      if (!videoId) { throw new Error("Invalid videoId") }
      if (!ObjectId.isValid(videoId)) { throw new Error("Invalid videoId") }
    } catch (err) {
      this._send(res, codes.web_api_status.BAD_REQUEST, { message: err.message })
      return
    }

    try {
      await model.connect()

      const deleteInfo = await model.db.collection("videos").deleteOne({ _id: ObjectId(videoId) })

      const deletedCount = deleteInfo.deletedCount

      if (deletedCount === 1) {
        this._send(res, codes.web_api_status.OK)
      }
      else {
        this._send(res, codes.web_api_status.NOT_FOUND)
      }
    } catch (err) {
      this._send(res, codes.web_api_status.INTERNAL_SERVER_ERROR)
      logger.logError(err.message)
    }
  }

  postVideo = (req, res) => {
    videoUploader(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        logger.logError(err.message)
        this._send(res, codes.web_api_status.BAD_REQUEST)
      } else if (err) {
        logger.logError(err.message)
        this._send(res, codes.web_api_status.INTERNAL_SERVER_ERROR)
      }
      else {
        try {
          const videoFile = req.file

          let { title } = req.body

          try {
            if (!videoFile) { throw new Error("Invalid videoFile") }
            if (!title) { throw new Error("Invalid title") }
            if (!title.trim()) { throw new Error("Invalid title") }
          } catch (err) {
            this._send(metadata, codes.web_api_status.BAD_REQUEST, { message: err.message })
            return
          }

          const filename = videoFile.filename

          await model.connect()
          const insertInfo = await model.db.collection("videos").insertOne({ filename, date: new Date() })
          const id = insertInfo.insertedId

          const endpoint = "http://" + config.cv_api.host + ":" + config.cv_api.port + formatRoute(config.cv_api.route.object_detection.command.extract_video_metadata, { video_id: id })

          const metadata = await (await fetch(endpoint)).json()

          if (metadata.status === codes.web_api_status.OK) {
            const video = {
              title: title,
              length: metadata.payload.length,
              extension: filename.split(".").pop(),
              name: filename,
              size: metadata.payload.size,
              fps: metadata.payload.fps,
              frame_count: metadata.payload.frame_count,
              width: metadata.payload.width,
              height: metadata.payload.height,
              thumbnail: metadata.payload.thumbnail,
              object_detection_status: codes.video_process_status.NOT_STARTED,
              object_detection_progress: 0
            }

            const updateInfo = await model.db.collection("videos").updateOne({ _id: ObjectId(id) }, { $set: video })

            assert.equal(1, updateInfo.matchedCount)
            assert.equal(1, updateInfo.modifiedCount)

            this._send(res, codes.web_api_status.OK, { videoId: id }, { self: req.originalUrl })
          }
          else {
            logger.logError(err.message, err.stack)
            this._send(res, codes.web_api_status.INTERNAL_SERVER_ERROR)
          }
        }
        catch (err) {
          logger.logError(err.message, err.stack)
          this._send(res, codes.web_api_status.INTERNAL_SERVER_ERROR)
        }
      }
    })
  }

}

export default (new VideoController)