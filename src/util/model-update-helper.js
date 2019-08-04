module.exports = (doc, update) => {
  Object.keys(update).forEach(key => {
    if (update[key]) {
      doc[key] = update[key]
    }
  })
  return doc
}