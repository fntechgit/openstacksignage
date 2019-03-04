var path = require('path')
var webpack = require('webpack')

module.exports = {
    entry: {
        'image': './src/entry-image.js',
        'image-landscape': './src/entry-image-landscape.js',
        'banner': './src/entry-banner.js',
        'schedule': './src/entry-schedule.js',
        'opendev-schedule': './src/entry-opendev-schedule.js',
        'opendev-banner': './src/entry-opendev-banner.js',
        'f8-schedule': './src/entry-fnopen-f8-schedule.js',
        'ocp-ams-meeting': './src/entry-ocp-ams-meeting.js',
        'ocp-ams-content': './src/entry-ocp-ams-content.js',
        'ocp-ams-signage': './src/entry-ocp-ams-signage.js',
        'ocp-ams-fnsign': './src/entry-ocp-ams-fnsign.js',
        'ocp-ams-fnsign-landscape': './src/entry-ocp-ams-fnsign-landscape.js',
        'oc5-oculus-signage': './src/entry-oc5-oculus-signage.js',
        'oc5-oculus-registration': './src/entry-oc5-oculus-registration.js',
        'my-new-template': './src/entry-my-new-template.js',
		'ocp-2019-sj-d1-v1': './src/entry-ocp-2019-sj-d1-v1.js',
        'test-template': './src/entry-test-template.js',
		
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
        historyApiFallback: true,
        noInfo: true
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map'
}

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
