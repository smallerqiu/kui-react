const webpack = require('webpack')
const path = require('path')
const pkg = require('../package.json');
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //for webpack 4

// const mdRender = require('./md-loader/render')
const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  module: {
    rules: [
      {
        test: /\.js[x]$/, exclude: /node_modules/, loader: 'babel-loader',
        /* query: {
          presets: ['es2015', 'react'],
          // plugins: ['transform-runtime']
        } */
      },

      {
        test: /\.md$/,
        use: [
          { loader: 'babel-loader' },
          { loader: './build/md-loader' },
        ]
      },
      // { test: /\.s(c|a)ss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
      // { test: /\.styl(us)?$/, use: ['style-loader', 'css-loader', 'stylus-loader'] },
      // { test: /\.css$/, use: ['style-loader', 'css-loader',] },
      {
        test: /\.(le|c)ss$/,
        use: [
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          'css-loader',
          // 'postcss-loader',
          'less-loader'
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader',
        query: { limit: 8192, name: 'img/[name].[ext]?[hash:7]', esModule: false }
      },
      // {
      //   test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
      //   loader: 'file-loader',
      //   query: { limit: 10000, name: 'fonts/[name].[ext]?[hash:7]', prefix: 'font' }
      // },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.md', '.json', '.less'],
    alias: {
      '@': path.resolve(__dirname, '../'),
      'react-kui': path.resolve(__dirname, '../components'),
    },
  },
  plugins: [
    new webpack.BannerPlugin(`${pkg.name} v${pkg.version} 
Copyright 2017-present, react-kui.
All rights reserved.
Author: chuchur@qq.com / www.chuchur.com
            `),
    new webpack.ContextReplacementPlugin(
      /moment[\\\/]locale$/,
      /^\.\/(zh-cn)$/
    ),
  ]
}