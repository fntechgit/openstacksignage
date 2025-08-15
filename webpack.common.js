const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const dotenv = require('dotenv');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProd = process.env.NODE_ENV === 'production';

// Load .env
const config = dotenv.config();
if (config.error) {
  throw config.error;
}
const env = config.parsed || {};
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

// ---- Template discovery ----
const templatesDir = 'templates';
const templatesMetadataFile = './templates.json';

const defaultEntryPoints = {
  image: './src/entrypoints/entry-image.js',
  'image-landscape': './src/entrypoints/entry-image-landscape.js',
  banner: './src/entrypoints/entry-banner.js',
  schedule: './src/entrypoints/entry-schedule.js',
};

const defaultTemplates = [
  { name: 'image', file: 'image.html' },
  { name: 'image-landscape', file: 'image-landscape.html' },
  // { name: 'index', file: 'index.html' },
  // { name: 'banner', file: 'banner.html' },
];

const templateMetadata = {};
const templateEntryPoints = {};
const templateHTMLEntries = {};

const getHTMLFiles = (dir, files_ = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = `${dir}/${file}`;
    if (fs.statSync(full).isDirectory()) {
      getHTMLFiles(full, files_);
    } else if (full.toLowerCase().endsWith('.html')) {
      files_.push(full);
    }
  }
  return files_;
};

const isNumeric = (value) => /^-?\d+$/.test(value);

// post processing
getHTMLFiles(templatesDir).forEach((htmlFile) => {
  const fileParts = htmlFile.split('/');
  const tenant = fileParts[1];

  if (!isNumeric(fileParts[2])) {
    // eslint-disable-next-line no-console
    console.log(`skipping tenant ${tenant} summit ${fileParts[2]}...`);
    return;
  }

  const summitId = parseInt(fileParts[2], 10);
  const file = fileParts[3];

  if (!Object.prototype.hasOwnProperty.call(templateMetadata, tenant)) {
    templateMetadata[tenant] = {};
  }

  if (!Object.prototype.hasOwnProperty.call(templateMetadata[tenant], summitId)) {
    templateMetadata[tenant][summitId] = [...defaultTemplates];
  }

  const fileEntry = file.toLowerCase().replace('.html', '');

  templateMetadata[tenant][summitId].push({
    name: fileEntry,
    file,
  });

  // all entrypoints should follow this convention
  const entryPath = `./src/entrypoints/entry-${fileEntry}.js`;
  if (fs.existsSync(entryPath)) {
    // eslint-disable-next-line no-console
    console.log(`adding template entry point ${fileEntry} ...`);
    templateEntryPoints[fileEntry] = `./src/entrypoints/entry-${fileEntry}`;
  }
  templateHTMLEntries[fileEntry] = htmlFile;
});

// write metadata file
fs.writeFileSync(templatesMetadataFile, JSON.stringify(templateMetadata), 'utf8');

const entry = {
  ...defaultEntryPoints,
  ...templateEntryPoints,
};

const mapHTMLEntry = ([entryName, template]) => {
  let fileName = entryName;
  let inject = 'body';
  const chunks = ['manifest', entryName];

  // for entry names that have different html name:
  if (entryName === 'schedule') fileName = 'index';
  if (entryName === 'config-admin') {
    inject = 'head';
    fileName = 'admin';
  }

  return new HtmlWebpackPlugin({
    inject,
    hash: true,
    template: Object.prototype.hasOwnProperty.call(defaultEntryPoints, entryName)
      ? `${fileName}.html`
      : template,
    filename: `${fileName}.html`,
    chunks,
    minify: false,
  });
};

// inject compiled entry chunk HTML from defaultEntries and templates
const entryHtmlPlugins = [
  ...Object.entries(defaultEntryPoints).map(mapHTMLEntry),
  ...Object.entries(templateHTMLEntries).map(mapHTMLEntry),
];

module.exports = {
  entry,
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].build.js',
    clean: false, // keep as-is; set to true if you want dist cleaned each build
  },
  module: {
    rules: [
      { test: /\.vue$/, loader: 'vue-loader' },
      { test: /\.js$/, exclude: /node_modules/, use: ['babel-loader'] },

      // Styles
      {
        test: /\.(scss|css)$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader',
          {
            loader: 'css-loader',
            options: { sourceMap: !isProd, importLoaders: 2 },
          },
          { loader: 'postcss-loader', options: { sourceMap: !isProd } },
          { loader: 'sass-loader', options: { sourceMap: !isProd } },
        ],
      },

      // Images: Copy image files to build folder
      { test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: 'asset/resource' },

      // Fonts and SVGs: Inline files
      { test: /\.(woff2?|eot|ttf|otf|svg)$/, type: 'asset/inline' },
    ],
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      assets: path.resolve(__dirname, 'assets/'),
    },
    extensions: ['.js', '.vue', '.json'],
  },
  performance: { hints: false },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin(envKeys),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'assets', to: 'assets' },
        { from: templatesMetadataFile, to: templatesMetadataFile },
      ],
    }),
    ...(isProd
      ? [
          new MiniCssExtractPlugin({
            filename: '[name].[contenthash:8].css',
            chunkFilename: '[id].[contenthash:8].css',
          }),
        ]
      : []),
    ...entryHtmlPlugins,
  ],
};
