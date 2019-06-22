import express from "express"
import objectDetectionController from "../controllers/object-detection-controller"
import config from "../util/config-loader"
import formatRoute from "../util/format-route"

const objectDetectionRouter = express.Router()

objectDetectionRouter.get(formatRoute(config.web_api.route.object_detection.start,
  { video_id: ":videoId" }), objectDetectionController.start)

objectDetectionRouter.get(formatRoute(config.web_api.route.object_detection.cancel,
  { video_id: ":videoId" }), objectDetectionController.cancel)

export default objectDetectionRouter