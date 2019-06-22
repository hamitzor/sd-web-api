import config from "./config-loader"

const webAddress = "http://" + config.web_api.host + ":" + config.web_api.port
const cvAddress = "http://" + config.cv_api.host + ":" + config.cv_api.port

export { webAddress, cvAddress }