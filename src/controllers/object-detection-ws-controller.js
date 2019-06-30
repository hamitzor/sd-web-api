/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

const WsController = require('./ws-controller')
const logger = require('../util/logger')
const { ObjectId } = require('mongodb')
const config = require('../util/config-loader')



const globalEe = require('../global-ee')
const {
  OBJECT_DETECTION_STATUS_UPDATED,
  OBJECT_DETECTION_PROGRESS_CHANGED
} = require('../events')

const WEB_STATUS = config.codes.web_status

class ObjectDetectionWsController extends WsController {

  watchStatus = async (ws, req) => {
    ws.on('message', () => {
      const { videoId } = req.params
      try {
        if (!ObjectId.isValid(videoId)) { throw new Error('Invalid videoId') }
      } catch (err) {
        this._sendAndClose(ws, WEB_STATUS.BAD_REQUEST, { message: err.message })
        return
      }
      try {
        globalEe.on(OBJECT_DETECTION_STATUS_UPDATED, event => {
          if (event.videoId === videoId) {
            this._send(ws, WEB_STATUS.OK, { status: event.status })
          }
        })
      } catch (err) {
        this._sendAndClose(ws, WEB_STATUS.INTERNAL_SERVER_ERROR, { message: err.message })
        logger.logError(err.message, err.stack)
      }
    })
  }

  watchProgress = async (ws, req) => {
    ws.on('message', () => {
      const { videoId } = req.params
      try {
        if (!ObjectId.isValid(videoId)) { throw new Error('Invalid videoId') }
      } catch (err) {
        this._sendAndClose(ws, WEB_STATUS.BAD_REQUEST, { message: err.message })
        return
      }
      try {
        globalEe.on(OBJECT_DETECTION_PROGRESS_CHANGED, event => {
          if (event.videoId === videoId) {
            this._send(ws, WEB_STATUS.OK, { progress: event.progress })
          }
        })
      } catch (err) {
        this._sendAndClose(ws, WEB_STATUS.INTERNAL_SERVER_ERROR, { message: err.message })
        logger.logError(err.message, err.stack)
      }
    })
  }
}

module.exports = (new ObjectDetectionWsController)