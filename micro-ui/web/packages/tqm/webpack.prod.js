const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const commonConfig = require("./webpack.common");
const packageJson = require("./package.json");

module.exports = () => {
  const prodConfig = {
    mode: "production",
    output: {
      publicPath: "/tqm/",
      filename: "[name].[contenthash].js",
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "tqm",
        filename: "remoteEntry.js",
        exposes: {
          "./TQMModule": "./src/SingleSpaEntry",
        },
        shared: {
          'single-spa-react': '^4.6.1',
          '@digit-ui/digit-ui-libraries-mfe': '1.0.8',
          '@rjsf/core': '5.10.0',
          '@rjsf/utils': '5.10.0',
          '@rjsf/validator-ajv8': '5.10.0',
          'react': '17.0.2',
          'react-date-range': '1.4.0',
          'react-dom': '17.0.2',
          'react-hook-form': '6.15.8',
          'react-i18next': '11.16.2',
          'react-query': '3.6.1',
          'react-router-dom': '5.3.0',
          'react-select': '5.7.4',
          'react-table': '7.7.0',
          'react-time-picker': '4.2.1',
        }
      }),
    ],
  };

  return merge(commonConfig, prodConfig);
};
