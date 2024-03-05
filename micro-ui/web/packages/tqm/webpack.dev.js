const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const commonConfig = require("./webpack.common");
const packageJson = require("./package.json");

module.exports = () => {
  const devConfig = {
    mode: "development",
    output: {
      publicPath: "https://localhost:8089/",
      filename: "[name].[contenthash].js",
    },
    devServer: {
      port: 8089,
      proxy: [
        {
          context: () => true,
          target: "https://unified-dev.digit.org",
          secure: true,
          changeOrigin: true,
          bypass: function (req, res, proxyOptions) {
            if (req.headers.accept.indexOf("html") !== -1) {
              console.log("Skipping proxy for browser request.");
              return "/index.html";
            }
          },
          headers: {
            Connection: "keep-alive",
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
        name: "tqm",
        filename: "remoteEntry.js",
        exposes: {
          "./TQMModule": "./src/SingleSpaEntry",
        },
        shared: {
          "single-spa-react": "^4.6.1",
          "@digit-ui/digit-ui-libraries-mfe": "1.0.7",
          "@digit-ui/digit-ui-module-core-base": "1.0.8",
          "@rjsf/core": "5.10.0",
          "@rjsf/utils": "5.10.0",
          "@rjsf/validator-ajv8": "5.10.0",
          "react": "17.0.1",
          "react-date-range": "1.4.0",
          "react-dom": "17.0.1",
          "react-hook-form": "6.15.8",
          "react-i18next": "11.16.2",
          "react-query": "3.6.1",
          "react-router-dom": "5.2.0",
          "react-select": "5.7.4",
          "webpack": "^5.68.0",
          "webpack-cli": "^4.9.2",
          "webpack-dev-server": "^4.8.1",
          "webpack-merge": "5.7.3",
          "react-table": "7.7.0",
          "react-time-picker": "4.2.1",
        },
      }),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
    ],
  };

  return merge(commonConfig, devConfig);
};
