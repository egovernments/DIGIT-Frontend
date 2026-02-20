const path = require("path");
const webpack = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

// Environment-based configuration
const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = !isProduction;

module.exports = {
  mode: isProduction ? "production" : "development",

  entry: "./src/Module.js",

  output: {
    filename: "[name].js",
    chunkFilename: "[name].[contenthash:8].chunk.js",
    path: path.resolve(__dirname, "dist"),
    library: {
      name: "@egovernments/digit-ui-module-health-payments",
      type: "umd",
    },
    globalObject: "this",
    clean: true,
    publicPath: "auto",
  },

  resolve: {
    extensions: [".js", ".jsx"],
  },

  optimization: {
    usedExports: true,
    sideEffects: false,
    concatenateModules: isProduction,
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: /^\**!|@preserve|@license|@cc_on|webpackIgnore/i,
          },
        },
        extractComments: false,
      }),
    ],
    runtimeChunk: false,
    splitChunks: {
      chunks: "async",
      cacheGroups: {
        default: false,
        vendors: false,
        async: {
          chunks: "async",
          minSize: 20000,
          minChunks: 1,
          priority: 10,
        },
      },
    },
    moduleIds: isProduction ? "deterministic" : "named",
  },

  performance: {
    maxAssetSize: 100000,
    maxEntrypointSize: 100000,
    hints: isProduction ? "warning" : false,
  },

  externals: {
    react: "React",
    "react-dom": "ReactDOM",
    "react-router-dom": "react-router-dom",
    "react-i18next": "react-i18next",
    "@tanstack/react-query": "@tanstack/react-query",
    "react-redux": "react-redux",
    redux: "redux",
    "redux-thunk": "redux-thunk",
    "@egovernments/digit-ui-components": "@egovernments/digit-ui-components",
    "@egovernments/digit-ui-react-components": "@egovernments/digit-ui-react-components",
    "@egovernments/digit-ui-libraries": "@egovernments/digit-ui-libraries",
    "@egovernments/digit-ui-svg-components": "@egovernments/digit-ui-svg-components",
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
                  targets: { esmodules: true },
                  modules: false,
                },
              ],
              [
                "@babel/preset-react",
                {
                  runtime: "automatic",
                },
              ],
            ],
            plugins: [...(isProduction ? [["transform-remove-console", { exclude: ["error", "warn"] }]] : [])],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
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

  devtool: isProduction ? "hidden-source-map" : "cheap-module-source-map",

  devServer: isDevelopment
    ? {
        static: {
          directory: path.join(__dirname, "dist"),
        },
        hot: true,
        historyApiFallback: true,
        watchFiles: {
          paths: ["src/**/*"],
          options: {
            ignored: [path.resolve(__dirname, "node_modules"), path.resolve(__dirname, "dist")],
            poll: 1000,
            aggregateTimeout: 300,
          },
        },
      }
    : undefined,

  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
    }),
    ...(isDevelopment ? [new webpack.HotModuleReplacementPlugin()] : []),
    ...(isProduction
      ? [
          new CompressionPlugin({
            algorithm: "brotliCompress",
            test: /\.(js|css|html|svg)$/,
          }),
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
