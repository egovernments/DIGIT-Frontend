const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const commonConfig = require("./webpack.common");
const packageJson = require("./package.json");

module.exports = () => {
  const prodConfig = {
    mode: "production",
    output: {
      publicPath: "/hrms-ui/",
      filename: "[name].[contenthash].js",
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "hrms-ui",
        filename: "remoteEntry.js",
        exposes: {
          "./HRMSModule": "./src/SingleSpaEntry",
        },
         shared: packageJson.dependencies, //removed the shared logic for now will be enabled later for optimization
      }),
    ],
  };

  return merge(commonConfig, prodConfig);

}
