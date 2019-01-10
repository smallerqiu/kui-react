/**
 * by chuchur /chuchur@qq.com
 * 打包react 组件
 */
const webpack = require('webpack')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');

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
        historyApiFallback: true,
    },
    entry: {
        index: ['./docs/src/app.jsx'],
        vendors: ['react', 'react-router', 'react-dom']
    },
    output: {
        path: path.resolve(__dirname, 'docs'),
        filename: '[name].[hash:5].js',
        publicPath: '/',
        chunkFilename: '[name].[chunkhash:5].js',
    }, 
    optimization: {
        minimize: false,
    },
    plugins: [
        //热键替换，配合devServer => hot:true
        new webpack.HotModuleReplacementPlugin(),
        // 自动生成html插件，如果创建多个HtmlWebpackPlugin的实例，就会生成多个页面
        new HtmlWebpackPlugin({
            favicon: path.join(__dirname, '../docs/src/assets/favicon.png'),
            // 生成html文件的名字，路径和生产环境下的不同，要与修改后的publickPath相结合，否则开启服务器后页面空白
            filename: 'index.html',
            // 源文件，路径相对于本文件所在的位置
            template: path.resolve(__dirname, '../docs/src/index.html'),
            // 需要引入entry里面的哪几个入口，如果entry里有公共模块，记住一定要引入
            chunks: ['vendors', 'index'],
            // 要把<script>标签插入到页面哪个标签里(body|true|head|false)
            inject: 'body',
            // 生成html文件的标题
            title: 'KUI 使用文档'
            // hash如果为true，将添加hash到所有包含的脚本和css文件，对于解除cache很有用
            // minify用于压缩html文件，其中的removeComments:true用于移除html中的注释，collapseWhitespace:true用于删除空白符与换行符
        }),
        // new ExtractTextPlugin("css/[name].[contenthash].css"),
        // 提取入口文件里面的公共模块
        // 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
        new webpack.optimize.OccurrenceOrderPlugin(),
        // 允许错误不打断程序
        // new webpack.NoErrorsPlugin(),
        // new webpack.LoaderOptionsPlugin({ minimize: true }),
    ]
})