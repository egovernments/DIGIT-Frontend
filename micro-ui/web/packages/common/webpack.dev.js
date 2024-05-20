const { merge } = require('webpack-merge');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonConfig = require('./webpack.common');
const packageJson = require('./package.json');

module.exports = () => {
  const devConfig = {
    mode: 'development',
    output: {
      publicPath: 'https://localhost:8090/',
      filename: '[name].[contenthash].js',
    },
    devServer: {
      port: 8090,
      proxy: [
        {
          context: () => true,
          target: 'https://staging.digit.org',
          // target:  'https://staging.digit.org',
          secure: false,
          changeOrigin: true,
          bypass: function (req, res, proxyOptions) {
            if (req.headers.accept.indexOf('html') !== -1) {
              console.log('Skipping proxy for browser request.');
              return '/index.html';
            }
          },
          headers: {
            Connection: 'keep-alive',
          },
        },
      ],
      historyApiFallback: {
        index: '/',
      },
      server: 'https', //Enable HTTPS
    },
    plugins: [
      new ModuleFederationPlugin({
        name: 'common',
        filename: 'remoteEntry.js',
        exposes: {
          './CommonModule': './src/SingleSpaEntry',
        },
        shared: {
          ...packageJson.dependencies
        },
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),
    ],
  };

  return merge(commonConfig, devConfig);
};
