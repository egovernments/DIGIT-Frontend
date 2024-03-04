const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common");
const packageJson = require("./package.json");
require('dotenv').config({ path: '../../.env' }); 

module.exports = () => {
  const devConfig = {
    mode: "development",
    output: {
      // publicPath: `https://localhost:8000/`,
      publicPath: `/`,
      filename: "[name].[contenthash].js",
    },
    devServer: {
      port: 8000,
      proxy: [
        {
          context: () => true,
          // target:  'https://mukta-uat.digit.org',
          target: 'https://unified-dev.digit.org',
          secure: false,
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
        name: "core",
        remotes: {
          // landing: "landing@http://localhost:8081/remoteEntry.js",
          // auth: "auth@http://localhost:8082/remoteEntry.js",
          // header: "header@http://localhost:8083/remoteEntry.js",
          // dashboard: "dashboard@http://localhost:8084/remoteEntry.js",
          // pgr: "pgr@https://localhost:8087/remoteEntry.js",
          // hrms: "hrms@https://localhost:8085/remoteEntry.js",

          // workbench: "workbench@https://localhost:8086/remoteEntry.js",
          // common:"common@https://localhost:8090/remoteEntry.js"

          // app1: "app1@https://localhost:8001/remoteEntry.js",
          //dss: "dss_ui@https://localhost:8087/remoteEntry.js",
          // measurement : "measurement@https://localhost:8088/remoteEntry.js"
        },
        shared: packageJson.dependencies,
      }),
    ],
  };

  return merge(commonConfig, devConfig);
};
