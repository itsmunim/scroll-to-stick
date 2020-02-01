const path = require('path');

const BUILD_DIR = path.resolve('dist');
const APP_DIR = path.resolve('src');

const config = {
  mode: 'production',
  entry: {
    bundle: APP_DIR + '/index.js'
  },
  devtool: 'source-map',
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