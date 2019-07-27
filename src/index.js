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
const configRouter = require('./routers/config-router')
const authRouter = require('./routers/auth-router')
const errorController = require('./controllers/error-controller')
const { urlencoded } = require('body-parser')
const config = require('./util/config-loader')
const globalEe = require('./event-emmiters/global-ee')
const cookieParser = require('cookie-parser')
const { authChecker } = require('./express-middlewares/auth')
const allowIps = require('./express-middlewares/allowIps')
const cors = require('cors')
const { webAddress } = require('./util/address')



const {
  OBJECT_DETECTION_STATUS_UPDATED,
  OBJECT_DETECTION_PROGRESS_CHANGED
} = require('./event-emmiters/events')

globalEe.on(OBJECT_DETECTION_STATUS_UPDATED, data => console.log(data))
globalEe.on(OBJECT_DETECTION_PROGRESS_CHANGED, data => console.log(data))


const port = config.web_api.port
const host = config.web_api.hostname
const backlog = () => console.log(`Web API is online at ${host}:${port}`)


app.use(cors({ origin: webAddress, credentials: true }))
app.enable('trust proxy')
app.use(cookieParser())
app.use(config.web_api.route.config.sub_route, configRouter)
app.use(config.web_api.route.video.sub_route, [urlencoded({ extended: true }), authChecker], videoRouter)
app.use(config.web_api.route.object_detection.sub_route, authChecker, objectDetectionRouter)
app.use(config.web_api.ws_route.object_detection.sub_route, authChecker, objectDetectionWsRouter)
app.use(config.web_api.route.cv_feedback.sub_route, allowIps([config.cv_api.hostname]), cvFeedbackRouter)
app.use(config.web_api.route.auth.sub_route, authRouter)
app.all('*', errorController.index)

app.listen(port, host, backlog)
