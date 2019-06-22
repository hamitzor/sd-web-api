/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */


import "core-js/stable"
import "regenerator-runtime/runtime"
import videoRouter from "./routers/video-router"
import objectDetectionRouter from "./routers/object-detection-router"
import cvFeedbackRouter from "./routers/cv-feedback-router"
import { urlencoded } from "body-parser"
import express from "express"
import config from "./util/config-loader"
//import expressWs from "express-ws"
import globalEe from "./global-ee"
import {
  OBJECT_DETECTION_STATUS_UPDATED,
  OBJECT_DETECTION_PROGRESS_CHANGED
} from "./events"
//expressWs(app)

globalEe.on(OBJECT_DETECTION_STATUS_UPDATED, data => console.log(data))
globalEe.on(OBJECT_DETECTION_PROGRESS_CHANGED, data => console.log(data))

const app = express()

const port = config.web_api.port
const host = config.web_api.host
const backlog = () => console.log(`Web API is online at ${host}:${port}`)

app.use(config.web_api.route.video.sub_route, urlencoded({ extended: true }), videoRouter)
app.use(config.web_api.route.object_detection.sub_route, objectDetectionRouter)
app.use(config.web_api.route.cv_feedback.sub_route, cvFeedbackRouter)

app.listen(port, host, backlog)
