const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

// Load package.json to get the homepage/publicPath
const packageJson = require("./package.json");
const publicPath = packageJson.homepage || "/";

module.exports = merge(common, {
  mode: "production",
  devtool: false,
  
  output: {
    filename: "[name].[contenthash:8].bundle.js",
    chunkFilename: "[name].[contenthash:8].chunk.js",
    publicPath: publicPath,
  },
  
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
    new CompressionPlugin({
      algorithm: "gzip",
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
    process.env.ANALYZE && new BundleAnalyzerPlugin({
      analyzerMode: "static",
      openAnalyzer: false,
      reportFilename: "bundle-report.html",
    }),
  ].filter(Boolean),
  
  optimization: {
    minimize: true,
    usedExports: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
            drop_console: true,
            drop_debugger: true,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
        parallel: true,
      }),
    ],
    moduleIds: "deterministic",
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all",
      maxInitialRequests: 25,
      minSize: 20000,
      cacheGroups: {
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/,
          name: "react",
          priority: 40,
        },
        // The shared DIGIT libraries. src/index.js imports digit-ui-libraries at the
        // top of the file, so this group has to load before anything can render.
        digitUIShared: {
          test: /[\\/]node_modules[\\/]@egovernments[\\/](digit-ui-libraries|digit-ui-components|digit-ui-react-components|digit-ui-svg-components)[\\/]/,
          name: "digit-ui",
          priority: 35,
          reuseExistingChunk: true,
        },
        // The feature modules. src/index.js already loads these with import(), so they
        // belong in a separate file that downloads after the first paint.
        //
        // These used to share one "digit-ui" name with the group above. Because webpack
        // puts everything with the same name into one chunk, and the group above must
        // load first, these got pulled in with it - which quietly cancelled the import()
        // in src/index.js. workbench alone is ~3.8 MB and was loading on every page.
        // Keeping them separate, with chunks "async", lets the import() work as intended.
        digitUIModules: {
          test: /[\\/]node_modules[\\/]@egovernments[\\/](digit-ui-module-core|digit-ui-module-workbench)[\\/]/,
          name: "digit-ui-modules",
          chunks: "async",
          priority: 36,
          reuseExistingChunk: true,
        },
        // NOTE: the three groups below currently match nothing, so they have no effect.
        // xlsx is listed in webpack.common.js "externals", and leaflet / proj4 / @rjsf /
        // ajv / exceljs are bundled inside packages/modules/campaign-manager/dist/main.js
        // rather than installed here. None of them reach this build as node_modules.
        // Leaving them in place: they are harmless, and they become useful again if any
        // of these libraries is ever imported directly by this app.
        excel: {
          test: /[\\/]node_modules[\\/](xlsx|exceljs)[\\/]/,
          name: "excel-libs",
          chunks: "async",
          priority: 45,
          enforce: true,
        },
        maps: {
          test: /[\\/]node_modules[\\/](leaflet|proj4|geojson)[\\/]/,
          name: "map-libs",
          chunks: "async",
          priority: 45,
          enforce: true,
        },
        forms: {
          test: /[\\/]node_modules[\\/](@rjsf|ajv)[\\/]/,
          name: "form-libs",
          chunks: "async",
          priority: 43,
          enforce: true,
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return `vendors-${packageName.replace("@", "")}`;
          },
          priority: 20,
        },
        common: {
          minChunks: 2,
          priority: -10,
          reuseExistingChunk: true,
        },
      },
    },
  },
  
  performance: {
    hints: "warning",
    maxAssetSize: 512000,
    maxEntrypointSize: 512000,
  },
});