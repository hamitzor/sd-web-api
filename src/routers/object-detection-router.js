const express = require('express')
const objectDetectionController = require('../controllers/object-detection-controller')
const config = require('../util/config-loader')
const formatRoute = require('../util/format-route')

const objectDetectionRouter = express.Router()

objectDetectionRouter.get(formatRoute(config.web_api.route.object_detection.start,
  { video_id: ':videoId' }), objectDetectionController.start)

objectDetectionRouter.get(formatRoute(config.web_api.route.object_detection.cancel,
  { video_id: ':videoId' }), objectDetectionController.cancel)

module.exports = objectDetectionRouter