module.exports = () => (error, req, res, next) => {
  if (error instanceof SyntaxError) {
    res.badRequest("Bad payload")
    return
  }
  next()
}