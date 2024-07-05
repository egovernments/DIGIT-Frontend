const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index',
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        oneOf: [
          {
            test: /\.tw\.css$/i,
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                  importLoaders: 1,
                  modules: {
                    auto: true,
                    localIdentName: false
                      ? '[hash:base64]'
                      : '[path][name]__[local]',
                  },
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: true,
                  postcssOptions: {
                    plugins: {
                      tailwindcss: {},
                      autoprefixer: {},
                      'postcss-prefixer': {
                        prefix: 'cr-',
                      },
                    },
                  },
                },
              },
            ],
          },
          {
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                  importLoaders: 1,
                  modules: {
                    auto: true,
                    localIdentName: false
                      ? '[hash:base64]'
                      : '[path][name]__[local]',
                  },
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: true,
                  postcssOptions: {
                    plugins: {
                      tailwindcss: {},
                      autoprefixer: {},
                    },
                  },
                },
              },
            ],
          },
        ],
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
  plugins: [],
};