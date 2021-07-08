/**
 * by chuchur /chuchur@qq.com
 * 打包 react 组件
 */
const webpack = require('webpack')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); //for webpack 4
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //for webpack 4
// const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path');
const webpackBaseConfig = require('./webpack.base.conf.js');
const { merge } = require('webpack-merge');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = merge(webpackBaseConfig, {
  mode: 'production',
  entry: {
    main: path.resolve(__dirname, '../components/index.js')
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    publicPath: "",
    filename: "k-ui.js",
    library: 'ReactKui',
    libraryTarget: 'umd',
    umdNamedDefine: true
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
    'classnames': 'classnames',
  },
  performance: {
    hints: false
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'], // : , 
      },
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            warnings: false,
            drop_debugger: true,
            drop_console: true,
            pure_funcs: ["console.log"]
          },
          sourceMap: false
        }
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