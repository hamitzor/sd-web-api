const fs = require('fs')
const minimist = require('minimist')

const argv = minimist(process.argv.slice(2))

const path = argv['app-config']

if (!path) {
  console.error('Configuration file path was not specified.')
  process.exit(-1)
}

const content = fs.readFileSync(path)
const config = JSON.parse(content)

module.exports = config