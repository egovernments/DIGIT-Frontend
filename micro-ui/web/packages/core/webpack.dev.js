const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common");
const packageJson = require("./package.json");
require('dotenv').config({ path: '../../.env' }); 

module.exports = () => {
  const devConfig = {
    mode: "development",
    output: {
      publicPath: `https://localhost:8000/`,
      filename: "[name].[contenthash].js",
    },
    devServer: {
      port: 8000,
      proxy: [
        {
          context: () => true,
          target:  'https://unified-dev.digit.org',
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
          workbench: "workbench@https://localhost:8086/remoteEntry.js",
          dss: "dss@https://localhost:8087/remoteEntry.js",
          measurement : "measurement@https://localhost:8088/remoteEntry.js"
        },
        shared: packageJson.dependencies,
      }),
    ],
  };

  return merge(commonConfig, devConfig);
};
