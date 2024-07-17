const path = require("path");
const packageJson = require("./package.json");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  mode: "development",
  entry: "./src/index",
  resolve: {
    extensions: [ ".js", ".jsx"],
    modules: [path.resolve(__dirname, "src"), "node_modules"],
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react"],
        },
      },
    ],
  },
  output: {
    publicPath: `https://localhost:8001/`,
    filename: "[name].[contenthash].js",
  },
  devServer: {
    port: 8001,
    proxy: [
      {
        context: () => true,
        target:  'https://unified-dev.digit.org',
        secure: true,
        changeOrigin:true,
        bypass: function (req, res, proxyOptions) {
          if (req.headers.accept.indexOf('html') !== -1) {
            console.log('Skipping proxy for browser request.');
            return '/index.html';
          }
        },
        headers: {
          "Connection": "keep-alive"
      },
      },
    ],
    historyApiFallback: {
      index: "/",
    },
    server:"https", //Enable HTTPS
  },
  devtool: "source-map",

  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new ModuleFederationPlugin({
      name: "app1",
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/SingleSpaEntry',
      },
      shared: {
        ...packageJson.dependencies,
        react: { singleton: true }, // React will be shared as a singleton
        'react-dom': { singleton: true }, // ReactDOM will be shared as a singleton,
        'react-query': { singleton: true },
      
      },
    }),
  ],
};
