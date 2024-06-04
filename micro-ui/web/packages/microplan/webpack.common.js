const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");


module.exports = {
  entry: "./src/index",
  resolve: {
    extensions: [ ".js", ".jsx"],
  modules: [path.resolve(__dirname, "src"), "node_modules"],
    alias: {
      'react-i18next': require.resolve('react-i18next'),
      '@digit-ui/digit-ui-components': path.resolve(__dirname, '../components/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/, // Test for .css files
        use: [
          'style-loader', // Injects styles into DOM
          'css-loader'    // Turns CSS into CommonJS
        ]
      },
      {
        test: /\.js?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react"],
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
