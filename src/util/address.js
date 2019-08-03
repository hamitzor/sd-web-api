const config = require('../../app.config')
const rootAddress = `${config.port === 443 ? 'https' : 'http'}://${config.hostname}:${config.port}`
const webAddress = `${config.web.port === 443 ? 'https' : 'http'}://${config.web.hostname}:${config.web.port}`
module.exports = { webAddress, rootAddress }
