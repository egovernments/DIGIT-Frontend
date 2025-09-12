const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const dotenv = require("dotenv");
const envFile = dotenv.config().parsed || {};
const envKeys = Object.entries(envFile).reduce((acc, [key, val]) => {
  acc[`process.env.${key}`] = JSON.stringify(val);
  return acc;
}, {});

module.exports = (env, argv) => {
  const isProd = argv.mode === "production";

  return {
    mode: isProd ? "production" : "development",
    entry: "./src/index.js",
    devtool: isProd ? "source-map" : "inline-source-map",
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ["babel-loader"],
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[hash].[ext]",
                outputPath: "assets",
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: [".js", ".jsx"],
    },
    output: {
      filename: "[name].[hash].js",
      path: path.resolve(__dirname, "build"),
      publicPath: isProd ? "/workbench-ui/" : "/",
    },
    devServer: {
      static: {
        directory: path.join(__dirname, "public"), // ✅ correct for dev-server v4
      },
      compress: true,
      port: 3000,
      open: true,
      historyApiFallback: true,
      proxy: [
      {
        context: [
           "/access/v1/actions/mdms",
    "/egov-mdms-service",
    "/mdms-v2",
    "/egov-idgen",
    "/egov-location",
    "/localization",
    "/egov-workflow-v2",
    "/pgr-services",
    "/health-pgr-services",
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
    "/hcm-moz-impl",
    "/project",
    "/project/staff/v1/_search",
    "/project/v1/_search",
    "/facility/v1/_search",
    "/product/v1/_search",
    "/product/variant/v1/_search",
    "/hcm-bff/bulk/_transform",
    "/hcm-bff/hcm/_processmicroplan",
    "/health-hrms",
    "/project-factory",
    "/boundary-service",
    "/product",
    "/plan-service",
    "/resource-generator",
    "/health-project",
    "/health-service-request",
    "/census-service",
    "/health-attendance/v1/_search",
    "/health-individual/v1/_search",
    "/health-muster-roll",
    "/health-expense/bill/v1/_search",
    "/health-expense-calculator/v1/_calculate",
    "/filestore/v1/files/id",
    "/health-project/staff/v1/_search",
    "/health-project/v1/_search",
    "/health-individual",
    "/health-hrms/employees",
    "/inbox/v2/_search",
    // attendee delete
    "/health-attendance/attendee/v1/_delete",
    "/health-attendance/attendee/v1/_create",
    "/health-hrms/employees/_search",
        ],
        target: "https://unified-dev.digit.org",
        changeOrigin: true,
        secure: false,
      },
    ],

    },
    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: "public/index.html",
        inject: true,
      //   templateParameters: {
      //   REACT_APP_GLOBAL: envFile.REACT_APP_GLOBAL, // <-- Inject env into HTML
      // },
      }),
    ],
  };
};
