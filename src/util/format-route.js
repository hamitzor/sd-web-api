const formatRoute = (literal, mapping, delimiters = { left: "<", right: ">" }) => {
  if (mapping === undefined) {
    return literal
  }

  let pieces = literal.split("/")

  pieces.shift()

  const arg_pattern = RegExp("^" + delimiters.left + ".+" + delimiters.right + "$")

  Object.keys(pieces).forEach(key => {
    const piece = pieces[key]
    if (arg_pattern.test(piece)) {
      const arg_name = piece.substring(1, piece.length - 1)
      const val = mapping[arg_name]
      if (val !== undefined) {
        literal = literal.replace(piece, val)
      }
    }
  })

  return literal
}

module.exports = formatRoute