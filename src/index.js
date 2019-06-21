/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */


import "core-js/stable"
import "regenerator-runtime/runtime"
import videoRouter from "./routers/video-router"
import { urlencoded } from "body-parser"
import express from "express"
import config from "./util/config-loader"


const app = express()

const port = config.web_api.port
const host = config.web_api.host
const backlog = () => console.log(`Web API is online at ${host}:${port}`)

app.use(config.web_api.route.video.sub_route, urlencoded({ extended: true }), videoRouter)

app.listen(port, host, backlog)
