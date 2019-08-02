const clc = require("cli-color")

const date = () => clc.whiteBright(`[${new Date().toLocaleTimeString()}]`)

const info = console.log.bind(console)
console.info = (...args) => info(
  clc.whiteBright('[sd-web-api]'),
  date(),
  clc.blue.bold('[INFO]'),
  clc.blue(args.join(' ')))


const error = console.error.bind(console)
console.error = err => error(
  clc.whiteBright('[sd-web-api]'),
  date(),
  clc.red.bold('[ERROR]'),
  clc.red((err && err.stack) ? err.stack : err))

console.success = (...args) => console.log(
  clc.whiteBright('[sd-web-api]'),
  date(),
  clc.green.bold('[SUCCESS]'),
  clc.green(args.join(' ')))
