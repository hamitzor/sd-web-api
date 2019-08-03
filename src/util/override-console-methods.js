const symbols = require('log-symbols')
const clc = require("cli-color")

const info = console.log.bind(console)
console.info = (...args) => info(
  clc.blue.bold(symbols.info),
  clc.blue(args.join(' ')))


const error = console.error.bind(console)
console.error = err => error(
  clc.red.bold(symbols.error),
  clc.red((err && err.stack) ? err.stack : err))

console.success = (...args) => console.log(
  clc.green.bold(symbols.success),
  clc.green(args.join(' ')))
