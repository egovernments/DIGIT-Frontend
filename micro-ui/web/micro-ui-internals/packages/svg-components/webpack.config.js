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
        name: "@egovernments/digit-ui-svg-components",
        type: "umd",
      },
      globalObject: 'this',
      clean: true, // Clean build folder before each build
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
      }
      // SVG components typically don't need router/state management externals
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
                  useBuiltIns: false // Disable core-js polyfills for SVG components
                }],
                ["@babel/preset-react", {
                  runtime: "automatic" // Use new JSX transform
                }]
              ],
              plugins: [
                "@babel/plugin-transform-optional-chaining",
                "@babel/plugin-transform-nullish-coalescing-operator",
                // Removed babel-plugin-transform-remove-console for stability
              ].filter(Boolean),
              // Enable caching for faster builds
              cacheDirectory: true,
            },
          },
        },
        // Handle CSS imports (minimal for SVG components)
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    optimization: {
      minimize: isProduction,
      // Don't split chunks for libraries - keep as single bundle
      splitChunks: false,
      // Tree shaking optimization (especially important for SVG libraries)
      sideEffects: false,
      usedExports: true,
      // Module concatenation for better performance
      concatenateModules: isProduction,
    },
    performance: {
      hints: isProduction ? 'warning' : false,
      maxEntrypointSize: 200000, // 200kb for SVG library
      maxAssetSize: 200000,
    },
    // Development server config (for yarn start)
    devServer: isProduction ? undefined : {
      static: {
        directory: path.join(__dirname, 'build'),
      },
      compress: true,
      port: 3003,
      hot: true,
      open: false, // Don't auto-open browser for library development
    },
  };
};