# Changelog

## [1.9.12]  [17-FEB-2026]
- **Enhancement**: Stateinfo prop added and  `logoUrlWhite` prop support to TopBarSideBar component for secondary logo display

## [1.9.11]  [16-FEB-2026]
- **Enhancement**: Added `logoUrlWhite` prop support to TopBarSideBar component for secondary logo display
- **Code Quality**: Fixed code formatting and indentation in citizen home page OBPS Info label component

## [1.9.10]  [02-JAN-2026]
-userProfile has been changed according to the new api /health-individual/v1

## [1.9.9]  [24-DEC-2025]
- **Feature**: Mobile number validation in Login and User Profile now driven by `UserValidation` MDMS master.
- **Refactor**: Removed dependency on `CORE_MOBILE_CONFIGS` global object.
- **Configurability**: The MDMS module name for validation is configurable via `UICONFIG_MODULENAME` in global configs, defaulting to `commonUiConfig` if not set.
- **Compatibility**: `UserProfileValidationConfig` is mapped from the `UserValidation` response within the `UserProfile` component.

## [1.9.7]  [12-DEC-2025]
-Feature : Header.js component enhanced for secondary logo URL

## [1.9.6]  [26-November-2025]
-Bug fix : minor logic enhancement in 1.9.5

## [1.9.5]  [26-November-2025]
-Bug fix for edit profile citizen side(if user logged out, no need to show edit profile button)

## [1.9.4]  [25-November-2025]
-Bug fix for use data in edit profile in citizen side

## [1.9.3]  [21-November-2025]
-Bug fix for edit profile in citizen side

## [1.9.2]  [12-November-2025]
-New feature added for external URLs in employeeSidebar

## [1.9.0]  [07-November-2025]
-Citizen side api changes to /health-individual for user registration
-Forgot password ui changes from mobile number to username

## [1.9.0]  [28-October-2025]

### 🚀 Major Feature Release - Enhanced Authentication & Multi-Tenant Support

#### 🔐 Complete Authentication System Overhaul:
- **Login v2 System**: New Login-v2 module with enhanced security and UX
  - Advanced configuration system with config-v2.js
  - Email and mobile number login flows with pattern validation
  - OTP customization with OtpCustomComponent
  - SignUp v2 with improved validation and user experience
- **Enhanced OTP System**: 
  - New Otp module with advanced customization options
  - Better error handling and validation
  - Support for email-based OTP verification
- **Carousel Login Experience**: 
  - New Carousel component for interactive login screens
  - Dynamic banner rendering with conditional logic
  - Improved visual hierarchy and user guidance

#### 🏢 Multi-Tenant & Configuration Features:
- **Advanced Multi-Tenant Support**: 
  - `OVERRIDE_ROOT_TENANT_WITH_LOGGEDIN_TENANT` global config flag
  - Enhanced ULB service for dynamic tenant switching
  - Tenant-specific logo support with `logoUrlWhite` option
  - Improved tenant context management across sessions
- **Landing Page Configuration**: 
  - New LandingPageConfig.js for customizable home screens
  - Role-based employee home pages with RoleBasedEmployeeHome component
  - Configurable default landing pages (`defaultLanding` parameter)
- **User Type Restrictions**: 
  - `allowedUserTypes` parameter for controlling access (citizen/employee)
  - Enhanced routing based on user permissions
  - Better security through access control

#### 🎨 New UI Components & Features:
- **SandBox Integration**: 
  - New SandBoxHeader component with dedicated styling
  - SandboxHeader.svg for branding consistency
  - Sandbox-specific routing and configuration
- **Enhanced Error Handling**: 
  - CustomErrorComponent for better error messaging
  - DummyLoader component for improved loading states
  - Better error boundary management
- **Privacy & Compliance**: 
  - New PrivacyComponent for GDPR/privacy compliance
  - Enhanced consent management
  - Configurable privacy policies
- **Utility Components**: 
  - ImageComponent for optimized image handling
  - ForgotOrganizationTooltip for better user guidance
  - LoginSignupSelector for streamlined access

#### 🔧 Advanced Hooks & Configuration:
- **New Custom Hooks**: 
  - useLoginConfig: MDMS-based login configuration management
  - useTenantConfigSearch: Advanced tenant search and filtering
  - Enhanced authentication state management
- **Configuration Management**: 
  - MDMS-based login screen configuration
  - Module-specific privacy and compliance settings
  - Dynamic component loading based on tenant settings

#### 📱 Enhanced Mobile & Responsive Features:
- **Improved Mobile Experience**: 
  - Better responsive design for login flows
  - Enhanced mobile-specific validations
  - Improved touch interactions
- **Search Enhancements**: 
  - Enhanced MobileSearchApplication component
  - Better search field configurations
  - Improved search result handling

#### 🔄 App Architecture Improvements:
- **Enhanced App.js**: 
  - Support for additional components injection
  - Better route management with conditional rendering
  - Enhanced props passing for customization
- **Module System Enhancement**: 
  - Better AppModules component with additional component support
  - Enhanced module loading and initialization
  - Improved error handling in module registration

#### 🛡️ Security & Validation:
- **Enhanced Validation**: 
  - Pattern validation for email and mobile numbers
  - Improved password security requirements
  - Better input sanitization
- **Access Control**: 
  - Role-based access restrictions
  - Enhanced permission checking
  - Better security for sensitive operations

### Technical Updates:
- Enhanced CitizenSideBar and EmployeeSideBar components
- Improved TopBarSideBar integration
- Better state management across authentication flows
- Enhanced error boundary implementations
- Improved logo management with dual logo support

### Global Config Integration:
- `OVERRIDE_ROOT_TENANT_WITH_LOGGEDIN_TENANT`: Multi-tenant context switching
- `allowedUserTypes`: User access control
- `defaultLanding`: Customizable landing page routing
- MDMS-based configuration for login, privacy, and module settings

## [1.9.0-rc2]  [27-Oct-2025]
- Test Build for release after master merge

## [1.9.0-rc1]  [27-Oct-2025]
- Test Build for release

## [1.8.57]  [28-October-2025]

### New Features:
- **Multi-Tenant Support Enhancement**: 
  - Added support for `OVERRIDE_ROOT_TENANT_WITH_LOGGEDIN_TENANT` global config flag
  - Enables better multi-tenant use cases
  - Improved tenant context switching logic
- **Logo Fixes**: 
  - Fixed logo rendering issues in header
  - Updated logo URL configurations
- **Login Flow Improvements**:
  - Enhanced tenant selection flow
  - Better state management for logged-in tenant context

### Technical Updates:
- Updated ULB service to handle override tenant configurations
- Improved state management for tenant switching
- Enhanced error handling in login flow

### Global Config Integration:
- Supports new flag: `OVERRIDE_ROOT_TENANT_WITH_LOGGEDIN_TENANT`
- Backward compatible with existing tenant configurations

## [1.8.55]  [8th-Oct-2025]
- Updated the email and mobilenumber login flow with pattern validation, link instead of toggle and state management fixes

## [1.8.54]  [8th-Oct-2025]
- Updated the validation for email, css fix and email sending in payload while otp flow

## [1.8.53]  [8th-Oct-2025]
- Added dynamicLoginComponent (custom) to be displayed below login card

## [1.8.52]  [7th-Oct-2025]
- Added fix for privacy policy error

## [1.8.51]  [6th-Oct-2025]
- Added the redirection fix in citizen side after login and max length fix for mobile number

## [1.8.50]  [3rd-Oct-2025]
- updated the citizen home page to not to filter the cards using module, directly show citizen menu details

## [1.8.49]  [22-Sep-2025]
- updated the login componenet to handle email based login

## [1.8.47]  [22-Sep-2025]
- Carousel Transitions Added, OTP Page Text bold and minor ui tweeks

## [1.8.46]  [13-Sep-2025]
- Added new logic for language selection page

## [1.8.44]  [15-July-2025]
- Citizen login page continue button added 


## [1.8.43]  [26-June-2025]
- Login and SignUp Pages UI for Sandbox is updated
- Sandbox Product Details Page Updated 

## [1.8.42] [18-Jun-2025]
- Updated the loader logic in login page

## [1.8.41] [12-Jun-2025]
- Introduced new hook useLoginConfig for mdms call

## [1.8.40] [11-Jun-2025]
- Added module name config for login and privacy screen

## [1.8.39] [11-Jun-2025]
- integrated with updated version

## [1.8.38] - [06-June-2025]
- Added Fragment wherever required as older version of react doesn't support <></>
  PrivateRoute is using `component as a prop in index.js file

## [1.8.37] - [04-June-2025]
- Added an additional component Carousel.js
  config updated as per additional carousel component
  Updated FormComposer usage in login.js with conditional banner rendering.
  Leveraged newly added class .login-form-container for styling the Login page.

## [1.8.36]  [27-May-2025]
- FEATURE/CCSD-216 : Privacy component alignment changes

## [1.8.33]  [9-April-2025]
- FEATURE/CCSD-57 :Sandbox Changes

## [1.8.32]  [10-Mar-2025]
- FEATURE/DUCE-0246 :Userprofile password trimming

## [1.8.31]  [10-Mar-2025]
- FEATURE/DUCE-246 :Login page username and password trimming 

## [1.8.30]  [07-Mar-2025]
- BUGFIX/DUCE-243 : Updated breadcrumb and regex validation mapping in user profile

## [1.8.28]  [27-Feb-2025]
- BUGFIX/SN-162 : Citizen sms otp fix

## [1.8.28]  [27-Feb-2025]
- BUGFIX/SN-162 : Citizen otp fix in the Login page.

## [1.8.26]  [21-Feb-2025]
- Publishing a new version for more stability & as part of Components Release

## [1.8.25]  [13-Feb-2025]
- Added id prop for Privacy Component Checkbox

## [1.8.24]  [3-Feb-2025]
- Fixed core issues and related found in PGR Ethopia demo

## [1.8.23]  [3-Feb-2025]
- FEATURE/HCMPRE-1852 : POC for single landing ui for users added extra route for no-top-bar/employee

## [1.8.22]  [3-Feb-2025]
- FEATURE/HCMPRE-2208  : Fixed some loader component issue 
- added new prop called allowedUserTypes to restrict any user type if needed

## [1.8.21]  [1-Feb-2025]
- FEATURE/HCMPRE-1425 : Added the workbench module patches and Updated localisation search screen, and core module #2181
- Upgraded with new Components in core, workbench screens

## [1.8.19]  [23-Jan-2025]
- Fixed import issues of new ui-components

## [1.8.18]  [23-Jan-2025]
- FIxed some of FEATURE/HCMPRE-1852 :: Fixed some console logs 

## [1.8.17]  [23-Jan-2025]
- FIxed some of FEATURE/HCMPRE-1852 :: accessibility issues of dropdown & checkbox(#2120) 

## [1.8.16]  [23-Jan-2025]
- FIxed some of FEATURE/HCMPRE-1852 :: accessibility issues of image(#2120) 

## [1.8.15]  [21-Jan-2025]
- Removed support for any new context path to have employee linked in the url.To use this,the new context path should be linked with employee. 

## [1.8.13]  [16-Dec-2024]
- Made validations for name, mobile number, and password fields in user profile update screen configurable through MDMS data
  - Implemented dynamic regex validation for profile updates based on MDMS data
  - Added support for custom regex patterns through `UserProfileValidationConfig`
  - Example MDMS data: https://github.com/egovernments/egov-mdms-data/blob/UNIFIED-QA/data/mz/commonUIConfig/UserProfileValidationConfig.json

## [1.8.11]  [26-Nov-2024]
- Republished with new component version incremented 

## [1.8.10]  [19-Nov-2024]
- Fixed the module stablity & new components integrated republihsing the same due to component version issue, 

## [1.8.3]
- Fixed the module stablity & new components integrated, sandbox enabled 

## 1.8.2-beta.27
- Integrated new Landingpage card component & its wrapper

## 1.8.2-beta.17
- Integrated new topbar,sidebar and hambuger

## 1.8.2-beta.12
- Updated the css 

## 1.8.2-beta.11
- Changed the policy schema

## 1.8.2-beta.10
- Enchanced Privacy component for table of contents

## 1.8.2-beta.9
- Added classname for languageselection

## 1.8.2-beta.8
- Fixed header logout issue

## 1.8.2-beta.7
- Added privacy component in mdms

## 1.8.2-beta.6
- Fixed forgot password link

## 1.8.2-beta.5
- Added Privacy Component(Don't use beta.4 has issues)

## 1.8.2-beta.4
- Added Privacy Component 

## 1.8.2-beta.2
- Updated LogoutDialog 

## 1.8.2-beta.1
- Fixed the jenkins build issue 

## 1.8.1-beta.23
- Added a new classname to homescreen classes.

## 1.8.1-beta.21
- Updated Toast Component Props.

## 1.8.1-beta.18
- Updated utilities module Kibana logic to support sidebar actions.

## 1.8.1-beta.17
- Updated UI components: Toast, RemovableTag, and ErrorMessage.

## 1.8.1-beta.16
- Updated library with spacers and CSS.
- Modified dropdown in UI components.

## 1.8.1-beta.15
- Updated UI components dropdown option labels.
- Updated version of UI components and CSS.

## 1.8.1-beta.14
- Updated UI components and CSS versions for dropdown option labels and toast info.

## 1.8.1-beta.13
- Updated UI components and CSS versions.

## 1.8.1-beta.12
- Used a new Primary constant color `#c84c0e`.
  - **Note:** Use this version with CSS 1.8.1-beta.8, component 1.8.1-beta.15.

## 1.8.1-beta.11
- Enhancements of components and CSS.

## 1.8.1-beta.10
- Fixed login screen issue.

## 1.8.1-beta.9
- Fixed stability issue.

## 1.8.1-beta.8
- Enhanced to load screen even if MDMS is failing.

## 1.8.1-beta.7
- Added custom support for all SVG icons to be used in the sidebar by specifying the icon as `svg:localairport` (svg:iconname).

## 1.8.1-beta.6
- Resolved duplicacy issue in the Sidebar.

## 1.8.1-beta.5
- Fixed Sidebar Path issue.

## 1.8.1-beta.4
- Added a null check for homescreen landing issue.

## 1.8.1-beta.3
- User profile back button fixes for mobile view.

## 1.8.1-beta.2
- User profile Save and Change Password button fixes for mobile view.

## 1.8.1-beta.1
- Republished after merging with Master due to version issues.

## 1.8.0-beta.16
- Fixed the hardcoded logout message.

## 1.8.0-beta.15
- Fixed the sidebar sort order issue.

## 1.8.0-beta.14

## 1.8.0-beta.13

## 1.8.0-beta.12

## 1.8.0-beta.11
- Republished due to some version issues.

## 1.8.0-beta.10
- Constants updated for mgramsewa.

## 1.8.0-beta.9
- Updated How It Works screen to take header from MDMS config and show PDF card only when required.

## 1.8.0-beta.8
- Redefined additional component to render only under employee home page.

## 1.8.0-beta.6
- Added additional component render for TQM modules.

## 1.8.0
- Workbench v1.0.

## 1.8.0-beta.5
- Fix for login screen alignments.

## 1.8.0-beta.4
- Made the default localisation in global config.

## 1.8.0-beta
- Workbench base version beta release.

## 1.7.0
- Urban 2.9.

## 1.6.0
- Urban 2.8.

## 1.5.43
- Redirection issue fix in case of no roles in selected city.

## 1.5.46
- Added classname for topbar options dropdown.

## 1.5.45
- Alignment issue in edit and logout.

## 1.5.44
- Updated login SCSS and alignment issues.

## 1.5.42
- Fixed the MDMS call in login component for dynamic updating.

## 1.5.41
- Updated the readme content.

## 1.5.40
- Updated the login component to handle MDMS config, which can be accessed from master - `commonUiConfig` and module - `LoginConfig`.

## 1.5.39
- Show the Toast when password changed and need to logout from profile page.

## 1.5.38
- Enabled the admin mode for employee login which can be accessed through route `employee/user/login?mode=admin`.
- Updated to use `formcomposerv2`.

## 1.5.37
- Fixed hiding upload drawer icons.

## 1.5.36
- Fixed error when clicking on change password and then trying to save profile without changing the password.

## 1.5.35
- Fixed user profile email being prefilled when clicking on change password.

## 1.5.34
- Fixed module not found redirection issue.

## 1.5.33
- Fixed payment not throwing error page for sanitation.

## 1.5.32
- Fixed the localisation issue by adding translation to the keys.
- Fixed payment response issue for sanitation UI.

## 1.5.31
- Fixed the all services screen back button for sanitation UI.

## 1.5.30
- Fixed the home routing issue in error screen.

## 1.5.29
- Added the readme file.

## 1.5.28
- Fixed the route issue for profile screen.
