import fs from "fs"
import minimist from "minimist"

const argv = minimist(process.argv.slice(2))


const path = argv["app-config"]

if (!path) {
  console.error("Configuration file path was not specified.")
  process.exit(-1)
}

const content = fs.readFileSync(path)
const config = JSON.parse(content)

export default config