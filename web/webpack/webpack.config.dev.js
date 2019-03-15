const path = require('path');
const webpack = require('webpack');
const htmlwebpackplugin = require('html-webpack-plugin');
const extracttextwebpackplugin = require('extract-text-webpack-plugin');
const babelpluginimport = require('babel-plugin-import');

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
            // {
            //     test: /\.(js|jsx)$/,
            //     exclude: /node_modules/,
            //     use: {
            //         loader: 'babel-loader'
            //         // ,  //this connect fail
            //         // options: {
            //         //     presets: ['env', 'react']
            //         // }

            //         // options: {
            //         //     plugins: [['import', {
            //         //         libraryName: 'antd',
            //         //         style: true
            //         //     }]]
            //         // }


            //     }
            // },
            {
                test: /\.(js|jsx)$/,
                // exclude: /node_modules/,
                loader: 'babel-loader',
                // query: {
                //     plugins: [
                //         ['import', [{ libraryName: "antd", style: 'css' }]],
                //     ],
                //     cacheDirectory: true
                // }
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                // use: [
                //     'style-loader',
                //     'css-loader'
                // ],
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
                // ],
                use: extracttextwebpackplugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /.(png|gif|jpg|svg|woff2|woff|eot|ttf)$/,
                use: {
                    loader: 'file-loader'
                }

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
        // new babelpluginimport('*.jsx',{ libraryName: 'antd', style: 'css' })
    ],

    devServer: {
        contentBase: './src',
        port: 13580,
        historyApiFallback: true,
        // compress: false,  //压缩
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
        },
        proxy: {
            '/api/*': {
                target: 'http://localhost:13579',
                //changeOrigin: true,
                pathRewrite: {
                    '^/api/': ''
                }
            }
        }
    }
};

module.exports = config;
