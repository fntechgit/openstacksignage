const path = require('path')
const webpack = require('webpack')
const dotenv = require('dotenv')

const config = dotenv.config()

if (config.error) {
    throw config.error
}

const env = config.parsed,
    envKeys = Object.keys(env).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(env[next]);
        return prev;
    }, {});

module.exports = {
    entry: {
        'config-admin': './src/config-admin.js',
        'image': './src/entry-image.js',
        'banner': './src/entry-banner.js',
        'schedule': './src/entry-schedule.js',
        'schedule-mint': './src/entry-schedule-mint.js',
        'opendev-schedule': './src/entry-opendev-schedule.js',
        'opendev-banner': './src/entry-opendev-banner.js'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: '[name].build.js',
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                    }
                    // other vue-loader options go here
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map'
}

module.exports.plugins = [
    new webpack.DefinePlugin(envKeys),
]

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "commons",
            filename: "commons.build.js"
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ])
}
