const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  stats: {
    warnings: false,
    errors: true,
    errorDetails: true
  },

  // ensure "manifest" exists because common injects ['manifest', entryName]
  optimization: {
    runtimeChunk: { name: 'manifest' },
    splitChunks: { chunks: 'all' },
  },

  devServer: {
    historyApiFallback: true,
    static: { directory: path.resolve(__dirname, 'dist') },
    open: true,
    compress: true,
    hot: true,
    port: 8081,
    allowedHosts: 'all',
    client: {
      overlay: {
        warnings: false,
        errors: true
      },
      logging: 'error',
    },
  },

  plugins: [
    // No need for HotModuleReplacementPlugin in Webpack 5 when devServer.hot=true
  ],
});
