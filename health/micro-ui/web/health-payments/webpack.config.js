const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: "./src/index.js",
  devtool: false,
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
    filename: "[name].[chunkhash:8].bundle.js",
    chunkFilename: "[name].[chunkhash:8].bundle.js",
    path: path.resolve(__dirname, "build"),
    publicPath: "/payments-ui/",
  },
  optimization: {
    moduleIds: 'hashed',
    splitChunks: {
      chunks: 'all',
      minSize: 100000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 8,
      maxInitialRequests: 8,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    // new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({ inject: true, template: "public/index.html", scriptLoading: 'defer' }),
  ],
};