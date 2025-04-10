// const path = require("path");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// // const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// module.exports = {
//   // mode: 'development',
//   entry: "./src/index.js",
//   devtool: "source-map",
//   module: {
//     rules: [
//       {
//         test: /\.(js)$/,
//         exclude: /node_modules/,
//         use: {
//           loader: "babel-loader",
//           options: {
//             presets: ["@babel/preset-env", "@babel/preset-react"],
//             plugins: ["@babel/plugin-proposal-optional-chaining"]
//           }
//         }
//       },
//       {
//         test: /\.css$/i,
//         use: ["style-loader", "css-loader"],
//       }
//     ],
//   },
//   output: {
//     filename: "[name].bundle.js",
//     path: path.resolve(__dirname, "build"),
//     publicPath: "/digit-ui/",
//   },
//   optimization: {
//     splitChunks: {
//       chunks: 'all',
//       minSize: 20000,
//       maxSize: 50000,
//       enforceSizeThreshold: 50000,
//       minChunks: 1,
//       maxAsyncRequests: 30,
//       maxInitialRequests: 30
//     },
//   },
//   plugins: [
//     new CleanWebpackPlugin(),
//     // new BundleAnalyzerPlugin(),
//     new HtmlWebpackPlugin({ inject: true, template: "public/index.html" }),
//   ],
// };

// const path = require("path");
// const webpack = require("webpack");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");

// module.exports = {
//   mode: "production", // Set mode to development
//   entry: path.resolve(__dirname, 'src/index.js'),
//   devtool: "source-map", // Enable source maps for easier debugging in development
//   module: {
//     rules: [
//       {
//         test: /\.(js)$/,
//         exclude: /node_modules/,
//         use: {
//           loader: "babel-loader",
//           options: {
//             presets: ["@babel/preset-env", "@babel/preset-react"],
//             plugins: ["@babel/plugin-proposal-optional-chaining"]
//           }
//         },
//       },
//       {
//         test: /\.css$/i,
//         use: ["style-loader", "css-loader"],
//       }
//     ],
//   },
//   output: {
//     filename: "[name].bundle.js",
//     path: path.resolve(__dirname, "build"),
//     publicPath: "/digit-ui/",
//   },
//   optimization: {
//     // splitChunks: {
//     //   chunks: 'all',
//     //   minSize: 20000,
//     //   maxSize: 50000,
//     //   enforceSizeThreshold: 50000,
//     //   minChunks: 1,
//     //   maxAsyncRequests: 30,
//     //   maxInitialRequests: 30
//     // },
//   },
//   plugins: [
//     new webpack.ProvidePlugin({
//       process: "process/browser",
//     }),
//     new CleanWebpackPlugin(),
//     new HtmlWebpackPlugin({ inject: true, template: "public/index.html" }),
//   ],
//   resolve: {
//     modules: [path.resolve(__dirname, 'src'), 'node_modules'],
//     extensions: ['.js', '.jsx', '.ts', '.tsx'],
//     preferRelative: true, // Try resolving relatively if needed
//     fallback: {
//       process: require.resolve("process/browser"),
//     },
//   },
//   devServer: {
//     static: path.join(__dirname, "dist"), // Change this to "dist"
//     compress: true,
//     port: 3000,
//     hot: true,
//     historyApiFallback: true,
//     proxy: [
//       {
//         context: ["/egov-mdms-service",
//           "/access/v1/actions/mdms",
//           "/tenant-management",
//           "/user-otp",
//           "/egov-mdms-service",
//           "/mdms-v2",
//           "/egov-idgen",
//           "/egov-location",
//           "/localization",
//           "/egov-workflow-v2",
//           "/pgr-services",
//           "/filestore",
//           "/egov-hrms",
//           "/user-otp",
//           "/user",
//           "/fsm",
//           "/billing-service",
//           "/collection-services",
//           "/pdf-service",
//           "/pg-service",
//           "/vehicle",
//           "/vendor",
//           "/property-services",
//           "/fsm-calculator/v1/billingSlab/_search",
//           "/pt-calculator-v2",
//           "/dashboard-analytics",
//           "/echallan-services",
//           "/egov-searcher/bill-genie/mcollectbills/_get",
//           "/egov-searcher/bill-genie/billswithaddranduser/_get",
//           "/egov-searcher/bill-genie/waterbills/_get",
//           "/egov-searcher/bill-genie/seweragebills/_get",
//           "/egov-pdf/download/UC/mcollect-challan",
//           "/egov-hrms/employees/_count",
//           "/tl-services/v1/_create",
//           "/tl-services/v1/_search",
//           "/egov-url-shortening/shortener",
//           "/inbox/v1/_search",
//           "/inbox/v2/_search",
//           "/tl-services",
//           "/tl-calculator",
//           "/org-services",
//           "/edcr",
//           "/hcm-moz-impl",
//           "/bpa-services",
//           "/noc-services",
//           "/egov-user-event",
//           "/egov-document-uploader",
//           "/egov-pdf",
//           "/egov-survey-services",
//           "/ws-services",
//           "/sw-services",
//           "/ws-calculator",
//           "/sw-calculator/",
//           "/audit-service/",
//           "/egov-searcher",
//           "/report",
//           "/inbox/v1/dss/_search",
//           "/loi-service",
//           "/project/v1/",
//           "/estimate-service",
//           "/loi-service",
//           "/works-inbox-service/v2/_search",
//           "/egov-pdf/download/WORKSESTIMATE/estimatepdf",
//           "/muster-roll",
//           "/individual",
//           "/mdms-v2",
//           "/facility/v1/_search",
//           "/project/staff/v1/_create",
//           "/product/v1/_create",
//           "/boundary-service",
//           "/project-factory",
//           "/project-factory/v1/data/_autoGenerateBoundaryCode",
//           "/billing-service/bill/v2/_fetchbill",
//           "/tenant-management",
//           "/default-data-handler",
//           "/facility/v1/_create"
//         ], // Add all endpoints that need to be proxied
//         target: "https://unified-qa.digit.org",
//         changeOrigin: true,
//         secure: false,
//       },
//     ],
// }
// };


const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, 'src/index.js'),
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "automatic" }]
            ],
            plugins: [
              "@babel/plugin-proposal-optional-chaining"
            ]
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
    publicPath: "/digit-ui/",
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
    preferRelative: true,
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
          "/egov-mdms-service",
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
          "/facility/v1/_create"
        ],
        target: "https://unified-qa.digit.org",
        changeOrigin: true,
        secure: false,
      },
    ],
  }
};
