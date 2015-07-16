var config = require('./configuration');

module.exports = {
  entry: config.files.srcJS,
  output: {
    filename: config.files.distJS
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/
    }]
  },
  resolve: {
    extensions: ['', '.js']
  }
};
