const path = require('path');

module.exports = {
  mode: "production",
  entry: './dist/index.js',
  output: {
    filename: 'flowed.js',
    path: path.resolve(__dirname, 'web'),
    library: "Flowed",
  },
  node: {
    fs: 'empty'
  }
};
