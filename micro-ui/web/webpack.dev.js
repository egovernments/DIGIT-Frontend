const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, "src/index.js"),
  devtool: "eval-source-map", // Faster rebuilds, good for dev

  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/", // Use root for dev
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: ["@babel/plugin-proposal-optional-chaining"],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },

  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
    new HtmlWebpackPlugin({
      template: "public/index.html",
      inject: true,
    }),
  ],

  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    fallback: {
      process: require.resolve("process/browser"),
    },
  },

  devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    port: 3000,
    hot: true,
    historyApiFallback: true,
    proxy: [
      {
        context: [
          "/egov-mdms-service",
          "/access/v1/actions/mdms",
          "/tenant-management",
          "/user-otp",
          "/mdms-v2",
          "/egov-idgen",
          "/egov-location",
          "/localization",
          "/egov-workflow-v2",
          "/pgr-services",
          "/filestore",
          "/egov-hrms",
          "/user",
          "/fsm",
          "/billing-service",
          "/collection-services",
          "/pdf-service",
          "/pg-service",
          "/vehicle",
          "/vendor",
          "/property-services",
          "/dashboard-analytics",
          "/egov-searcher",
          "/egov-pdf",
          "/egov-url-shortening",
          "/inbox",
          "/report",
          "/loi-service",
          "/project",
          "/estimate-service",
          "/muster-roll",
          "/individual",
          "/facility",
          "/boundary-service",
          "/org-services",
          "/bpa-services",
          "/noc-services",
        ],
        target: "https://unified-qa.digit.org",
        changeOrigin: true,
        secure: false,
      },
    ],
  },
};
