const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const commonConfig = require("./webpack.common");
const packageJson = require("./package.json");

module.exports = () => {
  const devConfig = {
    mode: "development",
    output: {
      publicPath: "https://localhost:8088/",
      filename: "[name].[contenthash].js",
    },
    devServer: {
      port: 8088,
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
            "Connection": "keep-alive"
          },
        },

      ],
      historyApiFallback: {
        index: "/",
      },
      server: "https", //Enable HTTPS
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
          "react": "17.0.1",
          "react-date-range": "1.4.0",
          "react-dom": "17.0.1",
          "react-hook-form": "6.15.8",
          "react-i18next": "11.16.2",
          "react-inlinesvg": "1.1.7",
          "react-query": "3.6.1",
          "react-router-dom": "5.2.0",
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
        },
      }),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
    ],
  };

  return merge(commonConfig, devConfig);
};
