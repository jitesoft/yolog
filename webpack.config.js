const getEnv = () => {
  return process.env.NODE_ENV === 'production' ? 'production' : 'development';
};

const Path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const common = {
  plugins: [
    new CleanWebpackPlugin({})
  ],
  mode: getEnv(),
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

if (getEnv() === 'production') {
  common.optimization.minimize = true;
}

const base = Object.assign({
  entry: {
    'index': [
      Path.join(__dirname, 'src', 'Yolog.js')
    ]
  }
}, common);

const node = Object.assign({
  entry: {
    'index.node': [
      Path.join(__dirname, 'src', 'node', 'index.js')
    ]
  },
  target: 'node',
  output: {
    filename: 'node.js'
  }
}, common);

const web = Object.assign({
  entry: {
    'index.node': [
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
  base, web, node
];
