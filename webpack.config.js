var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

let cssName = 'scrollbar.css';

var plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new ExtractTextPlugin( cssName, {
            allChunks: true,
            disable: false,
    }),
];

if (process.env.NODE_ENV === 'production') {
    // plugins.push(
    //     new webpack.optimize.UglifyJsPlugin({
    //         compressor: {
    //             screw_ie8: true,
    //             warnings: false
    //         }
    //     })
    // );
}

module.exports = {
    externals: {
        react: {
            root: 'React',
            commonjs2: 'react',
            commonjs: 'react',
            amd: 'react'
        }
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap!postcss-loader')
            },
        ]
    },
    entry:['./src/index.js'],
    output: {
        path:__dirname+"/lib/",
        filename:"index.js",
        library: 'ReactScrollbarIE8',
        libraryTarget: 'umd'
    },
    plugins: plugins,
    resolve: {
        extensions: ['', '.js']
    }
};