const path = require('path');
const webpack = require('webpack');

const BUILD_DIR = path.resolve('dist');
const APP_DIR = path.resolve('src');

const config = {
  mode: 'production',
  entry: {
    'scroll.to.stick': APP_DIR + '/index.js'
  },
  output: {
    path: BUILD_DIR,
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js?/,
        include: APP_DIR,
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: 'eslint-loader'
          }
        ]
      }
    ]
  },
  optimization: {
    minimize: true,
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all"
        }
      }
    }
  }
};

module.exports = config;