/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */


require('./util/override-console-methods')
const app = require('./app')
const config = require('../app.config')
const { initDatabase } = require('./database/init-database')

module.exports = async () => {
  await initDatabase()
  app.listen(config.port, () => console.info(`SceneDetector API is online at http://localhost:${config.port}`))
}