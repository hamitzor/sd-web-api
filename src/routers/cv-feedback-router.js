const express = require('express')
const cvFeedbackController = require('../controllers/cv-feedback-controller')
const config = require('../util/config-loader')
const formatRoute = require('../util/format-route')

const cvFeedbackRouter = express.Router()

cvFeedbackRouter.get(formatRoute(config.web_api.route.cv_feedback.object_detection_status,
  { video_id: ':videoId', status: ':status' }), cvFeedbackController.objectDetectionStatus)

cvFeedbackRouter.get(formatRoute(config.web_api.route.cv_feedback.object_detection_progress,
  { video_id: ':videoId', progress: ':progress' }), cvFeedbackController.objectDetectionProgress)

module.exports = cvFeedbackRouter