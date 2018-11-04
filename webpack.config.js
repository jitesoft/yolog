const getEnv = () => {
  return process.env.NODE_ENV === 'production' ? 'production' : 'development';
};

const Path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyPlugin = require('uglifyjs-webpack-plugin');

let plugins = [];
if (getEnv() === 'production') {
  plugins = plugins.concat([
    new CleanWebpackPlugin(Path.join(__dirname, '/dist')),
    new UglifyPlugin()
  ]);
}

module.exports = {
  mode: getEnv(),
  target: 'web',
  entry: {
    'index.web': [
      '@babel/polyfill',
      Path.join(__dirname, 'src', 'index.web.js')
    ],
    'index.node': [
      '@babel/polyfill',
      Path.join(__dirname, 'src', 'index.node.js')
    ]
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'Yolog'
  },
  plugins: plugins,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        include: [Path.join(__dirname, 'src')],
        loader: 'babel-loader'
      }
    ]
  }
};
