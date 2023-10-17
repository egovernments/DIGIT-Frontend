const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common");
const packageJson = require("./package.json");

module.exports = () => {
  const devConfig = {
    mode: "development",
    output: {
      publicPath: "https://localhost:8080/",
      filename: "[name].[contenthash].js",
    },
    devServer: {
      port: 8080,
      historyApiFallback: {
        index: "/",
      },
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "container",
        remotes: {
          // landing: "landing@http://localhost:8081/remoteEntry.js",
          auth: "auth@https://localhost:8082/remoteEntry.js",
          // header: "header@http://localhost:8083/remoteEntry.js",
          dashboard: "dashboard@https://localhost:8084/remoteEntry.js",
        },
        shared: packageJson.dependencies,
      }),
    ],
  };

  return merge(commonConfig, devConfig);
};
