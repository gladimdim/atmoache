const path = require('path');
const webpack = require("webpack");
module.exports = {
  entry: './src/index.bs.js',
  output: {
    path: path.join(__dirname, "src"),
    filename: 'index.js',
  }
};
