import express from "express"
import videoController from "../controllers/video-controller"
import config from "../util/config-loader"
import formatRoute from "../util/format-route"

const videoRouter = express.Router()


videoRouter.get(config.web_api.route.video.get_all, videoController.getVideos)

videoRouter.get(formatRoute(config.web_api.route.video.get, { video_id: ":videoId" }), videoController.getVideo)

videoRouter.delete(formatRoute(config.web_api.route.video.delete, { video_id: ":videoId" }), videoController.deleteVideo)

videoRouter.post(config.web_api.route.video.post, videoController.postVideo)


export default videoRouter