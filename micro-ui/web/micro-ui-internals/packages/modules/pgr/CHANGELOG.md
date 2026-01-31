## [1.9.0] [28-October-2025]

### 🚀 Enhanced Public Grievance Redressal System

#### 📝 Advanced Inbox & Search Capabilities:
- **New Inbox V2**: Complete inbox system overhaul with new-inbox.js
  - Enhanced InboxSearchComposer integration
  - Dynamic configuration loading from inboxConfigPGR
  - Better ward and locality filtering with location hooks
  - Service definitions integration for complaint types
  - Improved pagination and data loading performance
- **Enhanced Desktop Inbox**: Improved DesktopInbox component
  - Better responsive design and user experience
  - Enhanced complaint status tracking and updates
  - Improved bulk operations and action handling

#### 🔍 Enhanced Search & Filtering:
- **Advanced Search Component**: Enhanced inbox/search.js
  - Better search criteria and filtering options
  - Improved performance for large complaint datasets
  - Enhanced geographical boundary integration
  - Dynamic service type filtering
- **Configuration-Driven Inbox**: New inboxConfigPGR.js
  - Modular and configurable inbox setup
  - Dynamic field configuration and validation
  - Better integration with MDMS for dropdown options
  - Enhanced localization support

#### 💻 Citizen Portal Enhancements:
- **Enhanced Complaint Creation**: Major improvements to citizen workflow
  - SelectAddress: Better address selection with improved validation
  - SelectComplaintType: Enhanced complaint categorization
  - SelectImages: Improved image upload with better validation
  - Create/index.js: Streamlined complaint creation process
- **Improved Complaint Management**: Enhanced citizen experience
  - ComplaintDetails: Better complaint detail display and actions
  - ComplaintsList: Improved list view with better filtering
  - ReopenComplaint: Enhanced reopen workflow
  - SelectRating: Improved rating and feedback system

#### 👔 Employee Portal Improvements:
- **Enhanced Employee Workflows**: Improved employee-facing features
  - ComplaintDetails: Better detail view for employee actions
  - CreateComplaint: Enhanced employee complaint creation
  - Better integration with workflow services
- **Improved Employee Index**: Enhanced employee module structure
  - Better routing and navigation
  - Enhanced access control and permissions
  - Improved error handling and user feedback

#### 🔄 Workflow & Timeline Enhancements:
- **Enhanced Timeline Components**: Improved timeline instances
  - rejected.js: Better rejected complaint handling
  - resolved.js: Enhanced resolved complaint display
  - Better status tracking and history visualization
- **Improved FormComposer**: Enhanced FormComposer component
  - Better form rendering and validation
  - Enhanced field types and configurations
  - Improved responsive design

#### 🗂️ Component & UI Improvements:
- **Enhanced PGR Card**: Improved PGRCard component
  - Better visual design and information display
  - Enhanced responsive behavior
  - Improved accessibility features
- **Better Routes**: Enhanced Routes.js constants
  - Improved route management and organization
  - Better navigation handling
  - Enhanced deep-linking support

### Technical Improvements:
- **Module Architecture**: Enhanced Module.js
  - Better component registration and initialization
  - Improved error boundaries and fallback handling
  - Enhanced integration with other modules
- **Performance Optimizations**: 
  - Better data loading and caching strategies
  - Optimized component rendering for large datasets
  - Improved memory management
- **State Management**: 
  - Enhanced state persistence and management
  - Better form state handling
  - Improved data synchronization

### Multi-Tenant & Integration Features:
- **Advanced Multi-Tenant Support**: 
  - Compatible with Core v1.9.0 multi-tenant architecture
  - Supports `OVERRIDE_ROOT_TENANT_WITH_LOGGEDIN_TENANT` flag
  - Enhanced tenant-specific complaint routing
- **Better Integration**: 
  - Enhanced workflow service integration
  - Better notification service connectivity
  - Improved file service integration for attachments

### Bug Fixes:
- Fixed complaints list loading and pagination issues
- Resolved image upload validation problems
- Fixed timeline display and status update inconsistencies
- Improved error handling across all PGR workflows
- Enhanced form validation and user feedback
- Fixed responsive design issues on mobile devices

### Global Config Integration:
- Supports tenant-specific grievance routing and workflows
- Enhanced geographical boundary configuration
- Better integration with MDMS for complaint categories
- Dynamic configuration based on tenant permissions

## [1.9.0-rc2]  [27-Oct-2025]
- Test Build for release after master merge

## [1.9.0-rc1]  [27-Oct-2025]
- Test Build for release

## [1.8.13] [28-October-2025]

### New Features:
- **Multi-Tenant Support**: 
  - Compatible with Core v1.8.57 multi-tenant improvements
  - Supports `OVERRIDE_ROOT_TENANT_WITH_LOGGEDIN_TENANT` flag
  - Enhanced grievance routing based on tenant context

### Technical Updates:
- Updated dependencies for better stability
- Improved complaint workflow management
- Enhanced search and filter capabilities
- Better integration with location services

### Bug Fixes:
- Fixed issues found in PGR Ethiopia demo
- Resolved boundary and locality selection bugs
- Fixed inbox rendering issues
- Improved error handling in complaint submission

### Global Config Integration:
- Fully compatible with new global configuration system
- Supports dynamic tenant-based complaint routing
- Enhanced multi-language support

## [1.8.12]  [21-Feb-2025]
- Publishing a new version for more stability & as part of Components Release

## [1.8.11]  [3-Feb-2025]
- Fixed PGR issues and related found in PGR Ethopia demo

## [1.8.10]  [19-Nov-2024]
- Fixed the module stablity & new components integrated republihsing the same due to component version issue, 

## [1.8.3]
- Fixed the module stablity & new components integrated, sandbox enabled 

## [1.8.0]
- Base version.
