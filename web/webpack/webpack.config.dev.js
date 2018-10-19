const path = require('path');
const webpack = require('webpack');
const htmlwebpackplugin = require('html-webpack-plugin');
const extracttextwebpackplugin = require('extract-text-webpack-plugin');

const config = {
    devtool: 'source-map',

    entry: {
        index: './src/index.js',
        vendor: [
            'react',
            'react-dom'
        ]
    },

    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '',
        filename: './js/[name].js'
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                    // ,  //this connect fail
                    // options: {
                    //     presets: ['env', 'react']
                    // }
                }
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                // use: [
                //     'style-loader',
                //     'css-loader'
                // ]
                use: extracttextwebpackplugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                // use: [
                //     'style-loader',
                //     'css-loader',
                //     'postcss-loader',
                //     'sass-loader?sourceMap'
                // ]
                use: extracttextwebpackplugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            }
        ]
    },

    resolve: {
        extensions: ['.js', '.jsx']
    },

    plugins: [
        new htmlwebpackplugin({
            template: './src/index.html',
            hash: true
            // ,
            // files: {
            //     css: ['index.css'],
            //     js: ['index.js', 'vendor.js'],
            //     chunks: {
            //         head: {
            //             entry: 'vendor.js',
            //             css: ['index.css']
            //         },
            //         main: {
            //             entry: 'index.js',
            //             css: []
            //         }
            //     }
            // }
        }),
        new extracttextwebpackplugin('./index.css')
    ],

    devServer: {
        contentBase: './src',
        port: 13580,
        historyApiFallback: true,
        // compress: false,
        // inline: true,
        // hot: true,
        // host: '127.0.0.1',
        stats: {
            // assets: true,
            children: false,
            // chunks: false,
            // hash: false,
            // modules: false,
            // publicPath: false,
            // timings: true,
            // version: false,
            // warnings: true,
        }
    }
};

module.exports = config;
