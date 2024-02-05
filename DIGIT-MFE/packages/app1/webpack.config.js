const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  mode: "production",
  entry: {
    app: path.join(__dirname, "src", "index.js"),
  },
  output: {
    filename: "[name].[chunkhash].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react"],
        },
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
    modules: ["node_modules", path.resolve(__dirname, "src")],
  },
  devServer: {
    port: "6001",
    hot: false,
  },
  devtool: "source-map",

  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public", "index.html"),
    }),
    new ModuleFederationPlugin({
      name: "app1",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/singleSpaEntry",
      },
      shared: [
        //
        //   "react-dom",
        //   "react-query",
        //   "react",
        //   "single-spa-react",
        //
      ],
    }),
  ],
};
