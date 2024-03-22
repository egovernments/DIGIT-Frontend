const { merge } = require('webpack-merge');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const commonConfig = require('./webpack.common');
const packageJson = require('./package.json');

module.exports = () => {
  const prodConfig = {
    mode: 'production',
    output: {
      publicPath: '/engagement-ui/',
      filename: '[name].[contenthash].js',
    },
    plugins: [
      new ModuleFederationPlugin({
        name: 'engagement',
        filename: 'remoteEntry.js',
        exposes: {
          './EngagementModule': './src/SingleSpaEntry',
        },
        shared: {
          "react": "17.0.2",
          "react-dom": "17.0.2",
          "react-hook-form": "6.15.8",
          "react-i18next": "11.16.2",
          "react-query": "3.6.1",
          "react-router-dom": "5.3.0",
          "react-time-picker": "4.2.1",
          "recharts": "^2.0.9",
          "single-spa-react": "^4.6.1",
          "webpack": "^5.68.0",
          "webpack-cli": "^4.9.2",
          "webpack-dev-server": "^4.8.1",
          "webpack-merge": "5.7.3",
          "date-fns":"2.28.0",
        },
      }),
    ],
  };

  return merge(commonConfig, prodConfig);
};
