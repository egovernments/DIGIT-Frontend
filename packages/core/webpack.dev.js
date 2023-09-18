const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common");
const packageJson = require("./package.json");
require('dotenv').config({ path: '../../.env' }); 

module.exports = () => {
  const devConfig = {
    mode: "development",
    output: {
      publicPath: `https://localhost:${process.env.REACT_APP_PORT}/`,
      filename: "[name].[contenthash].js",
    },
    devServer: {
      port: process.env.REACT_APP_PORT,
      proxy: [
        {
          context: () => true,
          target:  'https://works-qa.digit.org',
          secure: true,
          changeOrigin:true,
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
      https: true, // Enable HTTPS
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "core",
        remotes: {
          // landing: "landing@http://localhost:8081/remoteEntry.js",
          auth: "auth@http://localhost:8082/remoteEntry.js",
          // header: "header@http://localhost:8083/remoteEntry.js",
          dashboard: "dashboard@http://localhost:8084/remoteEntry.js",
          hrms: "hrms@https://localhost:8085/remoteEntry.js",
        },
        shared: packageJson.dependencies,
      }),
    ],
  };

  return merge(commonConfig, devConfig);
};
