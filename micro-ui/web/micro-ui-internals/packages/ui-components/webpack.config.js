const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    library: {
      name: "@egovernments/digit-ui-components",
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
    // Add react-datepicker to externals if you want it to be consumed by the host application
    // and not bundled with your ui-components. This is common for UI libraries.
    // However, if your ui-components directly uses DatePicker internally and needs its CSS
    // bundled, then keep it out of externals.
    // 'react-datepicker': 'react-datepicker', // <--- Consider adding this if it's an external dependency of the consumer app
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
