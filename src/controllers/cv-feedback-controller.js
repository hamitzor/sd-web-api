/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import Controller from "./controller"
import logger from "../util/logger"
import model from "../models/model"
import { ObjectId } from "mongodb"
import config from "../util/config-loader"
import fetch from "cross-fetch"
import formatRoute from "../util/format-route"
import { webAddress, cvAddress } from "../util/address"
import globalEe from "../global-ee"
import {
  CV_STATUS_NOT_STARTED,
  WEB_STATUS_BAD_REQUEST,
  WEB_STATUS_INTERNAL_SERVER_ERROR,
  WEB_STATUS_NOT_FOUND,
  WEB_STATUS_OK
} from "../util/status-codes"
import {
  OBJECT_DETECTION_STATUS_UPDATED,
  OBJECT_DETECTION_PROGRESS_CHANGED
} from "../events"


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
      .updateOne({ _id: ObjectId(videoId) }, { $set: { object_detection_status: status } })
    globalEe.emit(OBJECT_DETECTION_STATUS_UPDATED, { videoId, status })
    this._send(res, WEB_STATUS_OK)
  }

  objectDetectionProgress = async (req, res) => {
    const { videoId, progress } = req.params
    await model.connect()
    await model.db.collection("videos")
      .updateOne({ _id: ObjectId(videoId) }, { $set: { object_detection_progress: progress } })
    globalEe.emit(OBJECT_DETECTION_PROGRESS_CHANGED, { videoId, progress })
    this._send(res, WEB_STATUS_OK)
  }

}

export default (new CvFeedbackController)