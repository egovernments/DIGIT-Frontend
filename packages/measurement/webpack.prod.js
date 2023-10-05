const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const commonConfig = require("./webpack.common");
const packageJson = require("./package.json");

module.exports = () => {
  const prodConfig = {
    mode: "production",
    output: {
      publicPath: "/measurement/",
      filename: "[name].[contenthash].js",
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "measurement",
        filename: "remoteEntry.js",
        exposes: {
          "./MeasurementModule": "./src/bootstrap",
        },
        shared: packageJson.dependencies,
      }),
    ],
  };

  return merge(commonConfig, prodConfig);
};
