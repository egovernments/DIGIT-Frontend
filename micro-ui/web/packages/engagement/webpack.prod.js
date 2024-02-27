const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const commonConfig = require("./webpack.common");
const packageJson = require("./package.json");

module.exports = () => {
  const prodConfig = {
    mode: "production",
    output: {
      publicPath: "engagement",
      filename: "[name].[contenthash].js",
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "engagement_ui",
        filename: "remoteEntry.js",
        exposes: {
          "./EngagementModule": "./src/SingleSpaEntry",
        },
        // shared: packageJson.dependencies,
        shared: packageJson.dependencies
      }),
    ],
  };

  return merge(commonConfig, prodConfig);
};
