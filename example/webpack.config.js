let path = require('path');
let webpack = require('webpack');
let ExtractTextPlugin = require("extract-text-webpack-plugin");
let HtmlWebpackPlugin = require('html-webpack-plugin');

function getConfig() {
    const entry = ['./index'];
    const buildPath = '/dist/';
    const fileName = 'build.js';
    const cssName = 'style.css';

    const plugins = [
        new HtmlWebpackPlugin({
            filename: '../index.html',
            template: './template.html',
            inject: true,
        }),
        new ExtractTextPlugin(cssName, {
            allChunks: true,
            disable: false,
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
    ];

    return {
        entry,
        output: {
            path: path.join(__dirname, buildPath),
            filename: fileName,
            publicPath: buildPath,
            chunkFilename: '[id].build.js?[chunkhash]'
        },
        module: {
            loaders: [
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap!postcss-loader')
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loaders: ['babel-loader'],
                },
                {
                    test: /\.(jpg|png|gif)$/,
                    loader: 'file-loader?name=images/[hash].[ext]',
                },
            ],
             postLoaders: [
                 {
                     test: /\.js$/,
                     loaders: ['es3ify-loader']
                 }
             ]
        },
        resolve: {
            extension: ['', '.js'],
            root: [
                path.resolve("./src"),
                path.resolve("../src")
            ],
            modulesDirectories: ["node_modules"],
        },
        plugins,
        devtool: '#source-map',
        progress: true,
        debug: true,
    };
}


module.exports = getConfig();
