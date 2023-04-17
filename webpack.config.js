const path = require('path')
const fs = require('fs')
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

const templateMetadata = {};

const getHTMLFiles = (dir, fileList = []) => {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
        const filePath = path.join(dir, file);
        const isDirectory = fs.statSync(filePath).isDirectory();

        if (isDirectory) {
            getHTMLFiles(filePath, fileList);
        } else {
            if (path.extname(filePath).toLowerCase() === '.html') {                
                const relativePath = path.relative('templates', filePath);
                fileList.push(relativePath);
            }
        }
    });
    const templateHTMLObject = {};
    fileList.forEach((page) => {
        const key = page.replace(/\.(html|htm)$/, '').split('/').pop();
        templateHTMLObject[key] = page;
    });
    return templateHTMLObject;
};

const templateHTMLEntries = getHTMLFiles('./templates');

const generateTemplateEntryPoints = (templateList) => {

    const defaultEntryPoints = {
        'config-admin': './src/config-admin.js',
        'image-landscape': './src/entrypoints/entry-image-landscape.js',
        'image': './src/entrypoints/entry-image.js',
        'banner': './src/entrypoints/entry-banner.js',
        'schedule': './src/entrypoints/entry-schedule.js',
    };

    const entryPoints = {};

    Object.values(templateList).forEach((templatePath) => {
        const summitIdRegex = /\/(\d+)\//;
        const underscoreRegex = /^(?!_).*\//;
        const entryNameRegex = /\/([\w-]+)\.html$/;
        const summitIdMatch = templatePath.match(summitIdRegex);
        const entryNameMatch = templatePath.match(entryNameRegex);
        const underscoreMatch = templatePath.match(underscoreRegex);
        // if the template is in a folder that's not only digits, do not add it
        if (summitIdMatch && entryNameMatch && underscoreMatch) {
            const entryName = entryNameMatch[1];
            const entryPointPath = `./src/entrypoints/entry-${entryName}`;
            if (fs.existsSync(`${entryPointPath}.js`)) {
                entryPoints[entryName] = entryPointPath;
            }
        }
    });

    return { ...defaultEntryPoints, ...entryPoints };
}

const templateEntryPoints = generateTemplateEntryPoints(templateHTMLEntries);

module.exports = {
    entry: templateEntryPoints,
    output: {
        path: path.resolve(__dirname, './dist'),
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

// inject compiled entry chunk htmls in root dir
const entryHtmlPlugins = Object.keys(templateEntryPoints).map(function(entryName) {
    var fileName = entryName
    var inject = 'body'
    var chunks = ['manifest', entryName]
    // for entry names that different html name:
    if (entryName == 'schedule') fileName = 'index'
    if (entryName == 'config-admin') {
        inject = 'head'
        fileName = 'admin'
    }
    // if it's not default, it should be on html dictionary
    return new HtmlWebpackPlugin({
        inject: inject,
        hash: true,
        template: `${templateHTMLEntries[entryName] ? `templates/${templateHTMLEntries[entryName]}` : `${fileName}.html`}`,
        filename: `${fileName}.html`,
        chunks: chunks
    })
});

module.exports.plugins = [
    new webpack.DefinePlugin(envKeys),
    new CopyWebpackPlugin([
        { from: 'assets', to: 'assets' }
    ])
].concat(entryHtmlPlugins);

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
            names: 'manifest',
            minChunks: 3,
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
