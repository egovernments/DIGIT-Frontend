const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const commonConfig = require("./webpack.common");
const packageJson = require("./package.json");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ExternalRemotesPlugin = require('external-remotes-plugin');
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
        shared:  {
          ...packageJson.dependencies,
          react: { singleton: true }, // React will be shared as a singleton
          'react-dom': { singleton: true }, // ReactDOM will be shared as a singleton
          'react-query': { singleton: true },
        },
      }),
      new MiniCssExtractPlugin(
        true
          ? {
              filename: 'static/css/[name].[contenthash].css',
              chunkFilename: 'static/css/[name].[contenthash].css',
            }
          : {}
      ),
    ].filter(Boolean),
    optimization: {
      minimize: true, //true if prod
      minimizer: ['...', new CssMinimizerPlugin()],
    },
  };

  return merge(commonConfig, prodConfig);
};
