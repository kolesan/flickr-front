const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const config = require('./config.prod.js');

module.exports = merge(common, {
  plugins: [
    new webpack.DefinePlugin({
      CONFIG: JSON.stringify(config)
    })
  ],
  mode: 'production',
  output: {
    path: path.resolve(__dirname, config.bundleDir)
  }
});