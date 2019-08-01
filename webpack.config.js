const path = require('path')


const coreConfig = {
  context: path.resolve(__dirname, 'src'),
  entry: './index',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'bundle.index.js'
  },
  target: 'node',
  node: {
    __dirname: false
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  },
  stats: {
    warnings: false,
  }
}

module.exports = [coreConfig]