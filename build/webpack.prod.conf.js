/**
 * by chuchur /chuchur@qq.com
 * 打包 react 组件
 */
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //for webpack 4
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); //for webpack 4
const TerserPlugin = require('terser-webpack-plugin');

const path = require('path');
const webpackBaseConfig = require('./webpack.base.conf.js');
const { merge } = require('webpack-merge');
const WebpackBar = require('webpackbar')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = merge(webpackBaseConfig, {
  mode: 'production',
  entry: {
    main: path.resolve(__dirname, '../components/index.jsx')
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    publicPath: "",
    filename: "k-ui.js",
    library: 'ReactKui',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  performance: {
    hints: false
  },
  externals: {
    'react': {
      root: 'React',
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react'
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom'
    },
    'react-router': {
      root: 'ReactRouter',
      commonjs: 'react-router',
      commonjs2: 'react-router',
      amd: 'react-router'
    },
    "kui-icons": "kui-icons",
    'moment': 'moment'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
        terserOptions: {
          output: {
            // comments: /react-kui/i,
          },
          compress: {
            pure_funcs: ["console.log"]
          }
        },
        extractComments: false,
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    new WebpackBar({
      name: '🚙  K UI a vue components',
      color: 'green',
    }),
    new MiniCssExtractPlugin({ filename: 'k-ui.css' }),
    new CleanWebpackPlugin()
  ],

})