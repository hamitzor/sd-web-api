const fs = require("fs")
const config = require("./config-loader")

const codesPath = config["codes"]["path"]
const content = fs.readFileSync(codesPath)
const codes = JSON.parse(content)

module.exports = codes