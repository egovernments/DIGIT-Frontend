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
        test: /\.mjs$/,
        include: /pdfjs-dist/,
        use: {
          loader: "babel-loader",
          options: {
            configFile: false,
            babelrc: false,
            presets: [
              ["@babel/preset-env", {
                targets: { chrome: "67" },
                shippedProposals: true,
                modules: false,
              }],
            ],
          },
        },
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
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "build"),
    // Placeholder public path. The container entrypoint rewrites it to the real
    // base path (/<COUNTRY_PREFIX>/<BUILD_VARIANT>/) at start-up, so one image can
    // be served from any path prefix. webpack 4 has no publicPath: "auto".
    publicPath: process.env.PUBLIC_PATH || "/__BASE_PATH__/",
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize:20000,
      maxSize:50000,
      enforceSizeThreshold:50000,
      minChunks:1,
      maxAsyncRequests:30,
      maxInitialRequests:30
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    // new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({ inject: true, template: "public/index.html" }),
  ],
};