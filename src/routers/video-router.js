const express = require("express")
const videoController = require("../controllers/video-controller")
const config = require("../util/config-loader")
const formatRoute = require("../util/format-route")

const videoRouter = express.Router()

videoRouter.get(config.web_api.route.video.get_all, videoController.getAll)

videoRouter.get(formatRoute(config.web_api.route.video.get, { video_id: ":videoId" }), videoController.get)

videoRouter.delete(formatRoute(config.web_api.route.video.delete, { video_id: ":videoId" }), videoController.delete)

videoRouter.post(config.web_api.route.video.post, videoController.post)

videoRouter.put(formatRoute(config.web_api.route.video.put, { video_id: ":videoId" }), videoController.put)

module.exports = videoRouter