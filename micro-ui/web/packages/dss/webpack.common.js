const path = require("path");

module.exports = {
  entry: "./src/SingleSpaEntry",
  resolve: {
    extensions: [".js", ".jsx"],
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    alias: {
      'react-i18next': require.resolve('react-i18next'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react"],
        },
      },
      {
      test: /\.svg$/,
      use: 'file-loader',
      },
    ],
  },
  plugins: [],
};
