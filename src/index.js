/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

require('core-js/stable')
require('regenerator-runtime/runtime')
const express = require('express')
const app = express()
require('express-ws')(app)

const videoRouter = require('./routers/video-router')
const objectDetectionRouter = require('./routers/object-detection-router')
const objectDetectionWsRouter = require('./routers/object-detection-ws-router')
const cvFeedbackRouter = require('./routers/cv-feedback-router')
const { urlencoded } = require('body-parser')
const config = require('./util/config-loader')
const globalEe = require('./global-ee')

const {
  OBJECT_DETECTION_STATUS_UPDATED,
  OBJECT_DETECTION_PROGRESS_CHANGED
} = require('./events')

globalEe.on(OBJECT_DETECTION_STATUS_UPDATED, data => console.log(data))
globalEe.on(OBJECT_DETECTION_PROGRESS_CHANGED, data => console.log(data))


const port = config.web_api.port
const host = config.web_api.host
const backlog = () => console.log(`Web API is online at ${host}:${port}`)

app.use(config.web_api.route.video.sub_route, urlencoded({ extended: true }), videoRouter)
app.use(config.web_api.route.object_detection.sub_route, objectDetectionRouter)
app.use(config.web_api.ws_route.object_detection.sub_route, objectDetectionWsRouter)
app.use(config.web_api.route.cv_feedback.sub_route, cvFeedbackRouter)

app.listen(port, host, backlog)
