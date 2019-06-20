/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */


import "core-js/stable"
import "regenerator-runtime/runtime"
import model from "./models/model"
import logger from "./util/logger"


logger.logError("This is a web error.")

process.exit(0)
/**
 *
 *
 * import express from "express"
import config from "./util/config-loader"


const app = express()

const port = config["web-api"]["port"]
const host = config["web-api"]["host"]
const backlog = () => console.log(`Web API is online at ${host}:${port}`)



app.listen(port, host, backlog)
 */

