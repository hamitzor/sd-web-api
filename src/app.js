/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */


const express = require('express')
const app = express()

require('express-ws')(app)

const cookieParser = require('cookie-parser')
const cors = require('cors')
const { webAddress } = require('./util/address')
const rootRouter = require('./routers')
const resMiddleware = require('./express-middlewares/res-middleware')
const bodyParser = require('body-parser')
const reqMiddleware = require('./express-middlewares/req-middleware')
const payloadChecker = require('./express-middlewares/payload-checker')


app.use(cors({ origin: webAddress, credentials: true }))
app.enable('trust proxy')
app.use(cookieParser())
app.use(reqMiddleware())
app.use(resMiddleware())
app.use(bodyParser.json())
app.use(payloadChecker())
app.use(rootRouter)

module.exports = app