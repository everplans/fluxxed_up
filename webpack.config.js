module.exports = {
  entry: {
    app: ['./src/index.js']
  },
  module: {
    loaders: [
      {test: /\.js$/, exclude: [/dist/, /node_modules/], loader: 'babel'}
    ]
  },
  resolve: {
    extensions: ['', '.js']
  }
}
