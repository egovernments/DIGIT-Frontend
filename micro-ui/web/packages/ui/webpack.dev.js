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
      server:"https", //Enable HTTPS
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "core",
        remotes: {
          // hrms: "hrms@https://localhost:8085/remoteEntry.js",
          // workbench: "workbench@https://localhost:8086/remoteEntry.js",
          // // common:"common@https://localhost:8090/remoteEntry.js",
          // pgr:"pgr@https://localhost:8087/remoteEntry.js",
          // // dss: "dss@https://localhost:8088/remoteEntry.js",
          // dss: "dss@https://localhost:8088/remoteEntry.js",
          // engagement: "engagement@https://localhost:8091/remoteEntry.js",
          microplan:"microplan@https://localhost:8099/remoteEntry.js",
          // tqm: "tqm@https://localhost:8089/remoteEntry.js",
          // app1: "app1@https://localhost:8001/remoteEntry.js",
          campaign:"campaign@https://localhost:8005/remoteEntry.js"

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

  return merge(commonConfig, devConfig);
};
