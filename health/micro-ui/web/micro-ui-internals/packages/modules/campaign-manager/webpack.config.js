const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  entry: "./src/Module.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    library: "@egovernments/digit-ui-module-campaign-manager",
    libraryTarget: "umd", // This replaces the object with name + type
    globalObject: "this", // Ensures compatibility in Node and browser environments
  },
  resolve: {
    extensions: [".js"],
    alias: {
      process: "process/browser.js" // replace fallback with alias
    }
  },
  externals: {
    react: {
      commonjs: "react",
      commonjs2: "react",
      amd: "react",
      root: "React"
    },
    "react-dom": {
      commonjs: "react-dom",
      commonjs2: "react-dom",
      amd: "react-dom",
      root: "ReactDOM"
    },
    "react-i18next": "react-i18next",
    "react-router-dom": "react-router-dom",
    "@tanstack/react-query": "@tanstack/react-query"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"]
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser.js"
    })
  ]
};
