const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development", // Set mode to development
  entry: path.resolve(__dirname, 'src/index.js'),
  devtool: "source-map", // Enable source maps for easier debugging in development
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: ["@babel/plugin-proposal-optional-chaining"]
          }
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      }
    ],
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      maxSize: 50000,
      enforceSizeThreshold: 50000,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({ inject: true, template: "public/index.html" }),
  ],
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    preferRelative: true, // Try resolving relatively if needed
    fallback: {
      process: require.resolve("process/browser"),
    },
  },
  devServer: {
    static: path.join(__dirname, "dist"), // Change this to "dist"
    compress: true,
    port: 3000,
    hot: true,
    historyApiFallback: true,
    proxy: [
      {
        context: ["/egov-mdms-service"], // Add all endpoints that need to be proxied
        target: "https://works-dev.digit.org",
        changeOrigin: true,
        secure: false,
      },
    ],
}
};
