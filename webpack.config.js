const getEnv = () => {
  return process.env.NODE_ENV === 'production' ? 'production' : 'development';
};

console.log(getEnv());

const Path = require('path');

const common = {
  mode: getEnv(),
  optimization: {
    minimize: getEnv() === 'production'
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

const index = Object.assign({
  entry: {
    'index': [
      Path.join(__dirname, 'src', 'Yolog.js')
    ]
  },
  output: {
    filename: 'index.js',
    libraryTarget: 'commonjs'
  }
}, common);

const node = Object.assign({
  entry: {
    'node': [
      Path.join(__dirname, 'src', 'node', 'index.js')
    ]
  },
  target: 'node',
  output: {
    filename: 'node.js',
    libraryTarget: 'commonjs'
  }
}, common);

const web = Object.assign({
  entry: {
    'browser': [
      Path.join(__dirname, 'src', 'web', 'index.js')
    ]
  },
  target: 'web',
  output: {
    filename: 'browser.js',
    libraryTarget: 'umd',
    library: 'Yolog'
  }
}, common);

module.exports = [
  index, web, node
];
