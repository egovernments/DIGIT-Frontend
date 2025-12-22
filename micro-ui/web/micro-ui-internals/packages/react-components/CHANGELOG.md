# Changelog

## [1.9.1]  [22-December-2025]

- Updated MobileNumber atom to support configurable prefix (default: +91) via props.

## [1.9.0] [28-October-2025]

### 🚀 Enhanced React Component Library

#### 🧩 Advanced Component System:
- **FormComposerV2 Enhancements**: 
  - Enhanced form composition with better validation and error handling
  - Improved FormComposerCitizen for citizen-specific workflows
  - Better field rendering with RenderFormFields improvements
  - Enhanced labelChildren and submitIcon props support
- **InboxSearchComposerV2**: 
  - Complete inbox overhaul with browser session integration
  - Advanced removable tags for search/inbox screens on mobile
  - Unified configuration for both mobile and desktop screens
  - Multi-tab support with seamless navigation
  - Custom hook integration and refetch capabilities

#### 🎨 UI/UX Component Improvements:
- **Enhanced Card Components**: 
  - Improved CardBasedOptions for modern card-based interfaces
  - Enhanced CitizenHomeCard with better responsive design
  - Better ULBHomeCard with improved layout and interactions
  - Enhanced EmployeeModuleCard with better functionality
- **Advanced Input Components**: 
  - Enhanced TextInput with improved validation and accessibility
  - Better DatePicker with enhanced date selection capabilities
  - Improved UploadFile and UploadImages with better error handling
  - Enhanced MultiSelectDropdown with better performance

#### 🔧 Form & Interaction Components:
- **Enhanced Modal System**: 
  - Improved Modal component with better className support
  - Enhanced PopUp component with better positioning
  - Better FileUploadModal with improved file handling
  - Enhanced WorkflowModal with better workflow integration
- **Table & Display Components**: 
  - Enhanced Table component with better sorting and pagination
  - Improved ResultsTable with custom pagination support
  - Better DetailsCard with enhanced information display
  - Enhanced XlsPreview for Excel file preview capabilities

#### 📱 Mobile & Accessibility Enhancements:
- **Responsive Design**: 
  - Enhanced mobile-first approach for all components
  - Better touch interactions and mobile gestures
  - Improved accessibility with WCAG compliance
  - Enhanced keyboard navigation support
- **Performance Optimizations**: 
  - Reduced bundle size through better tree-shaking
  - Improved component rendering performance
  - Better memory management and cleanup
  - Enhanced lazy loading for large component libraries

### Technical Improvements:
- **Storybook Integration**: Enhanced component documentation and testing
- **TypeScript Support**: Better TypeScript definitions and type safety
- **Testing Suite**: Improved test coverage and component testing utilities
- **Build Optimization**: Better build process and bundle optimization

### Multi-Platform & Integration Features:
- **Multi-Tenant Support**: 
  - Enhanced components for multi-tenant architectures
  - Better tenant context handling in forms and displays
  - Improved data isolation and security patterns
- **Cross-Module Integration**: 
  - Better integration patterns between components
  - Enhanced communication between form components
  - Improved shared state management

### Bug Fixes:
- Fixed loader component issues in inbox and form composers
- Resolved AJV-related Jenkins build issues
- Fixed uploader component validation and error handling
- Improved accessibility with proper ID attributes
- Enhanced component stability and performance
- Fixed tutorial and help component interactions

### Component-Specific Enhancements:
- **Toast Component**: Enhanced error className and better messaging
- **SubmitBar**: Added ID attributes for accessibility
- **Loader**: Improved LoaderWithGap and better loading states
- **Search Components**: Enhanced SearchComponent with better filtering
- **Navigation**: Improved HorizontalNav and HorizontalNavV2
- **Upload Components**: Better file type support including Excel files

### Global Config Integration:
- **Full Component Support**: All components now support global configuration
- **Dynamic Styling**: Better theme and styling support
- **Feature Flags**: Enhanced feature flag support in components
- **Environment Adaptation**: Components adapt better to different environments

## [1.9.0-rc2]  [27-Oct-2025]
- Test Build for release after master merge

## [1.9.0-rc1]  [27-Oct-2025]
- Test Build for release

## [1.8.24]  [6-Aug-2025]
- Added id attribute in submit bar

## [1.8.23]  [6-Aug-2025]
- Added id attribute for accessibility

## [1.8.21]  [10-Jun-2025]
- integrated with updated version

## [1.8.19]  [4-Mar-2025]
- DUCE-254 :  introduced a new formcomposercitizen for citizen variant

## [1.8.17]  [21-Feb-2025]
- Publishing a new version for more stability & as part of Components Release

## [1.8.16]  [3-Feb-2025]
- FEATURE/HCMPRE-2208 : Fixed some loader component issue in inbox & form composers

## [1.8.15]  [1-Feb-2025]
- FEATURE/HCMPRE-1425 : Added the workbench module patches and Updated localisation search screen, and core module #2181
- Upgraded with new Components in core, workbench screens

## [1.8.10] [19-Nov-2024]
- Republihsing the same due to component version issue, 


## [1.8.3]  [19-Nov-2024]
- Updated Landing page css and made the stable version with new components integrated core + sandbox


## [1.8.2-beta.19]
- Updated the Employee Module card component

## [1.8.2-beta.17]
- updated loader component style


## [1.8.2-beta.12]
- updated serachcomponent for using inboxserachcomposer inside popup

## [1.8.2-beta.11]
- fix: Sending disabled in radiobuttons from customdropdown. Added skiplabel prop for skiplabel in formComposerV2

## [1.8.2-beta.9]
- fix: Fixed uploader issue
## [1.8.2-beta.8]
- fix: Added placeholder prop for Text Field in Inbox Composerv2.

## [1.8.2-beta.7]
- fix: Fixed prop for the document upload.

## [1.8.2-beta.5]
- fix: Added submitIcon props for SubmitBar and labelChildren for FormComposerV2.

## [1.8.2-beta.3]
- fix: Adding the passing of the min field to the TextInput in RenderFormFields.

## [1.8.2-beta.1]
- fix: resolved AJV-related Jenkins build issue

## [1.8.1-beta.25]
- Added classname in LabelFieldPair, viewComposer.

## [1.8.1-beta.23]
- Enhanced onFormValueChange in formComposer.

## [1.8.1-beta.22]
- Fixed Tutorial.

## [1.8.1-beta.21]
- Added classname in Modal.

## [1.8.1-beta.20]
- Changes in Tutorial, help for more customizability.

## [1.8.1-beta.19]
- Increased zIndex in Tutorial, so it appears on top of everything.

## [1.8.1-beta.17]
- Added error classname for fields in renderFormFields.

## [1.8.1-beta.16]
- Added error classname for toast.

## [1.8.1-beta.15]
- Used a new Primary constant color "#c84c0e".
  - **Note:** Use this version with CSS 1.8.1-beta.8 and core 1.8.1-beta.12.

## [1.8.1-beta.14]
- Updated code for pagination in ResultsTable component.

## [1.8.1-beta.13]
- Updated InboxSearchComposerV2 to support custom hook call and refetch option.

## [1.8.1-beta.12]
- Fixed Tab inbox missing code.

## [1.8.1-beta.10]
- Introduced `InboxSearchComposerV2` component with browser session integration, removable tags for search/inbox screens on mobile, and a unified configuration for both mobile and desktop screens.

## [1.8.1-beta.9]
- Fixed Loader with gap.

## [1.8.1-beta.8]
- Added Close button and Loader.

## [1.8.1-beta.7]
- Enhanced viewComposer for cardHeader action.

## [1.8.1-beta.6]
- Added feature for Multi Tab in InboxSearchComposer.

## [1.8.1-beta.5]
- Added without LabelFieldPair config for removing default card.

## [1.8.1-beta.4]
- Added Previous button in FormComposer.

## [1.8.1-beta.3]
- Added XlsPreview component to preview XLS file.

## [1.8.1-beta.2]
- Moved the sidebar footer outside of "drawer-list" to prevent overlapping issues.

## [1.8.1-beta.1]
- Republished after merging with Master due to version issues.

## [1.8.0-beta.5]
- Added file type Excel in multiUploadWrapper.

## [1.8.0-beta.4]
- Republished.

## [1.8.0-beta.3]
- Republished due to some issues.

## [1.8.0-beta.2]
- Added some icons for PQM dashboard.

## [1.8.0-beta.1]
- Fixed some topbar issues.

## [1.8.0]
- Workbench v1.0 release.

## [1.8.0-beta]
- Workbench base version beta release.

## [1.7.0]
- Urban 2.9.

## [1.6.0]
- Urban 2.8.

## [1.5.36]
- Added classname for topbar options.

## [1.5.35]
- Fixed alignment issue in edit and logout.

## [1.5.34]
- Updated login SCSS and alignment issues.

## [1.5.28]
- Passing response data in case for custom component in inbox composer.

## [1.5.27]
- Integrated with the SVG library.

## [1.5.26]
- Fixed shipping truck icon fill issue.

## [1.5.25]
- Added new icon and fixed other issues.

## [1.5.24]
- Added and updated the README file.

## [1.5.23]
- Base version.
```