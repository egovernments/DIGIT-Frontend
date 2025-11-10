const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const dotenv = require("dotenv");

// Load package.json to get the homepage/publicPath
const packageJson = require("./package.json");
const publicPath = packageJson.homepage || "/";

// Load .env variables
const envFile = dotenv.config().parsed || {};

// Make DefinePlugin-compatible keys
const envKeys = Object.entries(envFile).reduce((acc, [key, val]) => {
  acc[`process.env.${key}`] = JSON.stringify(val);
  return acc;
}, {});

module.exports = {
  entry: path.resolve(__dirname, "src/index.js"),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: ["@babel/plugin-proposal-optional-chaining"],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
      publicPath: publicPath,
      templateParameters: {
        REACT_APP_GLOBAL: process.env.REACT_APP_GLOBAL || '',
      },
    }),
    new webpack.DefinePlugin(envKeys),
    new webpack.ProvidePlugin({
      process: "process/browser",
      React: "react",
      ReactDOM: "react-dom",
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx"],
    modules: [
      path.resolve(__dirname, "node_modules"),
      "node_modules"
    ],
    alias: {
      "ReactDOM": path.resolve(__dirname, "node_modules/react-dom"),
      "React": path.resolve(__dirname, "node_modules/react"),
      "react": path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
      "react-dom/client": path.resolve(__dirname, "node_modules/react-dom/client.js"),
      "react/jsx-runtime": path.resolve(__dirname, "node_modules/react/jsx-runtime.js"),
      "react-query": require.resolve("@tanstack/react-query"),
      // Add aliases for local packages to ensure proper resolution
      "@egovernments/digit-ui-module-bills": path.resolve(__dirname, "packages/modules/bills/dist/main.js"),
      "@egovernments/digit-ui-module-birth": path.resolve(__dirname, "packages/modules/birth/dist/main.js"),
      "@egovernments/digit-ui-module-death": path.resolve(__dirname, "packages/modules/death/dist/main.js"),
      "@egovernments/digit-ui-module-engagement": path.resolve(__dirname, "packages/modules/engagement/dist/main.js"),
      "@egovernments/digit-ui-module-finance": path.resolve(__dirname, "packages/modules/finance/dist/main.js"),
      "@egovernments/digit-ui-module-firenoc": path.resolve(__dirname, "packages/modules/firenoc/dist/main.js"),
      "@egovernments/digit-ui-module-hrms": path.resolve(__dirname, "packages/modules/hrms/dist/main.js"),
      "@egovernments/digit-ui-module-pgr": path.resolve(__dirname, "packages/modules/pgr/dist/main.js"),
      "@egovernments/digit-ui-module-pt": path.resolve(__dirname, "packages/modules/pt/dist/main.js"),
      "@egovernments/digit-ui-module-receipts": path.resolve(__dirname, "packages/modules/receipts/dist/main.js"),
      "@egovernments/digit-ui-module-tl": path.resolve(__dirname, "packages/modules/tl/dist/main.js"),
      "@egovernments/digit-ui-module-ws": path.resolve(__dirname, "packages/modules/ws/dist/main.js"),
      "@egovernments/digit-ui-health-css": path.resolve(__dirname, "packages/css/dist/index.css"),
    },
    fallback: {
      fs: false,
      path: false,
      crypto: false,
      stream: false,
      buffer: false,
      url: false,
    },
    // Ensure webpack doesn't cache these modules aggressively
    unsafeCache: false,
  },
  output: {
    path: path.resolve(__dirname, "build"),
    clean: true,
    publicPath: publicPath,
  },
};