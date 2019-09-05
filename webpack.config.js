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
        'image-landscape': './src/entry-image-landscape.js',
        'banner': './src/entry-banner.js',
        'schedule': './src/entry-schedule.js',
        //'schedule-mint': './src/entry-schedule-mint.js',
        //'opendev-schedule': './src/entry-opendev-schedule.js',
        //'opendev-banner': './src/entry-opendev-banner.js',
        'f8-schedule': './src/entry-fnopen-f8-schedule.js',
        'f8-sessions': './src/entry-fnopen-f8-sessions.js',
		'oc6': './src/entry-ocp-2019-ams.js',
		'oc6': './src/entry-oc6.js',
		'oc6': './src/entry-oc6-oculus.js',
		'ocp-ams-image': './src/entry-ocp-ams-image.js',
		'ocp-ams-image-g001': './src/entry-ocp-ams-image-g001.js',
		'ocp-ams-image-g001v2': './src/entry-ocp-ams-image-g001v2.js',
		'ocp-ams-image-g001v2': './src/entry-ocp-ams-image-g002.js',		
		'ocp-ams-image-landscape': './src/entry-ocp-ams-image-landscape.js',
        //'ocp-ams-meeting': './src/entry-ocp-ams-meeting.js',
        //'ocp-ams-content': './src/entry-ocp-ams-content.js',
        //'ocp-ams-signage': './src/entry-ocp-ams-signage.js',
        //'ocp-ams-fnsign': './src/entry-ocp-ams-fnsign.js',
        //'ocp-ams-fnsign-landscape': './src/entry-ocp-ams-fnsign-landscape.js',
        'oc5-oculus-signage': './src/entry-oc5-oculus-signage.js',
        'oc5-oculus-registration': './src/entry-oc5-oculus-registration.js',
        //'my-new-template': './src/entry-my-new-template.js',
		//'ocp-2019-sj-d1-v1': './src/entry-ocp-2019-sj-d1-v1.js',
        //'ocp-2019-breakout-rooms': './src/entry-ocp-2019-breakout-rooms',
        //'ocp-2019-expo-hall-talks': './src/entry-ocp-2019-expo-hall-talks',
        //'test-template': './src/entry-test-template.js',
		
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
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    devServer: {
        disableHostCheck: true,
        historyApiFallback: true,
        noInfo: true,
        https: true
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
    ])
}
