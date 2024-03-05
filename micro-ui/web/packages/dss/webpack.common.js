const path = require("path");

module.exports = {
  entry: "./src/SingleSpaEntry",
  resolve: {
    extensions: [".js", ".jsx"],
    modules: [path.resolve(__dirname, "src"), "node_modules"],
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
