const path = require("path");

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
    entry: "./src/index.js",
    output: {
      filename: "main.js", // Predictable filename for libraries
      path: path.resolve(__dirname, "dist"),
      library: {
        name: "@egovernments/digit-ui-components",
        type: "umd",
      },
      globalObject: 'this',
      clean: true, // Clean dist folder before each build
    },
    resolve: {
      extensions: [".js", ".jsx"],
      // Add module resolution optimization
      modules: [path.resolve(__dirname, "src"), "node_modules"],
    },
    externals: {
      // Core React ecosystem - should be provided by consumer
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
      // Router and state management
      'react-router-dom': 'react-router-dom',
      'react-i18next': 'react-i18next',
      "@tanstack/react-query": "@tanstack/react-query",
      // UI library dependencies
      '@egovernments/digit-ui-libraries': '@egovernments/digit-ui-libraries',
      '@egovernments/digit-ui-svg-components': '@egovernments/digit-ui-svg-components',
      // Form libraries that consumers might provide
      'react-hook-form': 'react-hook-form',
      // Date picker should be externalized to prevent version conflicts
      'react-datepicker': 'react-datepicker'
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                ["@babel/preset-env", {
                  targets: {
                    browsers: ["> 1%", "last 2 versions", "not ie <= 8"]
                  },
                  modules: false, // Let webpack handle modules
                  useBuiltIns: "usage",
                  corejs: 3
                }],
                ["@babel/preset-react", {
                  runtime: "automatic" // Use new JSX transform
                }]
              ],
              plugins: [
                "@babel/plugin-transform-optional-chaining",
                "@babel/plugin-transform-nullish-coalescing-operator",
                isProduction && ["babel-plugin-transform-remove-console", { "exclude": ["error", "warn"] }]
              ].filter(Boolean),
              // Enable caching for faster builds
              cacheDirectory: true,
            },
          },
        },
        // Handle CSS imports (important for UI components)
        {
          test: /\.css$/,
          use: [
            "style-loader", 
            {
              loader: "css-loader",
              options: {
                modules: {
                  auto: true, // Enable CSS modules for .module.css files
                },
              },
            }
          ],
        },
        // Handle SCSS/SASS
        {
          test: /\.(scss|sass)$/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: {
                  auto: true,
                },
              },
            },
            "sass-loader"
          ],
        },
        // Handle fonts and assets
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          type: 'asset/resource',
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/,
          type: 'asset/resource',
        },
      ],
    },
    optimization: {
      minimize: isProduction,
      // Enable code splitting for heavy UI components
      splitChunks: {
        chunks: 'async',
        minSize: 20000,
        cacheGroups: {
          // Group heavy UI components
          heavyComponents: {
            test: /[\\/]node_modules[\\/](react-webcam|react-lottie|react-data-table-component|react-select)[\\/]/,
            name: 'heavy-components',
            priority: 10,
            chunks: 'async'
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            chunks: 'async'
          }
        }
      },
      // Tree shaking optimization
      sideEffects: false,
      usedExports: true,
      // Module concatenation for better performance
      concatenateModules: isProduction,
    },
    performance: {
      hints: isProduction ? 'warning' : false,
      maxEntrypointSize: 750000, // 750kb for full UI component library
      maxAssetSize: 750000,
    },
    // Development server config (for yarn start)
    devServer: isProduction ? undefined : {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: true,
      port: 3004,
      hot: true,
      open: false, // Don't auto-open browser for library development
    },
  };
};