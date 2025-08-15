module.exports = {
  plugins: [
    require('postcss-preset-env')({
      stage: 3,                 // sensible default
      features: { 'nesting-rules': true } // if you rely on nesting
    }),
    require('autoprefixer')     // redundant (included in preset-env) but harmless
  ]
};
