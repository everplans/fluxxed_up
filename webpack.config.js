var webpack = require('webpack');

var dedup =
  new webpack.optimize.DedupePlugin();

module.exports = {
  entry: {
    app: ['./src/index.js']
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: [ /node_modules/],
        loader: "jsxhint-loader"
      }
    ],
    loaders: [
      { test: /\.js$/, exclude: [/node_modules/], loader: 'babel' }, //'react-hot',
      { test: /\.scss$/, loader: "style-loader!css-loader!sass-loader"},
      { test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader?paths=node_modules/'},
      { test: /\.less$/, loader: "style-loader!css-loader!less-loader" },
      { test: /\.(svg|png|gif)$/, loader: "url-loader?limit=8192" }
    ]
  },
  jshint: {
    asi: true,
    esnext: true,
    sub: true
  },
  resolve: {
    extensions: ['', '.js']
  },
  plugins: [
   // new AssetPlugin({path: __dirname +'/build'})

    //new webpack.HotModuleReplacementPlugin(),
    //new webpack.NoErrorsPlugin()
  ]
}
