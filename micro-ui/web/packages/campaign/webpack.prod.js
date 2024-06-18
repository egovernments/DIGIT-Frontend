const { merge } = require('webpack-merge');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const commonConfig = require('./webpack.common');
const packageJson = require('./package.json');
const path = require('path'); // Import path module

module.exports = () => {
  const prodConfig = {
    mode: 'production',
    output: {
      publicPath: '/campaign-mfe/',
      filename: '[name].[contenthash].js',
    },
    // resolve: {
    //   alias: {
    //     // Alias for your components library
    //    '@ui-components': path.resolve(__dirname, '../packages/ui-components'),
    //   },
    //},
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
    ],
  };

  return merge(commonConfig, prodConfig);
};
