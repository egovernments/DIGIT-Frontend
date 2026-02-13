const path = require("path");
const webpack = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer"); // enable when needed

// Environment-based configuration
const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = !isProduction;

module.exports = {
  mode: isProduction ? "production" : "development",

  entry: "./src/Module.js",

  output: {
    filename: "[name].js", // Use [name] to support multiple entry points
    chunkFilename: "[name].[contenthash:8].chunk.js", // For lazy-loaded chunks
    path: path.resolve(__dirname, "dist"),
    library: {
      name: "@egovernments/digit-ui-module-campaign-manager",
      type: "umd",
    },
    globalObject: "this",
    clean: true,
    publicPath: "auto", // Auto-detect public path for lazy loading
  },

  resolve: {
    extensions: [".js", ".jsx"],
  },

  optimization: {
    usedExports: true,
    sideEffects: false, // Enable tree-shaking
    concatenateModules: isProduction,
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            // Preserve webpackIgnore comments so downstream webpack builds
            // honour them (e.g. @cyntler/react-doc-viewer's pdf.js Node polyfills)
            comments: /^\**!|@preserve|@license|@cc_on|webpackIgnore/i,
          },
        },
        extractComments: false,
      }),
    ],
    runtimeChunk: false, // Keep runtime in main bundle for library compatibility
    splitChunks: {
      chunks: "async", // Only split async chunks (for lazy loading)
      cacheGroups: {
        default: false,
        vendors: false,
        // Only create chunks for lazy-loaded modules
        async: {
          chunks: "async",
          minSize: 20000,
          minChunks: 1,
          priority: 10,
        },
      },
    },
    moduleIds: isProduction ? 'deterministic' : 'named',
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
            plugins: [...(isProduction ? [["transform-remove-console", { exclude: ["error", "warn"] }]] : [])],
          },
        },
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

  devtool: isProduction ? "hidden-source-map" : "cheap-module-source-map", // faster rebuilds in dev

  devServer: isDevelopment
    ? {
        static: {
          directory: path.join(__dirname, "dist"),
        },
        hot: true,
        historyApiFallback: true,
        watchFiles: {
          paths: ["src/**/*"], // watch your source files
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
