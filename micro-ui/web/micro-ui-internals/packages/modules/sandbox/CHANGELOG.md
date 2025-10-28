# Changelog

## [0.1.0] [28-October-2025]

### 🎉 COMPLETELY NEW MODULE - Sandbox Environment for DIGIT Platform

#### 🏗️ Core Module Architecture:
- **Complete Module System**: Brand new sandbox module from ground up
  - Multi-module support: `digit-sandbox`, `rainmaker-mdms`, `rainmaker-workbench`, `rainmaker-schema`
  - React route matching with useRouteMatch for proper navigation
  - ULB service integration for seamless tenant management
  - Override hooks and custom configurations for platform customization

#### 🏢 Advanced Tenant Management System:
- **Tenant CRUD Operations**: 
  - TenantCreate.js: Complete tenant creation workflow
  - TenantUpdate.js: Advanced tenant modification capabilities
  - TenantView.js: Comprehensive tenant information display
  - TenantConfigUpload.js: Configuration file management
- **Configuration Management**: 
  - ConfigUploaderComponent: Drag-drop config file uploads
  - LogoUploaderComponent: Brand logo management system
  - PUCAR integration with dedicated create/search/update configs
  - Tenant-specific configuration validation and processing

#### 🔧 Application Management System:
- **Module Management**: 
  - ApplicationHome.js: Central dashboard for application management
  - ModuleMasterTable.js: Comprehensive module overview and management
  - ModuleSelect.js: Dynamic module selection interface
  - SetupMaster.js: Master data configuration and setup
- **Configuration Framework**: 
  - moduleMasterConfig.js: Module-specific configuration management
  - setupMasterConfig.js: System setup and initialization configurations
  - UICustomizations.js: Custom UI behavior and styling overrides

#### 🎨 Rich UI Component Library:
- **Interactive Cards**: 
  - SandboxCard: Main sandbox navigation component
  - ModuleCard: Individual module representation and interaction
  - SandboxTestComponent: Testing and validation interface
- **Visual Assets**: Complete SVG icon library
  - Citizen.svg: Citizen portal representation
  - Employee.svg: Employee interface icons
  - chart/graph icons: bar_chart.svg, graph.svg for analytics
  - feature_search.svg: Advanced search capabilities
  - calculate.svg: Computation and calculation features
  - chat.svg: Communication and support features

#### 📄 Advanced Configuration Files:
- **PUCAR Integration**: 
  - pucarCreateConfig.js: PUCAR system creation workflows
  - pucarSearchConfig.js: Advanced search configurations for PUCAR
- **Tenant Configurations**: 
  - tenantCreateConfig.js: Tenant creation form configurations
  - tenantSearchConfig.js: Tenant search and filtering options
  - tenantUpdateConfig.js: Tenant modification form layouts

#### 🛠️ Utility & Helper Systems:
- **Creation Utilities**: 
  - TenantCreateUtil.js: Helper functions for tenant creation
  - TenantUpdateUtil.js: Utilities for tenant modification workflows
  - createUtils.js: General creation and validation utilities
  - index.js: Centralized utility exports and management

#### 🔄 Page Structure & Routing:
- **Employee Interface**: 
  - Complete employee routing system in pages/employee/index.js
  - SandboxCreate.js: Resource creation workflows
  - SandboxSearch.js: Advanced search and filtering capabilities
  - SandboxResponse.js: Response handling and display

#### 🌐 Integration Features:
- **Core Platform Integration**: 
  - Seamless integration with Core v1.9.0 multi-tenant architecture
  - Support for `OVERRIDE_ROOT_TENANT_WITH_LOGGEDIN_TENANT` flag
  - Enhanced tenant context switching and management
- **Module Interoperability**: 
  - Compatible with Workbench, MDMS, and Schema modules
  - Shared utility functions and configuration patterns
  - Consistent UI/UX patterns across platform

#### 🚀 Key Capabilities:
- **Tenant Lifecycle Management**: Complete CRUD operations for tenant management
- **Configuration Management**: Upload, validate, and manage system configurations
- **Module Management**: Dynamic module selection and configuration
- **Testing Environment**: Comprehensive testing and validation tools
- **Asset Management**: Logo, icon, and resource management system

### Technical Foundation:
- Built on React with modern hooks and context management
- Form validation and error handling throughout
- Responsive design with mobile-first approach
- Comprehensive logging and debugging capabilities
- Modular architecture for easy extension and customization

## [0.1.0-rc2]  [27-Oct-2025]
- Test Build for release after master merge

## [0.1.0-rc1]  [27-Oct-2025]
- Test Build for release

## [0.0.4] [28-October-2025]

### New Features:
- **Module Navigation Enhancement**: 
  - Updated Module.js for improved routing
  - Better integration with core module updates
- **Component Updates**:
  - Fixed component initialization issues
  - Improved module loading performance

### Technical Updates:
- Compatible with Core v1.8.57 multi-tenant improvements
- Updated dependency versions for better stability
- Code cleanup and optimization

### Bug Fixes:
- Fixed module initialization errors
- Resolved routing conflicts with other modules

## [0.0.3] [16-Apr-2025]

- Fixed breadcrumb navigation issues in the Sandbox module.
- Added sidebar to the Product Details page for better navigation consistency.
- Included missing MCollect icon and inline CSS refinements for layout consistency.
- Refactored and reorganized Sandbox module files for improved maintainability.
- Updated Sandbox and Core module versions to latest compatible builds.
- Reverted temporary test commits to ensure clean version history.
- Applied final CSS improvements and code review suggestions for UI stability.

## [0.0.1]  [21-Feb-2025]

- Publishing a new version for more stability & as part of Components Release



### New Changes

- Added base code sandbox [2024-06-13]
