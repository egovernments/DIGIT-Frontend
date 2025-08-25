const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer"); // enable when needed

// Environment-based configuration
const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = !isProduction;

module.exports = {
  mode: isProduction ? "production" : "development",

  entry: "./src/Module.js",

  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    library: {
      name: "@egovernments/digit-ui-module-workbench",
      type: "umd",
    },
    globalObject: "this",
    clean: true,
  },

  resolve: {
    extensions: [".js", ".jsx"],
  },
  optimization: {
    usedExports: true,
    sideEffects: true, // safer than false
    concatenateModules: isProduction,
    minimize: isProduction,
    runtimeChunk: false, // Disable runtime chunk for library builds
    splitChunks: false, // Disable code splitting for library builds
  },

  performance: {
    maxAssetSize: 100000, // raise a bit since React 19 is heavier
    maxEntrypointSize: 100000,
    hints: isProduction ? "warning" : false,
  },

  externals: {
    // Core React ecosystem
    react: "React",
    "react-dom": "ReactDOM",
    "react-router-dom": "react-router-dom",
    "react-i18next": "react-i18next",
    "@tanstack/react-query": "@tanstack/react-query",
    // Redux ecosystem
    "react-redux": "react-redux",
    redux: "redux",
    "redux-thunk": "redux-thunk",
    // DIGIT UI cross-dependencies
    "@egovernments/digit-ui-components": "@egovernments/digit-ui-components",
    "@egovernments/digit-ui-react-components":
      "@egovernments/digit-ui-react-components",
    "@egovernments/digit-ui-libraries": "@egovernments/digit-ui-libraries",
    "@egovernments/digit-ui-svg-components":
      "@egovernments/digit-ui-svg-components",
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            cacheCompression: false,
            presets: [
              [
                "@babel/preset-env",
                {
                  // Modern browser targets (React 19 requires modern browsers)
                  targets: { esmodules: true },
                  modules: false,
                },
              ],
              [
                "@babel/preset-react",
                {
                  runtime: "automatic", // React 17+ JSX transform
                },
              ],
            ],
            plugins: [
              ...(isProduction
                ? [["transform-remove-console", { exclude: ["error", "warn"] }]]
                : []),
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: {
                auto: true,
                localIdentName: isDevelopment
                  ? "[name]__[local]--[hash:base64:5]"
                  : "[hash:base64:5]",
              },
            },
          },
        ],
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
              modules: {
                auto: true,
                localIdentName: isDevelopment
                  ? "[name]__[local]--[hash:base64:5]"
                  : "[hash:base64:5]",
              },
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // inline small images
          },
        },
        generator: {
          filename: "images/[name].[hash][ext]",
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name].[hash][ext]",
        },
      },
    ],
  },

  devtool: isProduction
    ? "hidden-source-map"
    : "cheap-module-source-map", // faster rebuilds in dev

  devServer: isDevelopment
    ? {
        port: 3006,
        hot: true,
        open: false,
        historyApiFallback: true,
        compress: true,
      }
    : undefined,

  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "development"
      ),
    }),
    ...(isDevelopment ? [new webpack.HotModuleReplacementPlugin()] : []),
    ...(isProduction
      ? [
          new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css",
          }),
          new CompressionPlugin({
            algorithm: "brotliCompress", // or gzip
            test: /\.(js|css|html|svg)$/,
          }),
          // new BundleAnalyzerPlugin(), // enable when debugging bundle size
        ]
      : []),
  ],

  stats: {
    errorDetails: true,
    children: false,
    modules: false,
    entrypoints: false,
  },
};
