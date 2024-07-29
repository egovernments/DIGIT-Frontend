const path = require('path');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 3001, // Change to 3002 for another remote app
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  output: {
    filename: 'remoteEntry1.js', // Change to remoteEntry2.js for another remote app
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'auto',
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

    new ModuleFederationPlugin({
      name: 'remoteApp1', // Change to 'remoteApp2' for another remote app
      filename: 'remoteEntry1.js', // Change to 'remoteEntry2.js' for another remote app
      exposes: {
        './Component': './src/Component',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
};