
module.exports = miliseconds => (req, res, next) => {
  setTimeout(() => {
    next()
  }, miliseconds)
}