require('dotenv').config();

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
      publicPath: "/workbench-mfe/",
      filename: "[name].[contenthash].js",
    },
    plugins: [
      new ExternalRemotesPlugin(),
      new ModuleFederationPlugin({
        name: "workbench",
        filename: "remoteEntry.js",
        exposes: {
          "./WorkbenchModule": "./src/SingleSpaEntry",
        },
        shared: {
          ...packageJson.dependencies
        }
      }),
      new MiniCssExtractPlugin(
        false
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
