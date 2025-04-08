// const path = require("path");
// const webpack = require("webpack");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// // const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// module.exports = {
//   // mode: 'development',
//   entry: "./src/index.js",
//   devtool: "none",
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
//     new webpack.ProvidePlugin({
//       process: "process/browser",
//     }),
//     new CleanWebpackPlugin(),
//     // new BundleAnalyzerPlugin(),
//     new HtmlWebpackPlugin({ inject: true, template: "public/index.html" }),
//   ],
//   resolve: {
//     fallback: {
//       process: require.resolve("process/browser"),
//     },
//   },
// };


const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "production", // Set mode to development
  entry: path.resolve(__dirname, "example/src/index.js"),
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
    fallback: {
      process: require.resolve("process/browser"),
    },
  },
  devServer: {
    static: path.join(__dirname, "build"), // Directory to serve
    compress: true, // Enable compression for better performance
    port: 3000, // Port number for dev server
    hot: true, // Enable Hot Module Replacement (HMR)
    historyApiFallback: true, // Fix for single-page applications using React Router
  }
};
