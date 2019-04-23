/* eslint-disable */
const Path = require('path');

const common = {
  mode: process.env.NODE_ENV !== 'production' ? 'development' : 'production',
  externals: {
    "@jitesoft/sprintf": "@jitesoft/sprintf",
    "@jitesoft/events": "@jitesoft/events"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        loader: 'babel-loader'
      }
    ]
  }
};

const index = Object.assign({}, common, {
  entry: {
    'index': [
      Path.join(__dirname, 'src', 'Yolog.js')
    ]
  },
  output: {
    filename: 'index.js',
    libraryTarget: 'umd',
    library: '@jitesoft/yolog',
    globalObject: 'this',
  }
});

const node = Object.assign({}, {
  entry: {
    'node': [
      Path.join(__dirname, 'src', 'node', 'index.js')
    ]
  },
  target: 'node',
  output: {
    filename: 'node.js',
    libraryTarget: 'umd',
    library: '@jitesoft/yolog',
    globalObject: 'this'
  }
}, common);

const web = Object.assign({}, common, {
  entry: {
    'browser': [
      Path.join(__dirname, 'src', 'web', 'index.js')
    ]
  },
  target: 'web',
  output: {
    filename: 'browser.js',
    libraryTarget: 'umd',
    library: '@jitesoft/yolog'
  }
});

module.exports = [
  index, node, web
];
