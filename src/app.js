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


app.use(cors({ origin: webAddress, credentials: true }))
app.enable('trust proxy')
app.use(cookieParser())
app.use(resMiddleware())
app.use(bodyParser.json())
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError) {
    res.badRequest("Bad payload")
    return
  }
  next()
})
app.use(rootRouter)

module.exports = app