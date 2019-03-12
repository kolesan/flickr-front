const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const config = require('./config.dev.js');

module.exports = merge(common,{
  plugins: [
    new webpack.DefinePlugin({
      CONFIG: JSON.stringify(config)
    })
  ],
  devServer: {
    contentBase: ['./dist', './src/back-end'],
    watchContentBase: true,
    historyApiFallback: true
  },
  mode: 'development'
});