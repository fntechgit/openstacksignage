const path = require('path')
const webpack = require('webpack')
const dotenv = require('dotenv')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const config = dotenv.config()

if (config.error) {
    throw config.error
}

const env = config.parsed,
    envKeys = Object.keys(env).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(env[next]);
        return prev;
    }, {});

const entry = {
    'config-admin': './src/config-admin.js',
    'image': './src/entrypoints/entry-image.js',
    'image-landscape': './src/entrypoints/entry-image-landscape.js',
    //'banner': './src/entrypoints/entry-banner.js',
    'schedule': './src/entrypoints/entry-schedule.js',
    'ocp-2022': './src/entrypoints/entry-ocp-2022',
    'ocp-2022-expo-hall-talks': './src/entrypoints/entry-ocp-2022-expo-hall-talks',
    'ocp-2022-lightning-talks': './src/entrypoints/entry-ocp-2022-lightning-talks',
    /*
    'ocp-2021': './src/entrypoints/entry-ocp-2021',
    'ocp-2021-expo-hall-talks': './src/entrypoints/entry-ocp-2021-expo-hall-talks',
    'ocp-2021-lightning-talks': './src/entrypoints/entry-ocp-2021-lightning-talks',
    'ocp-2021-session-full': './src/entrypoints/entry-ocp-2021-session-full',
    'ocp-2021-open-possibilities': './src/entrypoints/entry-ocp-2021-open-possibilities',
    'infinity-schedule': './src/entrypoints/entry-infinity-schedule.js',
    'infinity-sessions': './src/entrypoints/entry-infinity-sessions.js',
    'if-image-d101': './src/entrypoints/entry-if-image-d101.js',
    'if-image-d102': './src/entrypoints/entry-if-image-d102.js',
    'if-image-g101': './src/entrypoints/entry-if-image-g101.js',
    'if-image-g102': './src/entrypoints/entry-if-image-g102.js',
    'if-image-od01': './src/entrypoints/entry-if-image-od01.js',
    'if-image-od02': './src/entrypoints/entry-if-image-od02.js',
    'if-image-od03': './src/entrypoints/entry-if-image-od03.js',
    'if-image-od04': './src/entrypoints/entry-if-image-od04.js',
    'ocp-2020': './src/entrypoints/entry-ocp-2020',
    'ocp-2020-expo-hall-talks': './src/entrypoints/entry-ocp-2020-expo-hall-talks',
    'ocp-2020-lightning-talks': './src/entrypoints/entry-ocp-2020-lightning-talks',     
    'schedule-mint': './src/entrypoints/entry-schedule-mint.js',
    'ocp-2019-breakout-rooms': './src/entrypoints/entry-ocp-2019-breakout-rooms',
    'ocp-2019-expo-hall-talks': './src/entrypoints/entry-ocp-2019-expo-hall-talks',
    'ocp-2019-ams-exec-tracks-portrait': './src/entrypoints/entry-ocp-2019-ams-exec-tracks-portrait',
    'ocp-2019-ams-exec-tracks-landscape': './src/entrypoints/entry-ocp-2019-ams-exec-tracks-landscape',
    'ocp-ams-meeting': './src/entrypoints/entry-ocp-ams-meeting.js',
    'ocp-ams-content': './src/entrypoints/entry-ocp-ams-content.js',
    'ocp-ams-signage': './src/entrypoints/entry-ocp-ams-signage.js',
    'ocp-ams-fnsign': './src/entrypoints/entry-ocp-ams-fnsign.js',
    'ocp-ams-fnsign-landscape': './src/entrypoints/entry-ocp-ams-fnsign-landscape.js',
    'ocp-ams-image': './src/entrypoints/entry-ocp-ams-image.js',
    'ocp-ams-image-landscape': './src/entrypoints/entry-ocp-ams-image-landscape.js',
    'ocp-ams-image-g001': './src/entrypoints/entry-ocp-ams-image-g001.js',
    'ocp-ams-image-g001v2': './src/entrypoints/entry-ocp-ams-image-g001v2.js',
    'ocp-ams-image-g002': './src/entrypoints/entry-ocp-ams-image-g002.js',  
    'ocp-ams-image-g003': './src/entrypoints/entry-ocp-ams-image-g003.js',      
    'ocp-ams-image-g101': './src/entrypoints/entry-ocp-ams-image-g101.js',      
    'ocp-ams-image-g108': './src/entrypoints/entry-ocp-ams-image-g108.js',
    'ocp-ams-image-g109': './src/entrypoints/entry-ocp-ams-image-g109.js',
    'ocp-ams-image-g110': './src/entrypoints/entry-ocp-ams-image-g110.js',
    'ocp-ams-image-g111': './src/entrypoints/entry-ocp-ams-image-g111.js',
    'oculus-oc5-signage': './src/entrypoints/entry-oculus-oc5-signage.js',
    'oculus-oc5-registration': './src/entrypoints/entry-oculus-oc5-registration.js',
    'oc6-oculus-signage': './src/entrypoints/entry-oc6-oculus-signage.js',
    'oc6-oculus-signage-220b': './src/entrypoints/entry-oc6-oculus-signage-220b.js',
    'oc6-oculus-signage-220c': './src/entrypoints/entry-oc6-oculus-signage-220c.js',
    'oc6-oculus-signage-210f': './src/entrypoints/entry-oc6-oculus-signage-210f.js',
    'oc6-oculus-signage-210h': './src/entrypoints/entry-oc6-oculus-signage-210h.js',
    'oc6-oculus-signage-tt': './src/entrypoints/entry-oc6-oculus-signage-tt.js',
    'oc6-oculus-signage-sp': './src/entrypoints/entry-oc6-oculus-signage-sp.js',
    'oculus-oc6-sessions': './src/entrypoints/entry-oculus-oc6-sessions.js',
    'oculus-oc6-schedule': './src/entrypoints/entry-oculus-oc6-schedule.js',
    'oc6-oculus-image-eod1': './src/entrypoints/entry-oc6-oculus-image-eod1.js',
    'oc6-oculus-image-eod2': './src/entrypoints/entry-oc6-oculus-image-eod2.js',
    'oc6-oculus-image-sessionfull': './src/entrypoints/entry-oc6-oculus-image-sessionfull.js',
    'f8-schedule': './src/entrypoints/entry-f8-schedule.js',
    'f8-sessions': './src/entrypoints/entry-f8-sessions.js',*/
}

module.exports = {
    entry: entry,
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
                exclude: /node_modules/,
            },
            {
              test: /\.(scss)$/,
              use: [{
                loader: 'style-loader', // inject CSS to page
              }, {
                loader: 'css-loader', // translates CSS into CommonJS modules
              }, {
                loader: 'postcss-loader', // Run post css actions
                options: {
                  plugins: function () { // post css plugins, can be exported to postcss.config.js
                    return [
                      require('precss'),
                      require('autoprefixer')
                    ];
                  }
                }
              }, {
                loader: 'sass-loader' // compiles Sass to CSS
              }]
            },
            {
                test: /\.css$/,
                include: /node_modules/,
                loaders: 'css-loader',
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
            'vue$': 'vue/dist/vue.esm.js',
            assets: path.resolve(__dirname, 'assets/')
        }
    },
    devServer: {
        disableHostCheck: true,
        historyApiFallback: true,
        noInfo: true,
        https: true,
        contentBase: './dist',
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map'
}

module.exports.plugins = [
    new webpack.DefinePlugin(envKeys),
    new CopyWebpackPlugin([
        { from: 'assets', to: 'assets' }
    ])
]

if (process.env.NODE_ENV === 'production') {
    // inject compiled entry chunk htmls in root dir
    const entryHtmlPlugins = Object.keys(entry).map(function(entryName) {
        var fileName = entryName
        var inject = 'body'
        var chunks = ['commons', 'manifest', entryName]
        // for entry names that different html name:
        if (entryName == 'schedule') fileName = 'index'
        if (entryName == 'config-admin') {
            inject = 'head'
            fileName = 'admin'
            chunks = ['manifest', entryName]
        }
        return new HtmlWebpackPlugin({
            inject: inject,
            hash: true,
            template: `${fileName}.html`,
            filename: `${fileName}.html`,
            chunks: chunks
        })
    })
    module.exports.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['commons', 'config-admin', 'manifest']
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
    ]).concat(entryHtmlPlugins)
}
