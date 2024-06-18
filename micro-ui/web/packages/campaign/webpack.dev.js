const { merge } = require('webpack-merge');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonConfig = require('./webpack.common');
const packageJson = require('./package.json');
const path = require('path'); // Import path module

module.exports = () => {
  
  const devConfig = {
    mode: 'development',
    output: {
      publicPath: 'https://localhost:8005/',
      filename: '[name].[contenthash].js',
    },
    devServer: {
      port: 8005,
      proxy: [
        {
          context: () => true,
          target: 'https://unified-dev.digit.org',
          secure: true,
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
    // resolve: {
    //   alias: {
    //     // Add alias for React components
    //     '@ui-components': path.resolve(__dirname, '../packages/ui-components'),
    //   },
    // },
    resolve: {
      symlinks: true,
    },
    plugins: [
      new ModuleFederationPlugin({
        name: 'campaign',
        filename: 'remoteEntry.js',
        exposes: {
          './CAMPAIGNModule': './src/SingleSpaEntry',
        },
        shared: {
          ...packageJson.dependencies,
          react: { singleton: true }, // React will be shared as a singleton
          'react-dom': { singleton: true }, // ReactDOM will be shared as a singleton
          'react-query': { singleton: true },
        },
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),
    ],
  };

  return merge(commonConfig, devConfig);
};
