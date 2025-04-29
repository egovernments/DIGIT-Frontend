const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  entry: "./src/Module.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    library: {
      name: "@egovernments/digit-ui-module-assignment",
      type: "umd",
    },
    globalObject: 'this', // Add this line to ensure compatibility in different environments
  },
  resolve: {
    extensions: [".js"],
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
        //exclude: /node_modules/,
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
      process: "process/browser",
    }),
    // new CleanWebpackPlugin(),
    // new BundleAnalyzerPlugin(),
    // new HtmlWebpackPlugin({ inject: true, template: "public/index.html" }),
  ],
  resolve: {
    fallback: {
      process: require.resolve("process/browser"),
    },
  },
};
