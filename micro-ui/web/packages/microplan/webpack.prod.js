const { merge } = require('webpack-merge');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const commonConfig = require('./webpack.common');
const packageJson = require('./package.json');

module.exports = () => {
  const prodConfig = {
    mode: 'production',
    output: {
      publicPath: '/microplan-mfe/',
      filename: '[name].[contenthash].js',
    },
    plugins: [
      new ModuleFederationPlugin({
        name: 'microplan',
        filename: 'remoteEntry.js',
        exposes: {
          './MICROPLANModule': './src/SingleSpaEntry',
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
    ],
  };

  return merge(commonConfig, prodConfig);
};
