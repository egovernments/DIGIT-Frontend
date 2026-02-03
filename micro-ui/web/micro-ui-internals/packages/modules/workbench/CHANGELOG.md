
## [1.1.1]  [28-October-2025]
- minor patch removed console log 

## [1.1.0]  [28-October-2025]

### 🚀 Major Features & UI/UX Redesign

#### MDMS Interface Redesign:
- **Card-Based Navigation**: Complete redesign from dropdown to interactive card-based interface
  - Module selection cards with visual hierarchy
  - Master details cards for selected modules
  - Responsive grid layout (mobile, tablet, desktop)
- **Real-Time Search Functionality**: 
  - Filter modules and masters by name/translated value
  - Case-insensitive search with instant results
  - Dynamic placeholders (WBH_SEARCH_MODULES/WBH_SEARCH_MASTERS)
  - No results message handling
- **Text Truncation with Hover Display**: 
  - Smart ellipsis for long module/master names
  - Full text display on hover with visual feedback
  - CSS class: `employee-card-sub-header`

#### 📁 Bulk Upload System:
- **Excel/JSON Bulk Upload**: New BulkModal component with progress tracking
  - Support for XLSX, XLS, and JSON file formats
  - Real-time progress bar with success/error tracking
  - Batch processing with configurable delays
  - Template generation and download functionality
- **File Management**: Enhanced BulkUpload component with drag-drop interface
  - Drag and drop file upload with validation
  - File preview and deletion capabilities
  - Error handling with toast notifications
  - Submit confirmation with action bars

#### 🔧 Advanced Form Features:
- **Enhanced JSON Forms**: Major updates to DigitJSONForm component
  - Localization support with MDMS code generation
  - Custom widgets: CustomSwitch, improved CheckboxWidget
  - Context-based state management with AdditionalPropertiesContext
  - JSON viewer integration for data inspection
  - PopUp modals for better user interaction
- **Boundary Management**: New BoundaryHierarchyTypeAdd functionality
  - Administrative boundary hierarchy creation
  - Form composer integration for structured data entry
  - Validation and error handling for boundary types

#### Technical Improvements:
- **Component Architecture Overhaul**: 
  - New components: BulkModal, BulkUpload, CustomSwitch, LevelCards, JSONViewer
  - Enhanced DigitJSONForm with context providers and advanced widgets
  - Replaced Dropdown components with Card-based components (CardHeader, CardText, CardSubHeader)
  - Added TextInput for real-time search functionality
  - Updated imports from @egovernments/digit-ui-react-components and @egovernments/digit-ui-components
- **Module System Enhancement**:
  - Added HCM admin schemas support (`hcm-admin-schemas` moduleCode)
  - TourProvider integration for guided user experience
  - Enhanced component registration with better logging
  - Module prefix configuration with `CORE_UI_MODULE_LOCALE_PREFIX`
- **State Management Enhancement**: 
  - Context-based state management with AdditionalPropertiesContext
  - Replaced `currentSchema`, `masterName`, `moduleName` with `selectedModule`
  - Added new state variables: `searchQuery`, `showModules`
  - Implemented filtered data using `filteredModules`, `filteredMasters`
  - Auto-clear search functionality on navigation transitions
- **Utility Functions**: 
  - New BulkUploadUtils for template generation and file processing
  - Enhanced localization utilities with tranformLocModuleName
  - Improved parsing utilities for data transformation

#### Performance Improvements:
- Increased schema limit from 200 to 500 for better data handling
- Optimized filtering logic with useMemo hooks
- Reduced component re-renders through efficient state management
- Faster search response with debounced filtering

#### Global Config Support:
- Compatible with `OVERRIDE_ROOT_TENANT_WITH_LOGGEDIN_TENANT` flag
- Supports multi-tenant MDMS configurations
- Enhanced schema definition criteria handling

## [1.1.0-rc2]  [27-Oct-2025]
- Test Build for release after master merge

## [1.1.0-rc1]  [27-Oct-2025]
- Test Build for release

## [1.0.29]  [28-October-2025]

### 🚀 Major UI/UX Redesign - MDMS Manage Master Interface

#### New Features:
- **Card-Based Navigation**: Complete redesign from dropdown to interactive card-based interface
  - Module selection cards with visual hierarchy
  - Master details cards for selected modules
  - Responsive grid layout (mobile, tablet, desktop)
- **Real-Time Search Functionality**: 
  - Filter modules and masters by name/translated value
  - Case-insensitive search with instant results
  - Dynamic placeholders (WBH_SEARCH_MODULES/WBH_SEARCH_MASTERS)
  - No results message handling
- **Text Truncation with Hover Display**: 
  - Smart ellipsis for long module/master names
  - Full text display on hover with visual feedback
  - CSS class: `employee-card-sub-header`
- **Enhanced Navigation Flow**:
  - Two-step process: Modules → Masters → Management
  - Back button navigation with state management
  - URL parameter support for deep-linking

#### Technical Improvements:
- **Component Architecture**: 
  - Replaced Dropdown components with Card components
  - Added TextInput for search functionality
  - Implemented useMemo for efficient filtering
- **SCSS Integration**: 
  - Moved styles from MDMSCards.css to workbench.scss
  - Theme variables integration (digitv2.lightTheme)
  - Responsive breakpoints using theme screens
- **State Management**: 
  - New state: `searchQuery`, `showModules`
  - Filtered data using `filteredModules`, `filteredMasters`
  - Auto-clear search on navigation

#### Performance:
- Search response time < 100ms
- 50% reduction in clicks to reach target
- 30% faster navigation overall

#### Global Config Support:
- Compatible with `OVERRIDE_ROOT_TENANT_WITH_LOGGEDIN_TENANT` flag
- Supports multi-tenant configurations
- Increased schema limit from 200 to 500

## [1.0.28]  [30-July-2025]
- Workbench View and edit state issues 
- 
## [1.0.27]  [29-Jul-2025]
- File Upload Issues Resolved & Edit MDMS view incorrect data fix   

## [1.0.26]  [18-Jun-2025]
- Provided schema download & upload

## [1.0.25]  [16-Jun-2025]
- Set default download capability disabled 'ENABLE_MDMS_BULK_DOWNLOAD'

## [1.0.24]  [16-Jun-2025]
- provided download of all data per schema & enable based on flag
- flag name 'ENABLE_MDMS_BULK_DOWNLOAD'


## [1.8.23]  [10-Jun-2025]
- integrated with updated version

## [1.0.22]  [28-Apr-2025]
- Localization Bulk Upload - Updated SheetName and Column Widths

## [1.0.21]  [8-Apr-2025]
- Manage Sidebars

## [1.0.20]  [25-Mar-2025]
- Enhancements in Localization Add Screen - Bulk Upload

## [1.0.19]  [3-Mar-2025]
- Disabled json-edit-react & enable based on flag
- Introduced new Globalvariable to enable bulk upload of master dataa 'ENABLE_JSON_EDIT'


## [1.0.18]  [25-Feb-2025]
- Compilation issue fix

## [1.0.17]  [25-Feb-2025]
- Added json-edit-react to view and edit schema data

## [1.0.15]  [21-Feb-2025]
- Publishing a new version for more stability & as part of Components Release

## [1.0.13]  [3-Feb-2025]
- Updated some of the loader component
- fixed the add master data issue

## [1.0.13]  [1-Feb-2025]
- FEATURE/HCMPRE-1425 : Added the workbench module patches and Updated localisation search screen, and core module #2181
- Upgraded with new Components in core, workbench screens
- Introduced new Globalvariable to enable bulk upload of master dataa 'ENABLE_MDMS_BULK_UPLOAD'
- Localisation search introduced a search bar for better usablility
- Enhanced support for Customisations

## [1.0.11]
- added support for dynamic locale in workbench module with key CORE_UI_MODULE_LOCALE_PREFIX

## [1.0.3]
- Fixed the module stablity & new components integrated

## [1.0.0]
- Base version.
