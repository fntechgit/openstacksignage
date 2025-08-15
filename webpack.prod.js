const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',

  optimization: {
    // ensure "manifest" exists because common injects ['manifest', entryName]
    runtimeChunk: { name: 'manifest' },
    splitChunks: { chunks: 'all' },

    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: { inline: false },
        },
      }),
      new CssMinimizerPlugin(),
    ],
  },
});
