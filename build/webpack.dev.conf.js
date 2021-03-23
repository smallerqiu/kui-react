/**
 * by chuchur /chuchur@qq.com
 * 打包 React 组件
 */
const path = require('path');
const webpack = require('webpack')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');

const webpackBaseConfig = require('./webpack.base.conf.js');

module.exports = merge(webpackBaseConfig, {
    mode: 'development',
    devtool: 'none',
    devServer: {
        contentBase: path.resolve(__dirname, 'docs'),
        port: 7002,
        clientLogLevel: 'none',
        hot: true,
        // open: false,
        inline: true,
        compress: true,
        disableHostCheck: true,
        historyApiFallback: true,
    },
    entry: {
        index: ['./docs/main.jsx'],
        vendors: ['react', 'react-router', 'react-dom']
    },
    output: {
        path: path.resolve(__dirname, '../docs/dist'),
        filename: 'js/[name].[hash:5].js',
        publicPath: '/',
        chunkFilename: 'js/[name].[chunkhash:5].js',
    },
    performance: {
        hints: false,
    },
    plugins: [
        new HtmlWebpackPlugin({
            favicon: './docs/assets/favicon.png',
            filename: 'index.html',
            template: './docs/assets/index.html',
            chunks: ['vendors', 'index'],
            inject: true,
        }),
    ]
})