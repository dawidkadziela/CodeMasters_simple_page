const path = require("path");
const Html = require('html-webpack-plugin');
const MiniCSS = require('mini-css-extract-plugin');

/*
w package.json mamy 2 skrypty. Jeden odpala webpack-dev-server
a drugi finalne budowanie aplikacji.
webpack-dev-server sluzy do pracy nad strona.
Odpalmy go poleceniem npm run start
Wtedy pracuje sie bezposrednio w katalogu src. Edytuje sie index.html, scss  i js.
Po skonczonej pracy odpalamy npm run build, by przebudowac caly projekt
do katalogu dist.

Roznica miedzy projektem podczas pracy a tym przebudowanym jest taka,
ze projekt koncowy nie ma juz source maps, a css nie sa inline w header strony,
a w oddzielnym pliku. Dodatkowo js sa wtedy spakowane.
*/

module.exports = function(env) {

    const isDev = env.dev ? true : false;
    const isProd = env.prod ? true : false;
    const config = {};

    config.entry = "./src/js/app.js";
    config.output = {
        filename: "js/out.js",
        path: path.resolve(__dirname, "dist")
    };

    config.mode  = isProd ? 'production' : 'development';
    config.devtool = isProd ? false : "source-map";
    //watch: true, //nasluchiwanie zmian

    config.devServer = {
      contentBase: path.join(__dirname, "dist"),
      compress: true,
      port: 9000,
      open : true
    };

    config.module = {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [["env", {
                            targets: {
                                browsers: [
                                    '> 1%', 'last 2 versions'
                                ]
                            }
                        }]]
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    isProd? MiniCSS.loader : 'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                new require('autoprefixer')({
                                    browsers: [
                                        '> 1%', 'last 2 versions'
                                    ]
                                })
                            ]
                        }
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.(jpg|jpeg|gif|png|csv|svg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        publicPath: 'images',
                        outputPath: 'images'
                    }
                }
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        publicPath: 'fonts',
                        outputPath: 'fonts'
                    }
                }
            },
            {
                test: /\.(mp4|ogv|webm)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        publicPath: 'video',
                        outputPath: 'video'
                    }
                }
            },
            {
               test: /\.html$/,
               loader: "raw-loader"
            }
        ]
    };

    config.plugins = [
        new Html({
            filename: 'index.html',
            template: './src/index.html',
        }),
        new MiniCSS({
            filename: 'css/style.min.css'
        })
    ];

    return config;
}