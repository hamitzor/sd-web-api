import fs from "fs"
import config from "./config-loader"

const codesPath = config["codes"]["path"]
const content = fs.readFileSync(codesPath)
const codes = JSON.parse(content)

export default codes