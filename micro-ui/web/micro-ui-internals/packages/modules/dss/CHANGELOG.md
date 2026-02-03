

## [1.9.0] [28-October-2025]

### 🚀 Enhanced Dashboard & Analytics Platform

#### 📊 Advanced Dashboard Components:
- **KibanaCard Component**: New iframe-based Kibana integration
  - Seamless IFrameInterface integration with utilities module
  - State-aware filtering and tenant context support
  - Mobile-responsive design with optimized layouts
  - Enhanced wrapper and styling classes for better UX
- **Enhanced Chart Components**: Major improvements across all chart types
  - CustomAreaChart: Better data visualization and interactivity
  - CustomHorizontalBarChart: Enhanced horizontal data representation
  - CustomPieChart: Improved pie chart rendering and animations
  - CustomTable: Advanced table features with better data handling
  - GenericChart: Flexible chart component for various data types

#### 🎛️ Improved Filtering & Navigation:
- **Enhanced Filters Component**: Advanced filtering capabilities
  - Better filter state management and persistence
  - Dynamic filter options based on data context
  - Improved performance for large datasets
- **Layout Improvements**: Better dashboard organization
  - Responsive grid layouts for different screen sizes
  - Improved navigation and user experience
  - Enhanced loading states and error handling

#### 🗺️ Enhanced Mapping & Geospatial Features:
- **MapChart Enhancements**: Improved geospatial data visualization
  - Better map rendering performance
  - Enhanced zoom and pan capabilities
  - Improved data point visualization
- **Updated SVG Assets**: Refreshed visual elements
  - Updated Arrow_Right.svg for better navigation indicators
  - Enhanced dashboards.svg for improved iconography

#### 🏠 Home Page Redesign:
- **Enhanced Home Component**: Improved dashboard home experience
  - Better layout organization and card arrangements
  - Enhanced navigation and quick access features
  - Improved loading performance and user feedback

### Technical Improvements:
- **Module Architecture Enhancement**: 
  - Better integration with utilities module for iframe support
  - Enhanced component registration and exports
  - Improved error boundaries and fallback components
- **Performance Optimizations**: 
  - Optimized chart rendering for large datasets
  - Better memory management for dashboard components
  - Reduced API calls through intelligent caching
- **State Management**: 
  - Enhanced filter state persistence
  - Better component lifecycle management
  - Improved data flow between dashboard components

### Multi-Tenant & Integration Features:
- **Advanced Multi-Tenant Support**: 
  - Compatible with Core v1.9.0 multi-tenant architecture
  - Supports `OVERRIDE_ROOT_TENANT_WITH_LOGGEDIN_TENANT` flag
  - Tenant-specific dashboard configurations and filtering
- **External System Integration**: 
  - Enhanced Kibana integration through iframe interface
  - Better authentication proxy handling
  - Improved external dashboard embedding

### Bug Fixes:
- Fixed DSS issues found in PGR Ethiopia demo
- Resolved iframe authentication and proxy issues
- Improved chart rendering on different screen sizes
- Enhanced error handling for failed data loads
- Better handling of undefined data states

### Global Config Integration:
- Supports tenant-specific dashboard configurations
- Dynamic metrics based on user permissions and tenant context
- Enhanced iframe domain configuration for external dashboards

## [1.9.0-rc2]  [27-Oct-2025]
- Test Build for release after master merge

## [1.9.0-rc1]  [27-Oct-2025]
- Test Build for release

## [1.8.13] [28-October-2025]

### New Features:
- **Multi-Tenant Dashboard Support**: 
  - Compatible with Core v1.8.57 multi-tenant improvements
  - Supports `OVERRIDE_ROOT_TENANT_WITH_LOGGEDIN_TENANT` flag
  - Dynamic dashboard filtering based on tenant context

### Technical Updates:
- Updated dependencies for better stability
- Enhanced data visualization components
- Improved chart rendering performance
- Better integration with analytics services

### Dashboard Enhancements:
- Card-based dashboard widgets
- Responsive chart layouts
- Improved data aggregation logic
- Real-time data refresh capabilities

### Bug Fixes:
- Fixed DSS issues found in PGR Ethiopia demo
- Resolved localization key issues
- Fixed iframe authentication proxy issues
- Improved error handling in data fetching

### Performance Improvements:
- Optimized dashboard loading time
- Reduced API calls through better caching
- Improved chart rendering performance
- Better memory management for large datasets

### Global Config Integration:
- Fully compatible with new global configuration system
- Supports tenant-specific dashboard configurations
- Dynamic metrics based on tenant permissions

## [1.8.12]  [21-Feb-2025]
- Publishing a new version for more stability & as part of Components Release

## [1.8.11]  [3-Feb-2025]
- Fixed DSS issues and related found in PGR ethopia demo, and enhanced a few keys related to localisations issue.

## [1.8.10]  [19-Nov-2024]
- Fixed the module stablity & new components integrated republihsing the same due to component version issue, 

## [1.8.3]
- Fixed the module stablity & new components integrated, sandbox enabled, integrated with iframe for auth proxy

## [1.8.0]
- Base version.
