# Changelog

## [1.0.22-rc-test-03] [22-Aug-2025]
- Fixed Node.js 17+ OpenSSL compatibility issues with --openssl-legacy-provider flag
- Updated core-js to v3.38.1 to resolve security and performance issues
- Enhanced build scripts for Node.js 18+ compatibility
- Eliminated "digital envelope routines::unsupported" errors
- Optimized SVG component build process

## [1.0.22-rc-test-02] [22-Aug-2025]
- Fixed deprecated Babel plugin names (proposal → transform)
- Replaced @babel/plugin-proposal-optional-chaining with @babel/plugin-transform-optional-chaining
- Replaced @babel/plugin-proposal-nullish-coalescing-operator with @babel/plugin-transform-nullish-coalescing-operator
- Removed invalid cacheCompression option from Babel configuration
- Updated package dependencies with maintained plugin versions
- All webpack configurations validated and working

## [1.0.22-rc-test-01] [22-Aug-2025]
- Optimized webpack configuration for efficient SVG icon library
- Enhanced tree-shaking with sideEffects: false for maximum unused icon elimination
- Modern Babel configuration with automatic JSX transform
- Performance budget set to 200KB for lightweight icon distribution
- Added build caching for faster development iterations
- Console removal in production builds (preserving error/warn)
- Added bundle analysis command: yarn build:analyze
- Optimized dev server with HMR on port 3003
- Streamlined externals (React ecosystem only) for minimal overhead

## [1.0.21-rc19.01] [27-Jun-2025]
- svg-components(1.0.21) from develop Upgraded to react19
- webpack for build
- npm packages upgraded and syntax changed to make them react19 compatible
- react and react-dom are in peer dependencies now to avoid version conflict

## [1.0.18]  [13-May-2025]
- Added UploadCloud and ListAltCheck icons

## [1.0.17]  [30-April-2025]
- Added OutpatientMed and AdUnits icons

## [1.0.15]  [21-Feb-2025]
- Publishing a new version for more stability & as part of Components Release

## [1.0.11]
- Added Profile,Add,File Icons.

## [1.0.9]
- Fixed icons for Church, Health Facility, School Building, and Warehouses.

## [1.0.8]
- Added icons for Church, Health Facility, School Building, and Warehouses.

## [1.0.7]
- Added NorthArrow and MapLayerIcon icons.

## [1.0.6]
- Used a new Primary constant color "#c84c0e".

## [1.0.5]
- Added Pagination icons.
- Fixed Population and Facility icons.

## [1.0.4]
- Fixed Excel icon.

## [1.0.3]
- Fixed and added Microplanning module icons.

## [1.0.2]
- Added Trash Icon.

## [1.0.1]
- Added icons from Microplanning module.

## [1.0.0]
- Released as part of Workbench v1.0.

## [1.0.0-beta]
- Workbench base version beta release.

## [0.0.8]
- Added RoundedCheck Icon and DeleteBtn icon with stories.

## [0.0.7]
- Added Info banner icon.

## [0.0.6]
- Added TickMark and Success SVG.
- Fixed publish related issue.

## [0.0.5]
- Fixed publish related issue.

## [0.0.4]
- Fixed some fill related issues.

## [0.0.3]
- Added NoResultsFound icon, StarFilled, and Star Empty icons.
- Fixed issue on NoResultsFound icon.

## [0.0.2]
- Added the prototypes and playground stories for all SVGs.

## [0.0.1]
- Base version.
