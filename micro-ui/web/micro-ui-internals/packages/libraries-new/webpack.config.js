const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: './src/index.js',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'DigitUILibrariesNew',
    libraryTarget: 'umd',
    clean: true,
  },

  externals: {
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
    }
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
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: ['node_modules']
  },

  devtool: isDevelopment ? 'inline-source-map' : 'source-map',

  optimization: {
    sideEffects: false,
    usedExports: true,
    concatenateModules: isProduction,
  },

  performance: {
    maxAssetSize: 250000,
    maxEntrypointSize: 250000,
    hints: isProduction ? 'warning' : false
  }
};