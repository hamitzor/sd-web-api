/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

require('core-js/stable')
require('regenerator-runtime/runtime')
require('./util/override-console-methods')
const app = require('./app')
const clc = require("cli-color")
const config = require('../app.config')
const { initDatabase } = require('./database/init-database')

initDatabase().then(() => {
  app.listen(config.port, () => console.info(`SceneDetector API is online at ${clc.underline(`http://localhost:${config.port}`)}`))
})