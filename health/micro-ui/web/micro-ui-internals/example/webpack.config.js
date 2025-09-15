const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const dotenv = require("dotenv");
const fs = require("fs");

// Load .env variables
const envFile = dotenv.config().parsed || {};

// Make DefinePlugin-compatible keys
const envKeys = Object.entries(envFile).reduce((acc, [key, val]) => {
  acc[`process.env.${key}`] = JSON.stringify(val);
  return acc;
}, {});
const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProduction ? "production" : "development",
  entry: path.resolve(__dirname, "src/index.js"),
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(js)$/,
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
  output: {
    filename: "[name].[contenthash:8].bundle.js",
    chunkFilename: "[name].[contenthash:8].chunk.js",
    path: path.resolve(__dirname, "build"),
    clean: true, // Clean the output directory before emit
    publicPath: "/workbench-ui/",
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      minSize: 20000,
      maxSize: 244000, // Increased to handle large modules better
      enforceSizeThreshold: 244000,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 10, // Reduced to limit initial requests
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
          priority: 10,
          maxSize: 244000,
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: "react",
          chunks: "all",
          priority: 20,
          enforce: true,
        },
        digitUI: {
          test: /[\\/]node_modules[\\/]@egovernments[\\/]digit-ui-(libraries|components|react-components|module-core)[\\/]/,
          name: "digit-ui",
          chunks: "all",
          priority: 15,
          maxSize: 244000,
        },
        campaign: {
          test: /[\\/]node_modules[\\/]@egovernments[\\/]digit-ui-module-campaign-manager[\\/]/,
          name: "campaign-module",
          chunks: "async", // Load campaign module asynchronously
          priority: 5,
          maxSize: 244000,
        },
        workbench: {
          test: /[\\/]node_modules[\\/]@egovernments[\\/]digit-ui-module-workbench[\\/]/,
          name: "workbench-module",
          chunks: "async", // Load workbench module asynchronously
          priority: 5,
          maxSize: 244000,
        },
      },
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
    new webpack.DefinePlugin(envKeys), // <-- Add this
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: "public/index.html",
      templateParameters: isProduction
        ? {}
        : {
            REACT_APP_GLOBAL: envFile.REACT_APP_GLOBAL, // <-- Inject env into HTML
          },
    }),
  ],
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    preferRelative: true,
    alias: {
      // Fix case sensitivity issues with React
      React: path.resolve(__dirname, "../node_modules/react"),
      react: path.resolve(__dirname, "../node_modules/react"),
      ReactDOM: path.resolve(__dirname, "../node_modules/react-dom"),
      "react-dom": path.resolve(__dirname, "../node_modules/react-dom"),
    },
    fallback: {
      process: require.resolve("process/browser"),
    },
  },
  devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    port: 3000,
    hot: true,
    historyApiFallback: {
      index: "/workbench-ui/index.html",
      rewrites: [{ from: /^\/workbench-ui/, to: "/workbench-ui/index.html" }],
    },
    watchFiles: isProduction
      ? undefined
      : {
          paths: ["**/*"], // watch all project files
          options: {
            ignored: path.resolve(__dirname, "node_modules"), // skip same-level node_modules
            poll: 1000, // check for changes every second
            aggregateTimeout: 300, // delay rebuild after first change
          },
        },
    proxy: [
      {
        context: [
          "/access/v1/actions/mdms",
          "/tenant-management",
          "/user-otp",
          "/egov-mdms-service",
          "/plan-service",
          "/mdms-v2",
          "/egov-idgen",
          "/egov-location",
          "/localization",
          "/egov-workflow-v2",
          "/pgr-services",
          "/filestore",
          "/egov-hrms",
          "/user-otp",
          "/user",
          "/fsm",
          "/billing-service",
          "/collection-services",
          "/pdf-service",
          "/pg-service",
          "/vehicle",
          "/vendor",
          "/property-services",
          "/fsm-calculator/v1/billingSlab/_search",
          "/pt-calculator-v2",
          "/dashboard-analytics",
          "/echallan-services",
          "/egov-searcher/bill-genie/mcollectbills/_get",
          "/egov-searcher/bill-genie/billswithaddranduser/_get",
          "/egov-searcher/bill-genie/waterbills/_get",
          "/egov-searcher/bill-genie/seweragebills/_get",
          "/egov-pdf/download/UC/mcollect-challan",
          "/egov-hrms/employees/_count",
          "/tl-services/v1/_create",
          "/tl-services/v1/_search",
          "/egov-url-shortening/shortener",
          "/inbox/v1/_search",
          "/inbox/v2/_search",
          "/tl-services",
          "/tl-calculator",
          "/org-services",
          "/edcr",
          "/hcm-moz-impl",
          "/bpa-services",
          "/noc-services",
          "/egov-user-event",
          "/egov-document-uploader",
          "/egov-pdf",
          "/egov-survey-services",
          "/ws-services",
          "/sw-services",
          "/ws-calculator",
          "/sw-calculator/",
          "/audit-service/",
          "/egov-searcher",
          "/report",
          "/inbox/v1/dss/_search",
          "/loi-service",
          "/project/v1/",
          "/estimate-service",
          "/loi-service",
          "/works-inbox-service/v2/_search",
          "/egov-pdf/download/WORKSESTIMATE/estimatepdf",
          "/muster-roll",
          "/individual",
          "/mdms-v2",
          "/facility/v1/_search",
          "/project/staff/v1/_create",
          "/product/v1/_create",
          "/boundary-service",
          "/project-factory",
          "/project-factory/v1/data/_autoGenerateBoundaryCode",
          "/billing-service/bill/v2/_fetchbill",
          "/tenant-management",
          "/default-data-handler",
          "/facility/v1/_create",
          "/service-request/",
          "/product/",
          "/health-service-request/",
        ],
        target: envFile.REACT_APP_PROXY_API,
        changeOrigin: true,
        secure: false,
      },
    ],
  },
};
