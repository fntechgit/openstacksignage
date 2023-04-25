const path = require('path')
const fs = require('fs');
const webpack = require('webpack')
const dotenv = require('dotenv')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
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
    'banner': './src/entrypoints/entry-banner.js',
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

// post processing
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
        chunks: chunks,
        minify:false,
    })
}

// inject compiled entry chunk HTML from defaultEntries and templates
const entryHtmlPlugins = [
    ...Object.entries(defaultEntryPoints).map(mapHTMLEntry),
    ...Object.entries(templateHTMLEntries).map(mapHTMLEntry)
]

module.exports = {
    entry: entry,
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].build.js',
    },
    module: {
        rules: [
            {test: /\.vue$/, loader: 'vue-loader' },
            {test: /\.js$/, exclude: /node_modules/, use: ['babel-loader']},
            // Styles: Inject CSS into the head with source maps
            {
                test: /\.(scss|css)$/,
                use: [
                    'vue-style-loader',
                    'style-loader',
                    {loader: 'css-loader', options: {sourceMap: true, importLoaders: 1}},
                    {loader: 'postcss-loader', options: {sourceMap: true}},
                    {loader: 'sass-loader', options: {sourceMap: true}},
                ],
            },
            // Images: Copy image files to build folder
            {test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: 'asset/resource'},

            // Fonts and SVGs: Inline files
            {test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, type: 'asset/inline'},
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            assets: path.resolve(__dirname, 'assets/')
        }
    },
    performance: {
        hints: false
    },
    plugins:  [
        // Vue plugin for the magic
        new VueLoaderPlugin(),
        new webpack.DefinePlugin(envKeys),
        new CopyWebpackPlugin({ patterns: [

            { from: 'assets', to: 'assets' },
            // metadata
            { from: templatesMetadataFile, to: templatesMetadataFile}
        ]})
    ].concat(entryHtmlPlugins),
}
