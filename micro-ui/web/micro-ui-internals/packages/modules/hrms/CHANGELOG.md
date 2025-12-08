## [1.9.1] [08-December-2025]

### 📱 Mobile Number Validation Enhancements:
- **Consistent Validation**: Implemented consistent mobile number validation across Create Employee, Edit Employee, and Inbox Search forms.
- **MDMS Integration**: Mobile number validation rules (max length, pattern, error messages) are now dynamically fetched from MDMS configuration.


## [1.9.0] [28-October-2025]

### 🚀 Enhanced HR Management System

#### 💼 Employee Management Improvements:
- **Enhanced Employee Actions**: Improved EmployeeAction component
  - Better workflow management and action handling
  - Enhanced status tracking and state management
  - Improved error handling and user feedback
- **Advanced Employee Creation**: Enhanced createEmployee workflow
  - Better form validation and error prevention
  - Improved data collection and processing
  - Enhanced user experience for HR administrators

#### 📅 Enhanced Form Components & UI:
- **DatePicker Width Fixes**: Comprehensive styling improvements
  - SelectDateofEmployment: Added maxWidth (36.25rem) and padding fixes
  - EmployeeDOB: Enhanced date picker styling consistency
  - Responsive design improvements across different screen sizes
- **Email & Gender Components**: Enhanced form field components
  - SelectEmailId: Better email validation and formatting
  - SelectEmployeeGender: Improved dropdown styling and accessibility
  - SelectEmployeeId: Enhanced ID field validation and display

#### 🔍 Advanced Search & Filtering:
- **Enhanced Inbox Filter**: Improved InboxFilter component
  - Better search performance and filtering options
  - Enhanced tenant-aware filtering capabilities
  - Improved user interface for complex queries
- **Responsive Design**: Better mobile and tablet experience
  - Enhanced responsive layouts for form components
  - Improved touch interactions and accessibility
  - Better handling of different screen orientations

#### ⚙️ Configuration & Workflow Enhancements:
- **Enhanced Configuration**: Updated config.js with better defaults
  - Improved form field configurations
  - Better validation rules and error messages
  - Enhanced workflow definitions and status management
- **Utility Functions**: Enhanced Utils/index.js
  - Better data processing and transformation utilities
  - Improved error handling and validation functions
  - Enhanced helper functions for common HRMS operations

#### 👥 Employee Management Features:
- **Assignment & Jurisdiction**: Enhanced assignment and jurisdiction components
  - Better role assignment workflows
  - Improved jurisdiction selection and validation
  - Enhanced geographical boundary handling
- **Employee Details & Editing**: Improved EmployeeDetails and EditForm
  - Better data display and editing capabilities
  - Enhanced validation during employee updates
  - Improved user experience for HR operations

#### 📱 Page-Level Enhancements:
- **Response Page**: Enhanced Response component
  - Better success/error feedback to users
  - Improved workflow completion handling
  - Enhanced user guidance and next steps
- **Index Page**: Improved overall module structure
  - Better routing and navigation
  - Enhanced error boundaries and fallback states
  - Improved loading states and user feedback

### Technical Improvements:
- **Module Architecture**: Enhanced Module.js structure
  - Better component registration and organization
  - Improved access control and permission handling
  - Enhanced error boundaries and fallback mechanisms
- **Form Validation**: Comprehensive validation improvements
  - Better field-level validation with real-time feedback
  - Enhanced cross-field validation for complex forms
  - Improved accessibility and keyboard navigation
- **Performance Optimizations**: 
  - Better form rendering performance
  - Optimized data loading and caching
  - Improved memory management for large employee datasets

### Multi-Tenant & Integration Features:
- **Advanced Multi-Tenant Support**: 
  - Compatible with Core v1.9.0 multi-tenant architecture
  - Supports `OVERRIDE_ROOT_TENANT_WITH_LOGGEDIN_TENANT` flag
  - Enhanced tenant auto-selection when only one tenant is available
- **Better Integration**: 
  - Enhanced integration with workflow service
  - Better synchronization with user management
  - Improved data consistency across modules

### Bug Fixes:
- Fixed date picker width issues across different screen sizes
- Resolved form field alignment and spacing problems
- Fixed responsive design issues on mobile devices
- Improved localization support and key handling
- Enhanced error handling for edge cases in employee workflows

### Global Config Integration:
- Supports dynamic tenant switching for HR administrators
- Enhanced role-based access control integration
- Better configuration management for multi-tenant deployments

## [1.9.0-rc2]  [27-Oct-2025]
- Test Build for release after master merge

## [1.9.0-rc1]  [27-Oct-2025]
- Test Build for release

## [1.8.18] [28-October-2025]

### New Features:
- **Multi-Tenant Support**: 
  - Compatible with Core v1.8.57 multi-tenant improvements
  - Supports `OVERRIDE_ROOT_TENANT_WITH_LOGGEDIN_TENANT` flag
  - Enhanced tenant auto-selection logic

### Technical Updates:
- Updated dependencies for better stability
- Code optimization for employee management workflows
- Improved form validation and error handling

### Bug Fixes:
- Fixed date picker width issues across different screen sizes
- Resolved localization issues in employee forms
- Fixed tenant selection edge cases

### Global Config Integration:
- Fully compatible with new global configuration system
- Supports dynamic tenant switching for HR administrators

## [1.8.17] [24-Sept-2025] 
- Added auto select functionality if only one tenant present

## [1.8.16] [25-July-2025] 
- DatePicker HRMS - Maxwidth Added for 2 more fields

## [1.8.15] [25-July-2025] 
- DatePicker HRMS Maxwidth Added

## [1.8.13]  [15-July-2025]
- Publishing PGR Demo changes, 
- Boudnary and locality chanages were added, Edit, Create and Inbox   

- Publishing a new version for more stability & as part of Components Release


## [1.8.11]  [21-Feb-2025]
- Publishing a new version for more stability & as part of Components Release

## [1.8.10]  [19-Nov-2024]
- Fixed the module stablity & new components integrated republihsing the same due to component version issue, 

## [1.8.3]
- Fixed the module stablity & new components integrated, sandbox enabled 

## [1.8.0]
- Base version.
