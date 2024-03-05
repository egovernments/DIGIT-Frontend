const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const commonConfig = require("./webpack.common");
const packageJson = require("./package.json");

module.exports = () => {
  const prodConfig = {
    mode: "production",
    output: {
      publicPath: "/pgr-ui/",
      filename: "[name].[contenthash].js",
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "pgr",
        filename: "remoteEntry.js",
        exposes: {
          "./PGRModule": "./src/SingleSpaEntry",
        },
        // shared: packageJson.dependencies,
        shared: packageJson.dependencies
      }),
    ],
  };

  return merge(commonConfig, prodConfig);
};
