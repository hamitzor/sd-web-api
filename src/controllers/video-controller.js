/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import Logger from "../util/logger"
import fetchConfig from "../util/config-fetcher"
import Controller from "./controller"
import codes from "../util/status-codes"
import validator from "validator"
import videoModel from "../models/video-model"
import { spawn } from "child_process"
import videoUploader from "../util/video-uploader"
import multer from "multer"
import eqfStatusCodes from "../util/eqf-status-codes"


class VideoController extends Controller {

  constructor() {
    super()
    this._logger = new Logger(fetchConfig("logging:directory:video"))
  }

  getVideo = async (req, res) => {
    const { videoId } = req.params
    /*Validation*/
    try {
      if (!videoId) { throw new Error("Invalid videoId") }
      if (!validator.isInt(videoId)) { throw new Error("Invalid videoId") }
    } catch (err) {
      this._send(res, codes.BAD_REQUEST, { message: err.message })
      return
    }
    /*Validation*/

    try {
      const video = (await videoModel.fetchById(videoId))[0][0]

      if (video) {
        this._send(res, codes.OK, { video })
      }
      else {
        this._send(res, codes.NOT_FOUND)
      }
    } catch (err) {
      this._send(res, codes.INTERNAL_SERVER_ERROR)
      this._logger.error(err)
    }

  }

  getVideos = async (req, res) => {
    try {
      const videos = (await videoModel.fetchAll())[0]

      this._send(res, codes.OK, { videos })

    } catch (err) {
      this._send(res, codes.INTERNAL_SERVER_ERROR)
      this._logger.error(err)
    }
  }

  deleteVideo = async (req, res) => {
    const { videoId } = req.params
    /*Validation*/
    try {
      if (!videoId) { throw new Error("Invalid videoId") }
      if (!validator.isInt(videoId)) { throw new Error("Invalid videoId") }
    } catch (err) {
      this._send(res, codes.BAD_REQUEST, { message: err.message })
      return
    }
    /*Validation*/

    try {
      const deleteInfo = (await videoModel.deleteById(videoId))[0]

      const affectedRows = deleteInfo.affectedRows

      if (affectedRows === 1) {
        this._send(res, codes.OK)
      }
      else {
        this._send(res, codes.NOT_FOUND)
      }
    } catch (err) {
      this._send(res, codes.INTERNAL_SERVER_ERROR)
      this._logger.error(err)
    }
  }

  postVideo = (req, res) => {
    videoUploader(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        this._logger.error(err)
        this._send(res, codes.BAD_REQUEST)
      } else if (err) {
        this._logger.error(err)
        this._send(res, codes.INTERNAL_SERVER_ERROR)
      }
      else {
        try {
          const videoFile = req.file

          let { title } = req.body

          /*Validation*/
          try {
            if (!videoFile) { throw new Error("Invalid videoFile") }
            if (!title) { throw new Error("Invalid title") }
            if (!title.trim()) { throw new Error("Invalid title") }
          } catch (err) {
            this._send(res, codes.BAD_REQUEST, { message: err.message })
            return
          }
          /*Validation*/

          const thumbnailDirectory = fetchConfig("upload-directory:thumbnail")

          const argsList = ["-m", "packages.main_scripts.extract_meta_data", videoFile.path, thumbnailDirectory]

          const env = { PYTHONPATH: fetchConfig("module-path:helper") }

          const process = spawn("python", argsList, { env })

          process.stdout.on("data", async (data) => {
            try {
              const metaData = JSON.parse(data.toString())

              const video = {
                title: title,
                length: metaData.length,
                extension: videoFile.filename.split(".").pop(),
                name: videoFile.filename,
                size: metaData.size,
                path: videoFile.path,
                fps: metaData.fps,
                frame_count: metaData.frame_count,
                width: metaData.width,
                height: metaData.height,
                thumbnail: `thumbnail/${metaData.thumbnail}`,
                eqf_status: eqfStatusCodes.NOT_STARTED
              }

              const saveInfo = (await videoModel.save(video))[0]

              const insertId = saveInfo.insertId

              if (insertId) {
                this._send(res, codes.OK)
              }
              else {
                this._send(res, codes.NOT_FOUND)
              }
            } catch (err) {
              this._logger.error(err)
              this._send(res, codes.INTERNAL_SERVER_ERROR)
            }
          })
          /*
              Add Anomaly Request on Exit
          */
          process.stderr.on("data", (data) => {
            this._send(res, codes.INTERNAL_SERVER_ERROR)
            this._logger.error(new Error(data.toString()))
          })
        }
        catch (err) {
          this._logger.error(err)
          this._send(res, codes.INTERNAL_SERVER_ERROR)
        }
      }
    })
  }
}

export default (new VideoController)