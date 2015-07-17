var config = require('./configuration');

console.log(config.files.distJS);
module.exports = {
  entry: config.files.srcJS,
  output: {
    filename: config.files.distJS
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }]
  },
  resolve: {
    extensions: ['', '.js']
  }
};
