import express from "express"
import cvFeedbackController from "../controllers/cv-feedback-controller"
import config from "../util/config-loader"
import formatRoute from "../util/format-route"

const cvFeedbackRouter = express.Router()

cvFeedbackRouter.get(formatRoute(config.web_api.route.cv_feedback.object_detection_status,
  { video_id: ":videoId", status: ":status" }), cvFeedbackController.objectDetectionStatus)

cvFeedbackRouter.get(formatRoute(config.web_api.route.cv_feedback.object_detection_progress,
  { video_id: ":videoId", progress: ":progress" }), cvFeedbackController.objectDetectionProgress)

export default cvFeedbackRouter