## [1.9.3] [24-December-2025]
### 🔄 Configuration Standardization:
- **Unified MDMS Config**: Updated `createEmployee` and `EditForm` to use the standardized `ValidationConfigs` module (master: `mobileNumberValidation`) instead of `UserValidation`.
- **Consistency**: Aligned validation logic with the Inbox and Core Login modules for a uniform experience throughout the application.

## [1.9.2] [15-December-2025]

### 🔧 Bug Fixes & Validation Improvements:

#### 📱 Enhanced Mobile Number Validation:
- **MDMS Pattern Integration**: Fixed mobile number validation to use MDMS pattern directly instead of relying on global window object
  - Pattern is now retrieved directly from `validationConfig.pattern` in both real-time and pre-submission validation
  - Eliminates timing issues with global window object initialization
  - Ensures consistent validation across Create Employee and Edit Employee forms

#### ✅ Fixed Validation Issues:
- **Jurisdiction Validation**: Removed `tenantId` check from form value change validation as it's only added during submission
- **Regex Pattern Fixes**: Corrected invalid regex patterns in Name and Address validation
  - Fixed Name pattern: Removed `{0-9}`, extra `^`, and double escapes
  - Fixed Address pattern: Removed smart quotes and invalid escape sequences
- **Pre-submission Validation**: Added mobile number validation before form submission as final safety check
  - Validates both length (min/max) and pattern matching
  - Uses MDMS config with fallback to default 10-digit pattern
  - Shows appropriate error messages from MDMS or default error

#### 🎯 Technical Improvements:
- Cleaned up all debug console logs for production readiness
- Simplified MDMS pattern retrieval logic in `getPattern()` utility function
- Enhanced error handling with silent fallback to default patterns
- Added `validationConfig` to useEffect dependencies for proper reactivity

#### 📋 Files Modified:
- `createEmployee.js`: Enhanced mobile validation in both real-time (useEffect) and submission (onSubmit)
- `EditForm.js`: Enhanced mobile validation with MDMS pattern integration
- `packages/libraries/src/utils/index.js`: Simplified getPattern() for better MDMS integration
- `SelectEmployeeName.js`: Real-time name validation with error display
- `SelectEmployeeCorrespondenceAddress.js`: Real-time address validation with error display

### Validation Flow:
1. **Real-time Validation** (as user types):
   - Mobile number validated against MDMS pattern and length constraints
   - Duplicate phone number check via API call
   - Name and Address validated with improved regex patterns

2. **Pre-submission Validation** (before API call):
   - Final mobile number validation check
   - Length and pattern verification
   - Error toast displayed if validation fails

### Fallback Mechanism:
- If MDMS config is unavailable, falls back to default validation:
  - Pattern: `^[6-9][0-9]{9}$` (10-digit Indian mobile number)
  - Min/Max Length: 10
  - Error Message: "CORE_COMMON_MOBILE_ERROR"


## [1.9.1] [08-December-2025]

### 📱 Mobile Number Validation Enhancements:
- **Consistent Validation**: Implemented consistent mobile number validation across Create Employee, Edit Employee, and Inbox Search forms.
- **MDMS Integration**: Mobile number validation rules (max length, pattern, error messages) are now dynamically fetched from MDMS configuration.

#### 📋 MDMS Configuration Details:
- **Module Name**: `ValidationConfigs`
- **Master Details**: `mobileNumberValidation`
- **Tenant-Specific**: Configuration is tenant-aware and fetched based on the current tenant ID

#### 🔧 Configuration Structure:
The mobile number validation is configured in MDMS with the following structure:
```json
{
  "validationName": "defaultMobileValidation",
  "rules": {
    "prefix": "+251",
    "pattern": "^[79][0-9]{8}$",
    "isActive": true,
    "maxLength": 9,
    "minLength": 9,
    "errorMessage": "Please enter a valid 9-digit mobile number starting with 7 or 9",
    "allowedStartingDigits": ["7", "9"]
  }
}
```

#### 🌐 API Integration:
- **Endpoint**: `/egov-mdms-service/v1/_search`
- **Request Payload**:
  ```json
  {
    "MdmsCriteria": {
      "tenantId": "{TENANT_ID}",
      "moduleDetails": [{
        "moduleName": "ValidationConfigs",
        "masterDetails": [{
          "name": "mobileNumberValidation"
        }]
      }]
    },
    "RequestInfo": {...}
  }
  ```

#### ✅ Features Supported:
- **Dynamic Pattern Validation**: Regex patterns fetched from MDMS for country-specific formats
- **Custom Error Messages**: Localized error messages per tenant configuration
- **Length Constraints**: Configurable min/max length restrictions
- **Prefix Support**: Country code prefixes automatically handled
- **Active/Inactive Status**: Ability to enable/disable validation per tenant
- **Allowed Starting Digits**: Restrict mobile numbers to specific starting digits

#### 📝 Usage:
The validation configuration is automatically fetched when:
1. Creating a new employee (Create Employee form)
2. Editing existing employee details (Edit Employee form)  
3. Searching employees by mobile number (Inbox Search)

The system caches the MDMS configuration for optimal performance and updates when tenant context changes.


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
