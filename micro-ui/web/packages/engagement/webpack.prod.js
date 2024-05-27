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
            '@egovernments/digit-ui-react-components': {
              singleton: true,
              requiredVersion: packageJson.dependencies['@egovernments/digit-ui-react-components'],
            },
          ...packageJson.dependencies
        },
      }),
    ],
  };

  return merge(commonConfig, prodConfig);
};
