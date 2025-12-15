# Changelog

## [1.9.3] [15-December-2025]

### 🔧 Validation Pattern Enhancements:

#### 📱 Mobile Number Validation Improvements:
- **Simplified MDMS Pattern Retrieval**: Enhanced `getPattern()` function for mobile number validation
  - Removed verbose console logging for production readiness
  - Streamlined MDMS pattern retrieval logic
  - Silent fallback to default pattern if MDMS not available
  - Better error handling with try-catch for robustness

#### ✅ Regex Pattern Fixes:
- **Name Pattern**: Fixed invalid regex characters in Name validation
  - Old: `/^[^{0-9}^\$\"<>?\\\\~!@#$%^()+={}\[\]*,/_:;""'']{1,50}$/i`
  - New: `/^[^0-9\$\"<>?\\~!@#$%^()+={}\[\]*,/_:;]{1,50}$/i`
  - Removed: `{0-9}` → `0-9`, extra `^`, double escapes `\\\\` → `\\`, smart quotes

- **Address Pattern**: Fixed invalid regex characters in Address validation
  - Old: `/^[^\$\"<>?\\\\~\`!@$%^()+={}\[\]*:;""'']{1,500}$/i`
  - New: `/^[^\$\"<>?\\~\`!@$%^()+={}\[\]*:;]{1,500}$/i`
  - Removed: Double escapes and smart quotes that caused regex syntax errors

#### 🎯 Technical Improvements:
- Enhanced pattern matching reliability across all form validations
- Eliminated browser console regex syntax error warnings
- Maintained backward compatibility with existing validation logic
- Improved code maintainability with cleaner regex patterns

#### 📋 Modified Files:
- `packages/libraries/src/utils/index.js`:
  - Simplified `getPattern()` function for MobileNo type
  - Fixed Name pattern regex
  - Fixed Address pattern regex
  - Removed debug console logs

### Impact:
- Fixes console errors: "Pattern attribute value is not a valid regular expression"
- Ensures proper form validation across all DIGIT-UI modules
- Better MDMS integration for mobile number validation
- Production-ready code without debug logging


## [1.9.2] [13-November-2025]
### Bug fix
 - Fixed the logout redirection issue
 - added back the support for LOGOUT_REDIRECT_URL config 


## [1.9.1] [12-November-2025]
### Bug fix
 - Fixed the logout redirection issue

## [1.9.0] [28-October-2025]

### 🚀 Enhanced Libraries & Core Utilities

#### 📚 Advanced Hooks & Services:
- **Enhanced Multi-Tenant Support**: 
  - Updated useCustomMDMS hook with improved multi-tenant capabilities
  - Enhanced tenant context management and switching
  - Better integration with Core v1.9.0 multi-tenant architecture
- **Improved API Hooks**: 
  - Enhanced useCustomAPIHook with better error handling and retry logic
  - Updated useCustomAPIMutationHook with improved request management
  - Better header and method handling in API requests
- **Enhanced Data Management**: 
  - Improved useMDMS hook with MDMS v2 API support
  - Better caching strategies for improved performance
  - Enhanced data fetching and state management

#### 🛠️ Utility Enhancements:
- **PDF Generation**: Enhanced PDF download logic with better formatting
- **Field Utilities**: Improved field ID generation and validation utilities
- **Localization**: Enhanced localization cache management and cleanup
- **Configuration**: Better configuration utilities and merge strategies
- **Browser Utils**: Enhanced browser detection and compatibility utilities

#### 🔧 Service Layer Improvements:
- **API Service Abstractions**: Enhanced service layer patterns
- **Error Handling**: Improved centralized error handling and logging
- **Authentication**: Better authentication and authorization utilities
- **File Services**: Enhanced file upload and management capabilities

#### 🎯 Performance Optimizations:
- **Bundle Optimization**: Reduced bundle size through better tree-shaking
- **Memory Management**: Improved memory usage and cleanup
- **Caching Strategies**: Enhanced data caching and invalidation
- **Lazy Loading**: Better lazy loading patterns for improved performance

### Technical Improvements:
- **Module Architecture**: Enhanced library structure and organization
- **TypeScript Support**: Better TypeScript definitions and support
- **Testing**: Improved test coverage and utilities
- **Documentation**: Enhanced inline documentation and examples

### Multi-Tenant & Integration Features:
- **Advanced Multi-Tenant Support**: 
  - Compatible with Core v1.9.0 multi-tenant architecture
  - Enhanced tenant-specific configuration handling
  - Better data isolation and security patterns
- **Cross-Module Integration**: 
  - Enhanced integration patterns between modules
  - Better shared state management
  - Improved communication patterns

### Bug Fixes:
- Fixed module stability and performance issues
- Resolved MDMS v2 API integration problems
- Fixed localization and caching issues
- Improved error handling across all utilities
- Enhanced browser compatibility and performance

### Global Config Integration:
- **Full Global Config Support**: Enhanced support for all global configuration flags
- **Dynamic Configuration**: Better dynamic configuration loading and management
- **Environment Handling**: Improved environment-specific configuration
- **Feature Flags**: Enhanced feature flag support and management


## [1.9.0-rc2]  [27-Oct-2025]
- Test Build for release after master merge

## [1.9.0-rc1]  [27-Oct-2025]
- Test Build for release

## [1.8.23] [8-sept-2025]
- New PDF download logic added

## [1.8.19]  [5-Aug-2025]
- Updated field util to generate field id

## [1.8.18]  [21-Jul-2025]
- Checking with ui-components as dependency 

## [1.8.17]  [26-Jun-2025]
- Checking useCustomAPIHook with the new version 

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
