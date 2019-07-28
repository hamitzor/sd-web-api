const config = require('../../app.config')

const webAddress = 'http://' + '127.0.0.1' + ':' + config.port

module.exports = { webAddress }