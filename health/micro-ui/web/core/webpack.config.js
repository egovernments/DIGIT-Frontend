const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  // mode: 'development',
  entry: "./src/index.js",
  devtool: "none",
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  output: {
    filename: process.env.NODE_ENV === 'production' 
      ? '[name].[contenthash].bundle.js'
      : '[name].bundle.js',
    path: path.resolve(__dirname, "build"),
    publicPath: "/core-ui/",
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 50000,
      maxSize: 244000,
      enforceSizeThreshold: 244000,
      minChunks: 1,
      maxAsyncRequests: 10,
      maxInitialRequests: 5
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    // new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({ inject: true, template: "public/index.html" }),
  ],
};