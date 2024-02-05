const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  mode: "production",
  entry: {
    app: path.join(__dirname, "src", "index.js"),
  },
  output: {
    clean: true,
    filename: "[name].[contenthash].js",
    path: path.join(__dirname, "dist"),
  },
  devServer: {
    port: 7001,
    hot: false,
    historyApiFallback: true,
  },
  resolve: {
    extensions: [".js"],
    modules: ["node_modules", path.resolve(__dirname, "src")],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "host",
      remotes: {
        app1: "app1@http://localhost:6001/remoteEntry.js",
        app2: "app2@http://localhost:6002/remoteEntry.js",
        app3: "app3@http://localhost:6003/remoteEntry.js",
      },
      // shared: ["react-query"],
    }),

    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public", "index.html"),
    }),
  ],
};
