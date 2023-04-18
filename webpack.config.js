const path = require('path')
const fs = require('fs');
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

const templatesDir = 'templates';
const templatesMetadataFile = './templates.json';

const defaultEntryPoints = {
    'config-admin': './src/config-admin.js',
    'image': './src/entrypoints/entry-image.js',
    'image-landscape': './src/entrypoints/entry-image-landscape.js',
    //'banner': './src/entrypoints/entry-banner.js',
    'schedule': './src/entrypoints/entry-schedule.js',
};


const templateMetadata = {};
const templateEntryPoints = {};
const templateHTMLEntries = {};

const getHTMLFiles = (dir, files_) => {
    files_ = files_ || [];
    let files = fs.readdirSync(dir);
    for (let i in files) {
        const name = `${dir}/${files[i]}`;
        if (fs.statSync(name).isDirectory()) {
            getHTMLFiles(name, files_);
        } else {
            if (name.toLowerCase().endsWith('.html'))
                files_.push(name);
        }
    }
    return files_;
}

const isNumeric = (value) => {
    return /^-?\d+$/.test(value);
}

getHTMLFiles(templatesDir).forEach(htmlFile => {
    const fileParts = htmlFile.split('/');
    const root = fileParts[0];
    const tenant = fileParts[1];
    if(!isNumeric(fileParts[2])){
        console.log(`skipping tenant ${tenant} summit ${fileParts[2]}...`)
        return;
    }
    const summitId = parseInt(fileParts[2]);
    const file = fileParts[3]
    if (!templateMetadata.hasOwnProperty(tenant)) {
        templateMetadata[tenant] = {};
    }
    if (!templateMetadata[tenant].hasOwnProperty(summitId)) {
        templateMetadata[tenant][summitId] = [];
    }
    const fileEntry = file.toLowerCase().replace(".html", "");

    templateMetadata[tenant][summitId].push({
        'name': fileEntry,
        'file': file,
    });

    // all entrypoints should follow this convention
    if(fs.existsSync(`./src/entrypoints/entry-${fileEntry}.js`)) {
        console.log(`adding template entry point ${fileEntry} ...`);
        templateEntryPoints[fileEntry] = `./src/entrypoints/entry-${fileEntry}`
    }
    templateHTMLEntries[fileEntry] = htmlFile;
});

// write metadata file
fs.writeFileSync(templatesMetadataFile, JSON.stringify(templateMetadata), 'utf8');

const entry = {
    ...defaultEntryPoints,
    ...templateEntryPoints
}

module.exports = {
    entry: entry,
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

const mapHTMLEntry = ([entryName, template]) => {

    let fileName = entryName

    let inject = 'body'
    let chunks = ['manifest', entryName]
    // for entry names that different html name:
    if (entryName == 'schedule') fileName = 'index'
    if (entryName == 'config-admin') {
        inject = 'head'
        fileName = 'admin'
    }

    return new HtmlWebpackPlugin({
        inject: inject,
        hash: true,
        template: Object.keys(defaultEntryPoints).includes(entryName) ? `${fileName}.html` : template,
        filename: `${fileName}.html`,
        chunks: chunks
    })
}


// inject compiled entry chunk HTML from defaultEntries and templates
const entryHtmlPlugins = [
    ...Object.entries(defaultEntryPoints).map(mapHTMLEntry),
    ...Object.entries(templateHTMLEntries).map(mapHTMLEntry)
]

module.exports.plugins = [
    new webpack.DefinePlugin(envKeys),
    new CopyWebpackPlugin([
        { from: 'assets', to: 'assets' },
        // metadata
        { from: templatesMetadataFile, to: templatesMetadataFile}
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
