/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

const WsController = require("./ws-controller")
const logger = require("../util/logger")
const model = require("../models/model")
const { ObjectId } = require("mongodb")
const config = require("../util/config-loader")
const fetch = require("cross-fetch")
const formatRoute = require("../util/format-route")
const { webAddress, cvAddress } = require("../util/address")
const crypto = require("crypto")
const {
  CV_STATUS_NOT_STARTED,
  CV_STATUS_CANCELED,
  CV_STATUS_FAILED,
  WEB_STATUS_BAD_REQUEST,
  WEB_STATUS_INTERNAL_SERVER_ERROR,
  WEB_STATUS_NOT_FOUND,
  WEB_STATUS_FORBIDDEN,
  WEB_STATUS_OK,
  CV_STATUS_STARTED
} = require("../util/status-codes")
const globalEe = require("../global-ee")
const {
  OBJECT_DETECTION_STATUS_UPDATED,
  OBJECT_DETECTION_PROGRESS_CHANGED
} = require("../events")

const isObjectDetectionStatusValid = code => code === CV_STATUS_NOT_STARTED || code === CV_STATUS_CANCELED || code === CV_STATUS_FAILED

class ObjectDetectionWsController extends WsController {

  watchStatus = async (ws, req) => {
    ws.on("message", () => {
      const { videoId } = req.params
      try {
        if (!ObjectId.isValid(videoId)) { throw new Error("Invalid videoId") }
      } catch (err) {
        this._sendAndClose(ws, WEB_STATUS_BAD_REQUEST, { message: err.message })
        return
      }
      try {
        globalEe.on(OBJECT_DETECTION_STATUS_UPDATED, event => {
          if (event.videoId === videoId) {
            this._send(ws, WEB_STATUS_OK, { status: event.status })
          }
        })
      } catch (err) {
        this._sendAndClose(ws, WEB_STATUS_INTERNAL_SERVER_ERROR, { message: err.message })
        logger.logError(err.message, err.stack)
      }
    })
  }

  watchProgress = async (ws, req) => {
    ws.on("message", () => {
      const { videoId } = req.params
      try {
        if (!ObjectId.isValid(videoId)) { throw new Error("Invalid videoId") }
      } catch (err) {
        this._sendAndClose(ws, WEB_STATUS_BAD_REQUEST, { message: err.message })
        return
      }
      try {
        globalEe.on(OBJECT_DETECTION_PROGRESS_CHANGED, event => {
          if (event.videoId === videoId) {
            this._send(ws, WEB_STATUS_OK, { progress: event.progress })
          }
        })
      } catch (err) {
        this._sendAndClose(ws, WEB_STATUS_INTERNAL_SERVER_ERROR, { message: err.message })
        logger.logError(err.message, err.stack)
      }
    })
  }
}

module.exports = (new ObjectDetectionWsController)