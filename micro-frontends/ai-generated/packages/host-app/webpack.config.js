const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    port: 3000,
    proxy: {
      '/remote-app1': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        pathRewrite: { '^/remote-app1': '' },
      },
      '/remote-app2': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        pathRewrite: { '^/remote-app2': '' },
      },
    },
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new ModuleFederationPlugin({
      name: 'hostApp',
      remotes: {
        remoteApp1: 'remoteApp1@http://localhost:3001/remoteEntry1.js',
        remoteApp2: 'remoteApp2@http://localhost:3002/remoteEntry2.js',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
};