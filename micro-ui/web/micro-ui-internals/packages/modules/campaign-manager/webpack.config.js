const path = require("path");
const webpack = require("webpack");
const isProduction = process.env.NODE_ENV === 'production';


module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: "./src/Module.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    library: {
      name: "@egovernments/digit-ui-module-campaign-manager",
      type: "umd",
    },
    globalObject: 'this', // Ensures compatibility in Node and browser environments
  },
  resolve: {
    extensions: [".js"],
    fallback: {
      process: require.resolve("process/browser.js"), // Polyfill for 'process'
    },
  },
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'React',
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom',
      root: 'ReactDOM',
    },
    'react-i18next': 'react-i18next',
    'react-router-dom': 'react-router-dom',
    "@tanstack/react-query": "@tanstack/react-query"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser.js",
    }),
  ],
};
