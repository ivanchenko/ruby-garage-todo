'use strict';

const NODE_ENV = process.env.NODE_ENV || 'dev';
var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
  entry: {
    login: './login',
    main: './main'
  },
  output: {
    path: path.join(__dirname + '/../prod'),
    publicPath: './',
    filename: '[name].js',
    library: '[name]'
  },

  watch: NODE_ENV === 'dev',
  watchOptions: {
    aggregateTimeout: 200
  },

  devtool: NODE_ENV === 'dev' ? 'eval' : null,

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      }, {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('css-loader!')
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=image/svg+xml"
      }, {
        test: /\.(png|jpg)$/,
        loader: 'url?name=[path][name].[ext]&limit=10000'
      }
    ]
  },

  plugins: [
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('[name].css', {allChunks: true}),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    })
  ]
};

if (NODE_ENV === 'prod') {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
        unsafe: true
      }
    })
  )
}