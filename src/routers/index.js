const express = require('express')
//const { urlencoded } = require('body-parser')
//const allowIps = require('../express-middlewares/allowIps')
//const { authChecker } = require('../express-middlewares/auth')
//
//
//const videoRouter = require('./video-router')
//const objectDetectionRouter = require('./object-detection-router')
//const objectDetectionWsRouter = require('./object-detection-ws-router')
//const cvFeedbackRouter = require('./cv-feedback-router')
//const configRouter = require('./config-router')
const authRouter = require('./auth-router')
const errorRouter = require('./error-router')

const rootRouter = express.Router()

//rootRouter.use(config.web_api.route.config.sub_route, configRouter)
//rootRouter.use(config.web_api.route.video.sub_route, [urlencoded({ extended: true }), authChecker], videoRouter)
//rootRouter.use(config.web_api.route.object_detection.sub_route, authChecker, objectDetectionRouter)
//rootRouter.use(config.web_api.ws_route.object_detection.sub_route, authChecker, objectDetectionWsRouter)
//rootRouter.use(config.web_api.route.cv_feedback.sub_route, allowIps([config.cv_api.hostname]), cvFeedbackRouter)
rootRouter.use('/auth', authRouter)
rootRouter.all('*', errorRouter)

module.exports = rootRouter