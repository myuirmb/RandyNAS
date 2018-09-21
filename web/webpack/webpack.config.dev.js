const path = require('path');
const webpack = require('webpack');
const htmlwebpackplugin = require('html-webpack-plugin');
const extracttextwebpackplugin = require('extract-text-webpack-plugin');

const srcPath = path.resolve(__dirname, '../src');

const config = {
    //context: srcPath,

    entry: {
        index: '../src/index.js',
        vendor: [
            'react',
            'react-dom'
        ]
    },

    output: {
        //path: '../dist/',
        path:path.resolve(__dirname,'../dist/'),
        publicPath:'/dist/',
        filename: 'js/[name].js'
    },

    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env', 'react']
                    }
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
        extensions: ['', 'js', 'jsx']
    },

    plugins: [
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendor',
        //     filename: 'vendor-[name].js'
        // }),
        new htmlwebpackplugin({
            template: './src/index.html'
        }),
        new extracttextwebpackplugin('index.css')
    ],

    devServer: {
        port: 13580
    }
};

module.exports = config;
