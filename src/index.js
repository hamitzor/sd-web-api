/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

require('core-js/stable')
require('regenerator-runtime/runtime')
const express = require('express')
const app = express()
require('express-ws')(app)

const config = require('./util/config-loader')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { webAddress } = require('./util/address')

const rootRouter = require('./routers')

const port = config.port
const backlog = () => console.log(`Web API is online at http://localhost:${port}`)

app.use(cors({ origin: webAddress, credentials: true }))
app.enable('trust proxy')
app.use(cookieParser())
app.use(rootRouter)

app.listen(port, backlog)
