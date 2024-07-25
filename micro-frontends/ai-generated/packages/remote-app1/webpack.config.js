const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    port: 3111,
  },
  output: {
    publicPath: 'auto',
    libraryTarget: 'system',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'remote_app1',
      filename: 'remoteEntry.js',
      exposes: {
        './SomeComponent': './src/App',
      },
      shared: { react: { singleton: true }, 'react-dom': { singleton: true }, 'react-query': { singleton: true } },
    }),
  ],
};
