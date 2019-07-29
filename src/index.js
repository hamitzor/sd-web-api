/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

require('core-js/stable')
require('regenerator-runtime/runtime')
const express = require('express')
const app = express()
require('express-ws')(app)

const config = require('../app.config')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { webAddress } = require('./util/address')
const rootRouter = require('./routers')
const resMiddleware = require('./express-middlewares/res-middleware')
const bodyParser = require('body-parser')
const { connectDb } = require('./database/connect')

const init = async () => {
  await connectDb()
  app.use(cors({ origin: webAddress, credentials: true }))
  app.enable('trust proxy')
  app.use(cookieParser())
  app.use(bodyParser.json())
  app.use(resMiddleware())
  app.use(rootRouter)
  app.listen(config.port, () => console.log(`SceneDetector API is online at http://localhost:${config.port}`))
}
init()
