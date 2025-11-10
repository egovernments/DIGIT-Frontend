const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const fs = require("fs");

const { name, version, author } = JSON.parse(fs.readFileSync("package.json", "utf8"));
const isDevelopment = process.env.NODE_ENV !== "production"; // Variable for cleaner code

const header = `
@charset "UTF-8";
/*!
 * ${name} - ${version}
 *
 * Copyright (c) ${new Date().getFullYear()} ${author}
 */
`;

module.exports = {
  mode: isDevelopment ? "development" : "production", // Using isDevelopment variable

  entry: {
    styles: "./src/index.scss",
  },

  output: {
    path: path.resolve(__dirname, "dist"), //  Always use 'dist'
    // filename: "[name].js" - not needed since we only output CSS
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { importLoaders: 1 },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: require("./postcss.config"),
            },
          },
          "sass-loader",
        ],
      },
    ],
  },

  optimization: {
    minimize: !isDevelopment, // Using isDevelopment variable
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "index.css",
    }),
    {
      apply: (compiler) => {
        compiler.hooks.emit.tap("AddHeaderPlugin", (compilation) => {
          for (const name in compilation.assets) {
            if (name.endsWith(".css")) {
              const source = compilation.assets[name].source();
              compilation.assets[name] = {
                source: () => header + source,
                size: () => Buffer.byteLength(header + source, "utf8"),
              };
            }
          }
        });
      },
    },
  ],

  // Watch configuration for --watch mode
  watch: isDevelopment && process.argv.includes("--watch"),
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /node_modules/,
  },

  // REMOVED  :Entire devServer configuration
  // devServer: {
  //   static: path.resolve(__dirname, "example"),
  //   hot: true,
  //   port: 3000,
  //   open: true,
  //   watchFiles: ["src/**/*.scss"],
  // },
};