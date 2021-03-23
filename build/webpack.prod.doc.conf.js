/**
 * by chuchur /chuchur@qq.com
 * 打包react 组件
 */
const webpack = require('webpack')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //for webpack 4
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); //for webpack 4
const path = require('path');
const pkg = require('../package.json');
const webpackBaseConfig = require('./webpack.base.conf.js');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(webpackBaseConfig, {
  mode: 'production',
  entry: {
    index: ["@babel/polyfill", './docs/src/app.jsx'],
    // index: path.resolve(__dirname, '../docs/main.js'),
    // vendors: ['react', 'react-dom', 'react-router-dom',]
  },
  output: {
    path: path.resolve(__dirname, '../docs/dist'),
    filename: 'js/[name].[hash:5].js',
    publicPath: './dist/',
    chunkFilename: 'js/[name].[chunkhash:5].js',
  },
  performance: {
    hints: false
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: `chunk-vendors`,
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial',
        },
        common: {
          name: `chunk-common`,
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true,
        },
      },
    },
    minimize: true,
    minimizer: [
      //   new UglifyJsPlugin({
      //     uglifyOptions: {
      //       compress: {
      //         warnings: false,
      //         // drop_debugger: true,
      //         // drop_console: true
      //       },
      //       sourceMap: false
      //     }
      //   })
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    new WebpackBar({
      name: '🚙  K UI a vue components',
      color: 'green',
    }),
    new MiniCssExtractPlugin({ filename: "css/[name].[contenthash:5].css" }),
    new HtmlWebpackPlugin({
      favicon: './docs/assets/favicon.png',
      filename: 'index.html',
      template: './docs/assets/index.html',
      chunks: ['vendors', 'index'],
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        minifyJS: true,
        minifyCSS: true
      },
    }),
    new CleanWebpackPlugin()
  ],

})