const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: './src/Module.js',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    library: 'DigitUiModuleCoreNew',
    libraryTarget: 'umd',
    clean: true,
  },

  externals: {
    // Core React ecosystem
    'react': {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'React'
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom',
      root: 'ReactDOM'
    },
    'react-router-dom': {
      commonjs: 'react-router-dom',
      commonjs2: 'react-router-dom',
      amd: 'react-router-dom',
      root: 'ReactRouterDOM'
    },
    'react-i18next': {
      commonjs: 'react-i18next',
      commonjs2: 'react-i18next',
      amd: 'react-i18next',
      root: 'ReactI18next'
    },
    '@tanstack/react-query': {
      commonjs: '@tanstack/react-query',
      commonjs2: '@tanstack/react-query',
      amd: '@tanstack/react-query',
      root: 'ReactQuery'
    },
    // DIGIT UI components
    '@egovernments/digit-ui-components': {
      commonjs: '@egovernments/digit-ui-components',
      commonjs2: '@egovernments/digit-ui-components',
      amd: '@egovernments/digit-ui-components',
      root: 'DigitUIComponents'
    },
    '@egovernments/digit-ui-svg-components': {
      commonjs: '@egovernments/digit-ui-svg-components',
      commonjs2: '@egovernments/digit-ui-svg-components',
      amd: '@egovernments/digit-ui-svg-components',
      root: 'DigitUISVGComponents'
    },
    // Note: '@egovernments/digit-ui-libraries-new' is NOT externalized because 
    // the core module needs to bundle the libraries as they're internal dependencies
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            cacheCompression: false,
            presets: [
              ['@babel/preset-env', {
                useBuiltIns: 'usage',
                corejs: 3,
                targets: '> 1%, last 2 versions, not ie <= 8'
              }],
              ['@babel/preset-react', {
                runtime: 'automatic'
              }]
            ],
            plugins: isProduction ? [
              'babel-plugin-transform-remove-console'
            ] : []
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: isDevelopment 
                  ? '[name]__[local]__[hash:base64:5]'
                  : '[hash:base64:5]'
              }
            }
          },
          'sass-loader'
        ]
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
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: ['node_modules'],
    symlinks: true,
    alias: {
      // Resolve symlinked libraries package
      '@egovernments/digit-ui-libraries-new': path.resolve(__dirname, '../../libraries-new/src/index.js')
    }
  },

  devtool: isDevelopment ? 'inline-source-map' : 'source-map',

  devServer: {
    static: {
      directory: path.join(__dirname, 'dist')
    },
    compress: true,
    port: 3010,
    hot: true,
    open: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  },

  optimization: {
    sideEffects: false,
    usedExports: true,
    concatenateModules: isProduction,
  },

  performance: {
    maxAssetSize: 300000, // 300KB
    maxEntrypointSize: 300000, // 300KB
    hints: isProduction ? 'warning' : false
  }
};