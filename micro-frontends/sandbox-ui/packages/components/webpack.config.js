const path = require("path");

module.exports = {
  mode: "development", // Use "development" for faster rebuilds in watch mode
  entry: "./src/index.js",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    library: {
      name: "componentsLib",
      type: "umd",
    },
    globalObject: 'this',
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'React',
      root: 'React',
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
};
