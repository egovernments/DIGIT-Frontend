const path = require("path");
const webpack = require("webpack");

// Environment-based configuration
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: "./src/Module.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    library: {
      name: "@egovernments/digit-ui-module-workbench",
      type: "umd",
    },
    globalObject: 'this',
    clean: true,
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  // Production optimizations
  optimization: {
    usedExports: true,
    sideEffects: false,
    concatenateModules: isProduction,
    minimize: isProduction,
    // Performance budget for core module
    splitChunks: false, // Single bundle for UMD
  },
  // Performance monitoring
  performance: {
    maxAssetSize: 100000, // 100KB for workbench module
    maxEntrypointSize: 100000,
    hints: isProduction ? 'warning' : false,
  },
  externals: {
    // Core React ecosystem
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
    'react-router-dom': 'react-router-dom',
    'react-i18next': 'react-i18next',
    "@tanstack/react-query": "@tanstack/react-query",
    // Redux ecosystem
    'react-redux': 'react-redux',
    'redux': 'redux',
    'redux-thunk': 'redux-thunk',
    // DIGIT UI cross-dependencies
    '@egovernments/digit-ui-components': '@egovernments/digit-ui-components',
    '@egovernments/digit-ui-react-components': '@egovernments/digit-ui-react-components',
    '@egovernments/digit-ui-libraries': '@egovernments/digit-ui-libraries',
    '@egovernments/digit-ui-svg-components': '@egovernments/digit-ui-svg-components',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            // Enable caching for faster rebuilds
            cacheDirectory: true,
            cacheCompression: false,
            presets: [
              [
                "@babel/preset-env",
                {
                  // Modern browser targets
                  targets: "> 1%, last 2 versions, not ie <= 8",
                  useBuiltIns: "usage",
                  corejs: 3,
                  modules: false, // Let webpack handle modules
                }
              ],
              [
                "@babel/preset-react",
                {
                  // Modern JSX transform (React 17+ feature)
                  runtime: "automatic"
                }
              ]
            ],
            plugins: [
              // Remove console logs in production
              ...(isProduction ? [["transform-remove-console", { "exclude": ["error", "warn"] }]] : [])
            ]
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                auto: true,
                localIdentName: isDevelopment ? '[name]__[local]--[hash:base64:5]' : '[hash:base64:5]'
              }
            }
          }
        ],
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: {
                auto: true,
                localIdentName: isDevelopment ? '[name]__[local]--[hash:base64:5]' : '[hash:base64:5]'
              }
            }
          },
          'sass-loader'
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[hash][ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash][ext]'
        }
      }
    ],
  },
  // Source maps configuration
  devtool: isProduction ? 'source-map' : 'eval-source-map',
  
  // Development server configuration
  devServer: isDevelopment ? {
    port: 3006,
    hot: true,
    open: false,
    historyApiFallback: true,
    compress: true,
  } : undefined,
  
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    ...(isDevelopment ? [new webpack.HotModuleReplacementPlugin()] : [])
  ],
  
  // Build statistics
  stats: {
    errorDetails: true,
    children: false,
    modules: false,
    entrypoints: false,
  }
};
