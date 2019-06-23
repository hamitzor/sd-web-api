/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

const Controller = require("./controller")
const logger = require("../util/logger")
const model = require("../models/model")
const { ObjectId } = require("mongodb")
const config = require("../util/config-loader")
const fetch = require("cross-fetch")
const formatRoute = require("../util/format-route")
const { webAddress, cvAddress } = require("../util/address")
const globalEe = require("../global-ee")
const {
  CV_STATUS_NOT_STARTED,
  WEB_STATUS_BAD_REQUEST,
  WEB_STATUS_INTERNAL_SERVER_ERROR,
  WEB_STATUS_NOT_FOUND,
  WEB_STATUS_OK
} = require("../util/status-codes")
const {
  OBJECT_DETECTION_STATUS_UPDATED,
  OBJECT_DETECTION_PROGRESS_CHANGED
} = require("../events")


const videoRouteInfo = config.web_api.route.video

const videoUrl = (name, id) => webAddress + videoRouteInfo.sub_route +
  formatRoute(videoRouteInfo[name], id !== undefined ? { video_id: id } : undefined)

const cvObjectDetectionRouteInfo = config.cv_api.route.object_detection

const cvObjectDetectionUrl = (name, mapping) => cvAddress + cvObjectDetectionRouteInfo.sub_route +
  formatRoute(cvObjectDetectionRouteInfo[name], mapping)


class CvFeedbackController extends Controller {

  objectDetectionStatus = async (req, res) => {
    const { videoId, status } = req.params
    await model.connect()
    await model.db.collection("videos")
      .updateOne({ _id: ObjectId(videoId) }, { $set: { "object_detection.status": status } })
    globalEe.emit(OBJECT_DETECTION_STATUS_UPDATED, { videoId, status })
    this._send(res, WEB_STATUS_OK)
  }

  objectDetectionProgress = async (req, res) => {
    const { videoId, progress } = req.params
    await model.connect()
    await model.db.collection("videos")
      .updateOne({ _id: ObjectId(videoId) }, { $set: { "object_detection.progress": progress } })
    globalEe.emit(OBJECT_DETECTION_PROGRESS_CHANGED, { videoId, progress })
    this._send(res, WEB_STATUS_OK)
  }

}

module.exports = (new CvFeedbackController)