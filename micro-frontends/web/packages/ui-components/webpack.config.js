const path = require("path");

module.exports = {
  mode: "production", // Set to "development" for development mode
  entry: "./src/index.js", // Entry point of your library
  output: {
    filename: "main.js", // Output file name
    path: path.resolve(__dirname, "dist"), // Output directory
    library: {
      name: "@digit-ui/digit-ui-react-components",
      type: "umd",
    },
  },
  resolve: {
    extensions: [".js"],
  },
  externals: {
    // Define any external dependencies here
    'react': 'react',
    'react-dom': 'react-dom',
    'react-i18next': 'react-i18next',
    'react-router-dom': 'react-router-dom'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader", // Use Babel for JavaScript transpilation
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
};
