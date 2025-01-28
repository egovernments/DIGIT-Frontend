const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  // mode: "development", // Uncomment for development
  entry: "./src/index.js",
  devtool: "none", // Add "source-map" in development mode for debugging
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
        test: /\.(png|jpe?g|gif|svg|woff2?|ttf|eot)$/i,
        type: "asset", // Replaces file-loader for modern Webpack
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // Inline files smaller than 8 KB
          },
        },
        generator: {
          filename: "assets/[hash][ext][query]", // Output assets in an organized folder
        },
      },
    ],
  },
  output: {
    filename: "[name].[contenthash].js", // Use content hashes for caching
    chunkFilename: "[name].[contenthash].js", // Dynamic imports use hashed filenames
    path: path.resolve(__dirname, "build"),
    publicPath: "/console/", // Serve files from the correct base path
  },
  optimization: {
    runtimeChunk: "single", // Extract runtime into its own chunk
    moduleIds: "deterministic", // Consistent hashes for modules
    splitChunks: {
      chunks: "all",
      minSize: 30000, // Minimum size for a chunk (e.g., 30 KB)
      maxSize: 250000, // Maximum size for a chunk (e.g., 250 KB)
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
          priority: -10,
        },
        common: {
          test: /[\\/]src[\\/]/,
          name: "common",
          minChunks: 2,
          priority: -20,
        },
      },
    },
  },
  plugins: [
    new CleanWebpackPlugin(), // Cleans build folder before each build
    new HtmlWebpackPlugin({
      inject: true,
      template: "public/index.html", // Use the template file for the HTML
      scriptLoading: "defer", // Load scripts with defer for better performance
    }),
  ],
};
