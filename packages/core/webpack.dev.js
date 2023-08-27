const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common");
const packageJson = require("./package.json");

module.exports = () => {
  const devConfig = {
    mode: "development",
    output: {
      publicPath: "http://localhost:8008/",
      filename: "[name].[contenthash].js",
    },
    devServer: {
      port: 8008,
      historyApiFallback: {
        index: "/",
      },
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "core",
        remotes: {
          // landing: "landing@http://localhost:8081/remoteEntry.js",
          auth: "auth@http://localhost:8082/remoteEntry.js",
          // header: "header@http://localhost:8083/remoteEntry.js",
          dashboard: "dashboard@http://localhost:8084/remoteEntry.js",
        },
        shared: packageJson.dependencies,
      }),
    ],
  };

  return merge(commonConfig, devConfig);
};
