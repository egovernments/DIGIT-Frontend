const path = require("path");

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
    entry: "./src/index.js",
    output: {
      filename: "main.js", // Predictable filename for libraries
      path: path.resolve(__dirname, "build"),
      library: {
        name: "@egovernments/digit-ui-libraries",
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
      // Redux ecosystem (commonly used with DIGIT)
      'react-redux': 'react-redux',
      'redux': 'redux'
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
                "@babel/plugin-transform-nullish-coalescing-operator"
              ].filter(Boolean),
              // Enable caching for faster builds
              cacheDirectory: true,
            },
          },
        },
        // Handle CSS imports (for libraries that might import CSS)
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        // Handle SCSS/SASS
        {
          test: /\.(scss|sass)$/,
          use: [
            "style-loader",
            "css-loader",
            "sass-loader"
          ],
        },
      ],
    },
    optimization: {
      minimize: isProduction,
      // Libraries package is mainly hooks/utilities - keep as single bundle
      splitChunks: false,
      // Tree shaking optimization
      sideEffects: false,
      usedExports: true,
      // Module concatenation for better performance
      concatenateModules: isProduction,
    },
    performance: {
      hints: isProduction ? 'warning' : false,
      maxEntrypointSize: 250000, // 250kb
      maxAssetSize: 250000,
    },
    // Development server config (for yarn start)
    devServer: isProduction ? undefined : {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: true,
      port: 3001,
      hot: true,
      open: false, // Don't auto-open browser for library development
    },
  };
};