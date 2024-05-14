const { merge } = require('webpack-merge');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const commonConfig = require('./webpack.common');
const packageJson = require('./package.json');

module.exports = () => {
  const prodConfig = {
    mode: 'production',
    output: {
      publicPath: '/hrms-ui/',
      filename: '[name].[contenthash].js',
    },
    plugins: [
      new ModuleFederationPlugin({
        name: 'hrms',
        filename: 'remoteEntry.js',
        exposes: {
          './HRMSModule': './src/SingleSpaEntry',
        },
        shared: {
          ...packageJson.dependencies,
          react: { singleton: true }, // React will be shared as a singleton
          'react-dom': { singleton: true }, // ReactDOM will be shared as a singleton
        },
      }),
    ],
  };

  return merge(commonConfig, prodConfig);
};
