const config = require('./config-loader')

const webAddress = 'http://' + config.web_api.hostname + ':' + config.web_api.port
const cvAddress = 'http://' + config.cv_api.hostname + ':' + config.cv_api.port

module.exports = { webAddress, cvAddress }