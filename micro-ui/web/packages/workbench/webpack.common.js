const path = require("path");

module.exports = {
  entry: "./src/index",
  resolve: {
    extensions: [ ".js", ".jsx"],
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
        test: /\.css$/i,
        include: path.resolve(__dirname, 'src'),
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [],
};
