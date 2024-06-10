const { merge } = require('webpack-merge');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonConfig = require('./webpack.common');
const packageJson = require('./package.json');

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
    plugins: [
      new ModuleFederationPlugin({
        name: 'campaign',
        filename: 'remoteEntry.js',
        exposes: {
          './CAMPAIGNModule': './src/SingleSpaEntry',
        },
        shared: {
            react: { singleton: true }, // React will be shared as a singleton
            'react-dom': { singleton: true }, // ReactDOM will be shared as a singleton,
            'react-query': { singleton: true },
            'single-spa-react': '^4.6.1',
            'react-router-dom': '5.3.0',
            '@digit-ui/digit-ui-libraries-mfe': '1.0.17',
            '@digit-ui/digit-ui-react-components': '1.0.1',
            'react-hook-form': '6.15.8',
            'react-i18next': '11.16.2',
            '@digit-ui/digit-ui-svg-components': '1.0.1',
          },
        }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),
    ],
  };

  return merge(commonConfig, devConfig);
};
