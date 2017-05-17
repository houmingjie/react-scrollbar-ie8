let path = require('path');
let webpack = require('webpack');
let ExtractTextPlugin = require("extract-text-webpack-plugin");
let HtmlWebpackPlugin = require('html-webpack-plugin');

const envMap = {
    local: {
        name: "本地"
    },
    develop: {
        name: "dev"
    },
    staging: {
        name: "预发布"
    },
    production: {
        name: "灰度&线上",
    }
};

let NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : "local";

module.exports.getConfig = function getConfig(env = NODE_ENV) {
    console.info("======================  app打包，环境:  " + envMap[env].name + "  ========================");

    const readyToPub = (env === 'production' || env === 'staging');

    let entry = ['./src/index'];
    let buildPath = "/dist/";
    let fileName = "build.js";
    let cssName = "style.css";

    if (readyToPub) {
        fileName = "build-[hash].js";
        cssName = "style-[hash].css";
    }

    let publishPath = buildPath;//loacl环境
    if (env == "staging" || env == "develop" || env == "whDevelop") {//预发布和develop
        publishPath = "/web/dist/";
    } else if (env == "production") {//线上
        publishPath = "https://msgstatic.douyu.com/dist/";
    }

    //webpack插件
    let plugins = [
        new HtmlWebpackPlugin({
            filename: '../index.html',
            template: 'src/template.html',
            inject: true,
        }),
        new webpack.DefinePlugin({
            _NODE_ENV_: JSON.stringify(env),//必须stringify，否则字符串会被认为是代码片段
        }),
        new ExtractTextPlugin(cssName, {
            allChunks: true,
            disable: false,
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
    ];

    if (env === "production") {
        console.info("开启压缩");
        plugins = plugins.concat([
            //生产环境压缩代码
            new webpack.optimize.UglifyJsPlugin({
                mangle: true,
                compress: {
                    warnings: false
                },
                output:{
                    "quote_keys":true,
                }
            }),
            new webpack.NoErrorsPlugin(),
        ]);
    }


    return {
        entry: entry,
        output: {
            path: __dirname + buildPath,
            filename: fileName,
            publicPath: publishPath,
            chunkFilename: "[id].build.js?[chunkhash]"
        },
        module: {
            loaders: [
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap!postcss-loader")
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loaders: ['babel-loader']
                },
                {
                    test: /\.(jpg|png|gif)$/,
                    loader: "file-loader?name=images/[hash].[ext]",
                },
                //{
                //    test: /\.(jpg|png|gif)$/,
                //    loader: "url-loader?limit=8192&name=images/[hash].[ext]"
                //},
                //{
                //    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                //    loader: "url-loader?limit=10000&minetype=application/font-woff"
                //},
                //{
                //    test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                //    loader: "file-loader"
                //},
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
                path.resolve("./src")
            ],
            modulesDirectories: ["node_modules"],
        },
        plugins: plugins,
        devtool: env === 'production' ? '' : '#source-map',
        progress: true,
        debug: true,
    }
}