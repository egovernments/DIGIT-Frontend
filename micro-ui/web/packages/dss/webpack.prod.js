const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const commonConfig = require("./webpack.common");
const packageJson = require("./package.json");

module.exports = () => {
  const prodConfig = {
    mode: "production",
    output: {
      publicPath: "/dss-ui/",
      filename: "[name].[contenthash].js",
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "dss",
        filename: "remoteEntry.js",
        exposes: {
          "./DSSModule": "./src/SingleSpaEntry",
        },
        shared: {
          "jsonpath": "^1.1.1",
          "lodash": "4.17.21",
          "react": "17.0.2",
          "react-date-range": "1.4.0",
          "react-dom": "17.0.2",
          "react-hook-form": "6.15.8",
          "react-i18next": "11.16.2",
          "react-inlinesvg": "1.1.7",
          "react-query": "3.6.1",
          "react-router-dom": "5.3.0",
          "react-select": "5.7.4",
          "react-simple-maps": "2.0.0",
          "react-time-picker": "4.2.1",
          "react-tooltip": "4.1.2",
          "recharts": "^2.0.9",
          "single-spa-react": "^4.6.1",
          "webpack": "^5.68.0",
          "webpack-cli": "^4.9.2",
          "webpack-dev-server": "^4.8.1",
          "webpack-merge": "5.7.3"
        }
      }),
    ],
  };

  return merge(commonConfig, prodConfig);
};
