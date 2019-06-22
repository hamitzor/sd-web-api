const express = require("express")
const objectDetectionWsController = require("../controllers/object-detection-ws-controller")
const config = require("../util/config-loader")
const formatRoute = require("../util/format-route")

const objectDetectionWsRouter = express.Router()

objectDetectionWsRouter.ws(formatRoute(config.web_api.ws_route.object_detection.watch_status,
  { video_id: ":videoId" }), objectDetectionWsController.watchStatus)

objectDetectionWsRouter.ws(formatRoute(config.web_api.ws_route.object_detection.watch_progress,
  { video_id: ":videoId" }), objectDetectionWsController.watchProgress)

module.exports = objectDetectionWsRouter