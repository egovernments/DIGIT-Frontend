# Changelog

## [1.8.18-rc-test-03] [22-Aug-2025]
- Fixed Node.js 17+ OpenSSL compatibility issues with --openssl-legacy-provider flag
- Updated core-js to v3.38.1 to resolve security and performance issues
- Removed deprecated babel-preset-react dependency causing core-js@2 conflicts
- Enhanced build scripts for Node.js 18+ compatibility
- Eliminated "digital envelope routines::unsupported" errors

## [1.8.18-rc-test-02] [22-Aug-2025]
- Fixed deprecated Babel plugin names (proposal → transform)
- Replaced @babel/plugin-proposal-optional-chaining with @babel/plugin-transform-optional-chaining
- Replaced @babel/plugin-proposal-nullish-coalescing-operator with @babel/plugin-transform-nullish-coalescing-operator
- Removed invalid cacheCompression option from Babel configuration
- Updated package dependencies with maintained plugin versions
- All webpack configurations validated and working

## [1.8.18-rc-test-01] [22-Aug-2025]
- Major webpack optimization for production-ready library builds
- Enhanced Babel configuration with modern JSX transform and smart polyfills
- Added advanced tree-shaking with sideEffects: false and module concatenation
- Implemented performance budgets (250KB limit) and bundle size monitoring
- Added comprehensive externals for Redux ecosystem to prevent duplicates
- Enabled build caching for 20-30% faster rebuild times
- Console removal in production builds (preserving error/warn)
- Added bundle analysis command: yarn build:analyze
- Optimized development server with HMR on port 3001
- Added CSS/SCSS support with proper asset handling

## [1.8.17-rc19.01] [27-Jun-2025]
- libraries(1.8.17) from develop Upgraded to react19
- webpack for build
- npm packages upgraded and syntax changed to make them react19 compatible
- react, react-dom, react-router-dom and @tanstack/react-query are in peer dependencies now to avoid version conflict

## [1.8.16]  [20-Jun-2025]
- Checking the new version due to corrupted local


## [1.8.15]  [16-Jun-2025]
- provided download of alll data per schema & enable based on flag
- provided download of alll data per schema 'ENABLE_MDMS_BULK_DOWNLOAD'

## [1.8.14]  [10-Jun-2025]
- integrated with updated version

## [1.8.13]  [25-Apr-2025]
- Updated Custom mutation hook and usecutsomAPI hook to handle header and method in request.

## [1.8.11]  [11-Mar-2025]
- Added new function to remove localisation cache

## [1.8.10]  [21-Feb-2025]
- Publishing a new version for more stability & as part of Components Release

## [1.8.9]  [1-Feb-2025]
- FEATURE/HCMPRE-1425 : Added the workbench module patches and Updated localisation search screen, and core module #2181
- Upgraded with new Components in core, workbench screens

## [1.8.8]  [21-Jan-2025]
- Removed support for any new context path to have employee linked in the url.To use this,the new context path should be linked with employee. 

## [1.8.5]  [26-Nov-2024]
- added new field util to generate field id

## [1.8.4] [19-Nov-2024]
- Fixed the module stablity & new components integrated, sandbox enabled 

## [1.8.3]
- 

## [1.8.2-beta.7]
- Added select function support for mdms-v2 in useCustomMDMS hook

## [1.8.2-beta.1]
- Formatted changelog file.

## [1.8.1-beta.4]
- Enhanced to load screen even if mdms is failing

## [1.8.1-beta.3]
- other fixes.

## [1.8.1-beta.2]
- Enhanced `useCustomMdms` hook to support version 2 of MDMS API calls.

## [1.8.1-beta.1]
- Added the README file.

## [1.5.23]
- Base version.
