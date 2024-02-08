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
    // historyApiFallback: true,
    proxy: [
      {
        context: () => true,
        target: "https://unified-dev.digit.org",
        secure: true,
        changeOrigin: true,
        bypass: function (req, res, proxyOptions) {
          if (req.headers.accept.indexOf("html") !== -1) {
            console.log("Skipping proxy for browser request.");
            return "/index.html";
          }
          return null;
        },
        headers: {
          Connection: "keep-alive",
        },
      },
    ],
    historyApiFallback: {
      index: "/",
    },
    https: false, // Enable HTTPS
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
        app2: "app2@http://localhost:6005/remoteEntry.js",
        app3: "app3@http://localhost:6004/remoteEntry.js",
      },
      // shared: ["react-query"],
    }),

    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public", "index.html"),
    }),
  ],
};
