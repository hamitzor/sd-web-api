/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

const { Controller } = require('./controller')
const model = require('../models/model')
const { ObjectId } = require('mongodb')
const globalEe = require('../global-ee')
const config = require('../util/config-loader')


const {
  OBJECT_DETECTION_STATUS_UPDATED,
  OBJECT_DETECTION_PROGRESS_CHANGED
} = require('../events')

const WEB_STATUS = config.codes.web_status

class CvFeedbackController extends Controller {

  objectDetectionStatus = async (req, res) => {
    const { videoId, status } = req.params
    await model.connect()
    await model.db.collection('videos')
      .updateOne({ _id: ObjectId(videoId) }, { $set: { 'object_detection.status': status } })
    globalEe.emit(OBJECT_DETECTION_STATUS_UPDATED, { videoId, status })
    this._send(res, WEB_STATUS.OK)
  }

  objectDetectionProgress = async (req, res) => {
    const { videoId, progress } = req.params
    await model.connect()
    await model.db.collection('videos')
      .updateOne({ _id: ObjectId(videoId) }, { $set: { 'object_detection.progress': progress } })
    globalEe.emit(OBJECT_DETECTION_PROGRESS_CHANGED, { videoId, progress })
    this._send(res, WEB_STATUS.OK)
  }

}

module.exports = (new CvFeedbackController)