const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv');

// Load .env variables
const envFile = dotenv.config().parsed || {};

// Make DefinePlugin-compatible keys
const envKeys = Object.entries(envFile).reduce((acc, [key, val]) => {
  acc[`process.env.${key}`] = JSON.stringify(val);
  return acc;
}, {});

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                useBuiltIns: 'usage',
                corejs: 3
              }],
              ['@babel/preset-react', {
                runtime: 'automatic'
              }]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.s[ac]ss$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@egovernments/digit-ui-libraries-new': path.resolve(__dirname, '../packages/libraries-new/src'),
      '@egovernments/digit-ui-module-core-new': path.resolve(__dirname, '../packages/modules/core-new/src'),
      '@egovernments/digit-ui-module-workbench-new': path.resolve(__dirname, '../packages/modules/workbench-new/src'),
      // Ensure single React instance
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      '@tanstack/react-query': path.resolve(__dirname, 'node_modules/@tanstack/react-query')
    }
  },
  plugins: [
    new webpack.DefinePlugin(envKeys),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      templateParameters: {
        REACT_APP_GLOBAL: envFile.REACT_APP_GLOBAL || ''
      }
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public')
    },
    compress: true,
    port: 3010,
    open: true,
    hot: true,
    historyApiFallback: true,
    proxy: [
      {
        context: [
          "/egov-mdms-service",
          "/access/v1/actions/mdms",
          "/tenant-management",
          "/user-otp",
          "/mdms-v2",
          "/egov-idgen",
          "/egov-location",
          "/localization",
          "/egov-workflow-v2",
          "/pgr-services",
          "/filestore",
          "/egov-hrms",
          "/user",
          "/fsm",
          "/billing-service",
          "/collection-services",
          "/pdf-service",
          "/pg-service",
          "/vehicle",
          "/vendor",
          "/property-services",
          "/pt-calculator-v2",
          "/dashboard-analytics",
          "/echallan-services",
          "/egov-searcher",
          "/egov-pdf",
          "/tl-services",
          "/tl-calculator",
          "/org-services",
          "/edcr",
          "/hcm-moz-impl",
          "/bpa-services",
          "/noc-services",
          "/egov-user-event",
          "/egov-document-uploader",
          "/egov-survey-services",
          "/ws-services",
          "/sw-services",
          "/ws-calculator",
          "/sw-calculator/",
          "/audit-service/",
          "/report",
          "/inbox",
          "/loi-service",
          "/project/v1/",
          "/estimate-service",
          "/muster-roll",
          "/individual",
          "/facility/v1/_search",
          "/project/staff/v1/_create",
          "/product/v1/_create",
          "/boundary-service",
          "/project-factory",
          "/default-data-handler"
        ],
        target: envFile.REACT_APP_PROXY_API || 'https://hcm-demo.digit.org',
        changeOrigin: true,
        secure: false,
      },
    ]
  }
};