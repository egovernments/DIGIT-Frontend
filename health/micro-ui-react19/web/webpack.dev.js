const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require("webpack");
const path = require("path");

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-source-map",

  output: {
    filename: "[name].bundle.js",
    chunkFilename: "[name].chunk.js",
    publicPath: "/workbench-ui/",
  },

  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    historyApiFallback: {
      index: "/workbench-ui/index.html",
    },
    compress: true,
    port: process.env.PORT || 3000,
    hot: true,
    liveReload: false, // Disable auto refresh to prevent conflicts
    open: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
      progress: true,
    },
    watchFiles: {
      paths: ["packages/**/*"],
      options: {
        usePolling: false,
        ignored: /node_modules/,
      },
    },
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
          "/health-hrms",
          "/health-project",
          "/fsm-calculator",
          "/product",
          "/health-service-request",
          "/excel-ingestion",
          "/boundary-management"
        ],
        target: process.env.REACT_APP_PROXY_URL || "https://unified-dev.digit.org",
        changeOrigin: true,
        secure: false,
      },
    ],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"),
    }),
  ],

  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
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

  performance: {
    hints: false,
  },
});
