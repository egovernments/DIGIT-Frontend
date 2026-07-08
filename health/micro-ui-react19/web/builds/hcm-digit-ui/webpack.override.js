// Optimization overrides for workbench build with campaign manager
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      maxSize: 100000, // Aggressive splitting for large modules
      cacheGroups: {
        // Core dependencies
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router)[\\/]/,
          name: 'react-vendor',
          priority: 40,
          enforce: true,
        },
        
        // Campaign manager heavy libs - load on demand
        campaignExcel: {
          test: /[\\/]node_modules[\\/](xlsx|exceljs)[\\/]/,
          name: 'campaign-excel',
          chunks: 'async',
          priority: 30,
          enforce: true,
        },
        
        campaignMaps: {
          test: /[\\/]node_modules[\\/](leaflet|proj4|geojson)[\\/]/,
          name: 'campaign-maps',
          chunks: 'async',
          priority: 30,
          enforce: true,
        },
        
        campaignForms: {
          test: /[\\/]node_modules[\\/](@rjsf|ajv)[\\/]/,
          name: 'campaign-forms',
          chunks: 'async',
          priority: 28,
          enforce: true,
        },
        
        // Load campaign core synchronously
        campaignCore: {
          test: /[\\/]@egovernments[\\/]digit-ui-module-campaign-manager[\\/]/,
          name: 'campaign-core',
          chunks: 'initial',
          priority: 25,
        },
        
        // DIGIT UI libs
        digitUI: {
          test: /[\\/]@egovernments[\\/]digit-ui/,
          name: 'digit-ui',
          priority: 20,
          reuseExistingChunk: true,
        },
        
        // Other vendors
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            // Group small vendors together
            if (['lodash', 'moment', 'date-fns'].includes(packageName)) {
              return 'utils';
            }
            return 'vendors';
          },
          priority: 10,
          maxSize: 80000,
        },
      },
    },
  },
  
  // Add module replacement for development vs production
  plugins: process.env.NODE_ENV === 'production' ? [
    // Replace heavy libraries with lighter alternatives in production
    new webpack.NormalModuleReplacementPlugin(
      /moment[/\\]locale[/\\]/,
      'empty-module' // Don't load all moment locales
    ),
  ] : [],
};