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
        shared: {
          react: { singleton: true }, // React will be shared as a singleton
          'react-dom': { singleton: true }, // ReactDOM will be shared as a singleton,
          'react-query': { singleton: true },
          "@digit-ui/digit-ui-libraries-mfe": "1.0.16",
          "react-date-range": "1.4.0",
          "react-hook-form": "6.15.8",
          "react-i18next": "11.16.2",
          "react-router-dom": "5.3.0"
        },
      }),
    ],
  };

  return merge(commonConfig, prodConfig);
};
