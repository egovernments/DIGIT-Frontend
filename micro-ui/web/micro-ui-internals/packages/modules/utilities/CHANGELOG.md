# Changelog

## [1.1.0]  [28-October-2025]

### 🚀 Major Utility Suite Enhancement

#### 📋 Advanced Form Development Tools:
- **FormExplorer Component**: Interactive form builder and testing environment
  - Real-time JSON configuration editor with GitHub dark theme
  - Live form preview with FormComposerV2 integration
  - Advanced field types: text, number, date, dropdown with MDMS integration
  - Validation system with pattern matching and error handling
  - Route-based form navigation with next/previous flow
- **FormExplorerCitizen**: Citizen-specific form composer
  - Tailored for citizen-facing form development
  - Enhanced mobile responsiveness and accessibility
  - Simplified configuration for citizen workflows

#### 📊 Audit & History Tracking:
- **AuditHistory Component**: Complete audit trail visualization
  - User search integration with UUID-based lookup
  - Diff visualization using react-diff-view for change tracking
  - Module-specific data path handling (MDMS, etc.)
  - Created/updated by user tracking with timestamps
  - Split-view diff rendering for better change visualization
  - Pagination support for large audit logs

#### 📄 Document Management & Viewing:
- **DocViewer Component**: Advanced document viewer with multi-format support
  - Support for 15+ file formats: PDF, XLSX, CSV, DOC, DOCX, images, etc.
  - Drag-drop file upload with validation
  - Real-time document preview using @cyntler/react-doc-viewer
  - Custom theming with DIGIT brand colors
  - Remote and local file support
  - Multiple file handling with upload management

#### 🔧 Enhanced Dynamic Components:
- **DynamicCreateComponent**: Improved form creation system
  - Enhanced loader integration with new Loader component
  - Better error handling and validation
  - Improved FormComposer integration
- **DynamicSearchComponent**: Advanced search capabilities
  - Enhanced routing system with contextPath improvements
  - Better action link handling and navigation
  - Improved configuration management

#### 🖥️ IFrame Integration:
- **IFrameInterface Module**: Advanced iframe embedding
  - Custom rendering capabilities with RenderCustom component
  - Enhanced integration for external applications
  - Better security and sandboxing features

#### 📱 Sample & Testing Components:
- **CitizenCreate Sample**: Template for citizen form development
  - Best practices implementation for citizen workflows
  - Validation patterns and error handling examples
  - Mobile-optimized form layouts

### Technical Improvements:
- **Enhanced Module Architecture**: 
  - Better component exports and registration
  - Enhanced IFrameInterface integration
  - Improved routing and navigation systems
- **Advanced Validation**: 
  - Pattern-based validation for different field types
  - MDMS integration for dropdown options
  - Real-time error handling and display
- **Performance Optimizations**: 
  - Lazy loading for document viewer
  - Optimized diff rendering for audit trails
  - Better memory management for large forms

### Integration Features:
- **Multi-Tenant Support**: 
  - Compatible with Core v1.9.0 multi-tenant architecture
  - Tenant-aware utility functions
  - Enhanced configuration management across tenants
- **Platform Integration**: 
  - Seamless MDMS integration for master data
  - User service integration for audit trails
  - File service integration for document management

### Global Config Integration:
- Supports `OVERRIDE_ROOT_TENANT_WITH_LOGGEDIN_TENANT` flag
- Enhanced tenant context handling
- Better configuration management for multi-tenant scenarios


## [1.1.0-rc2]  [27-Oct-2025]
- Test Build for release after master merge

## [1.1.0-rc1]  [27-Oct-2025]
- Test Build for release

## [1.0.17]  [28-October-2025]

### New Features:
- **Enhanced Module Integration**: 
  - Improved compatibility with Core v1.8.57
  - Better support for multi-tenant configurations
- **Component Updates**:
  - Updated utilities to work with new card-based interfaces
  - Enhanced iframe handling for external resources

### Technical Updates:
- Compatible with new global config flags
- Performance optimizations for utility functions
- Code cleanup and refactoring

### Bug Fixes:
- Fixed compatibility issues with updated Core module
- Resolved iframe loading issues in certain environments

#### [1.0.16]  [26-Aug-2025]
- Added iframe support and updated demo path handling based on KibanaMapsDomain

## [1.0.14]  [4-Mar-2025]
- DUCE-253 : Intergrated with react json editor for citizen form composer

## [1.0.14]  [4-Mar-2025]
- DUCE-254 : Intergrated with react json editor for citizen form composer

## [1.0.13]  [21-Feb-2025]
- Publishing a new version for more stability & as part of Components Release

## [1.0.12]
- FEATURE/DUCE-244 : - Intergrated with react json editor and provided a playground for create and search

## [1.0.11]
- Intergrated with new component library & updated toast , loaders

## [1.0.3]
- Fixed the module stablity & new components integrated

## [1.0.1-beta.30]
- Added audit history capability

## [1.0.1-beta.6-29]
- Added support to load external resources iframe enhancement for kibana.

## [1.0.1-beta.5]
- Added support to load external resources.

## [1.0.1-beta.4]
- Fixed some styling.
- Added toasts.

## [1.0.1-beta.3]
- Updated utilities for non-iframe content.

## [1.0.1-beta.2]
- Updated utilities for iframe to support custom function logic.

## [1.0.1-beta.1]
- Republished after merging with Master due to version issues.

## [1.0.0-beta.3]
- Added new support to view any document.

## [1.0.0-beta.2]
- Republished due to some iframe issues.

## [1.0.0-beta.1]
- Republished due to some version issues.

## [1.0.0]
- Workbench v1.0 release.

## [1.0.0-beta]
- Workbench base version beta release.

## [0.0.8]
- Fixed response data for custom component in inbox composer.

## [0.0.7]
- Updated the README content.

## [0.0.6]
- Fixed the module overriding issue.

## [0.0.5]
- Fixed the instability issue with the previous version.

## [0.0.4]
- Updated the react-component library version.

## [0.0.3]
- Corrected the directory.
- Added the preprocess function at inbox.

## [0.0.2]
- Added into the digit-core.
- Integrated with core react components.

## [0.0.1]
- Base version.
