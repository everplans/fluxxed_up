module.exports = {
  entry: {
    app: ['./src/index.js']
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/dist/, /node_modules/],
        use: [
          {loader: 'babel-loader'}
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  }
}
