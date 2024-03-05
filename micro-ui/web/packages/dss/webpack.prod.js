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
        shared: packageJson.dependencies
      }),
    ],
  };

  return merge(commonConfig, prodConfig);
};
