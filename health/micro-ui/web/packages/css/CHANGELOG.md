# Changelog

<<<<<<< HEAD:health/micro-ui/web/packages/css/CHANGELOG.md
## 0.3.5 - 2025-7-17

#### Admin console
  1. added the missing css


## 0.3.4 - 2025-7-16

#### Admin console
  1. App configuration CSS
  2. Updated Console CSS

## 0.3.3 - 2025-7-10

#### Admin console
  1. App configuration CSS
  2. Updated Console CSS


## 0.3.2 - 2025-3-19
#### Admin console , Microplan & Payments
  1. Updated Payment module CSS

## 0.3.1 - 2025-2-11

#### Admin console , Microplan & Payments

1. Campaign Manager Module CSS
2. Boundary Manager Module CSS
3. Microplan Module CSS
4. Payments Module CSS
5. Other Core Override CSS

## 0.3.0 - 2024-12-03

#### Base Admin console & microplan web

1. Campaign Manager Module CSS
2. Boundary Manager Module CSS
3. Microplan Module CSS
4. Other Core Override CSS

## [0.1.20]

- Updated Loader with text styles

## [0.1.1]

- Base CSS
=======
## [1.9.0] - [28-October-2025]

### 🚀 Enhanced CSS Framework & Design System

#### 🎨 Major UI/UX Design Overhaul:
- **Card-Based Interface System**: 
  - Complete MDMS interface redesign with modern card layouts
  - Enhanced card components with hover states and transitions
  - Responsive card grid systems for all screen sizes
  - Improved card accessibility with proper focus states
- **Modern Design Language**: 
  - Updated visual hierarchy with consistent spacing
  - Enhanced color palette with improved contrast ratios
  - Modern typography system with improved readability
  - Consistent component styling across all modules

#### 🏗️ Sandbox & Platform Styling:
- **Comprehensive Sandbox UI Enhancement**: 
  - Landing Page complete redesign with modern aesthetics
  - Product Page styling with improved information architecture
  - Details Page enhanced with better data presentation
  - OTP Carousel styling for better user experience
- **Login & Authentication Styling**: 
  - Enhanced Carousel.scss for login screen layouts
  - Improved login-form-container class for banner image support
  - Better FormComposer styling in login contexts
  - Responsive authentication flows for all devices

#### 📱 Mobile & Responsive Enhancements:
- **Mobile-First Design**: 
  - Enhanced mobile navigation and interaction patterns
  - Improved touch targets and gesture support
  - Better mobile typography and spacing
  - Responsive breakpoint optimizations
- **Cross-Platform Consistency**: 
  - Consistent styling across desktop, tablet, and mobile
  - Enhanced progressive web app styling
  - Better performance on low-end devices

#### 🛠️ Component System Improvements:
- **Enhanced Form Components**: 
  - Improved form field styling with better validation states
  - Enhanced form layouts and responsive behavior
  - Better error messaging and success state styling
  - Improved accessibility for form interactions
- **Advanced Table & Data Display**: 
  - Enhanced table styling with better sorting indicators
  - Improved pagination component styling
  - Better data visualization support
  - Enhanced responsive table patterns

#### 🎯 Module-Specific Styling:
- **Workbench Module Enhancement**: 
  - Complete workbench interface redesign
  - Enhanced MDMS management interface styling
  - Better bulk upload and download UI styling
  - Improved JSON editor integration styling
- **Core Module Styling**: 
  - Enhanced topbar, breadcrumb, and actionbar styling
  - Improved sidebar navigation with better hierarchy
  - Enhanced toast notifications with error/success styling
  - Better modal and popup component styling

#### 🔧 Technical Improvements:
- **SCSS Architecture**: 
  - Modular SCSS structure with better organization
  - Enhanced variable system for consistency
  - Improved mixin library for reusability
  - Better build optimization and compilation
- **Performance Optimizations**: 
  - Reduced CSS bundle size through optimization
  - Better critical CSS handling
  - Enhanced loading performance
  - Improved browser compatibility

### Accessibility & Standards Compliance:
- **WCAG 2.1 AA Compliance**: Enhanced accessibility across all components
- **Keyboard Navigation**: Improved focus management and navigation
- **Screen Reader Support**: Better ARIA implementation and semantic markup
- **Color Contrast**: Improved contrast ratios for better readability

### Browser & Platform Support:
- **Enhanced Browser Support**: Better compatibility across modern browsers
- **Progressive Enhancement**: Graceful degradation for older browsers
- **Performance**: Optimized CSS delivery and rendering
- **Mobile Optimization**: Enhanced mobile browser performance

### Design System Integration:
- **DIGIT v2 Design System**: Full integration with updated design tokens
- **Color System**: Enhanced primary color (#c84c0e) with better variants
- **Typography Scale**: Improved typography hierarchy and responsive scaling
- **Spacing System**: Consistent spacing scale across all components

### Bug Fixes & Refinements:
- Fixed toast error message width issues in Property Tax module
- Resolved extra margin issues in inbox search and employee pages
- Fixed login styling and alignment issues across modules
- Improved language selection dropdown styling
- Enhanced loader and loading state styling
- Fixed mobile view issues for detail modals
- Improved bulk upload UI and toast styling

### Platform-Specific Enhancements:
- **Multi-Tenant Styling**: Enhanced support for tenant-specific theming
- **Government Portal Styling**: Improved styling for government service portals
- **Citizen Interface**: Enhanced citizen-facing interface styling
- **Employee Dashboard**: Improved employee interface styling


## [1.9.0-rc2]  [27-Oct-2025]
- Test Build for release after master merge

## [1.9.0-rc1]  [27-Oct-2025]
- Test Build for release

## [1.8.42] - [22-Sept-2025]

- Sandbox ui style changes (Landing Page/Product Page/Details Page/OTP Carousel) / CCSD-833 

## [1.8.41] - [26-Aug-2025]

- Removed the extra margin below in inbox search of ws module

## [1.8.40] - [25-Aug-2025]

- Toast error message width issue in Property Tax module(sandbox)
  
## [1.8.39] - [19-Aug-2025]

- Removed extra margin on employee pages in the sandbox



## [1.8.38] - [14-Aug-2025]
-Removed the login extra space in the sandbox

## [1.8.37] - [12-Aug-2025]
-Override citizen side styles CCSD-622,474,458 

## [1.8.36] - 04-Aug-2025
- Removed right border from `.bannerLogo` on the sandbox language-selection page.
  
## [1.8.31] - [12-June-2025]
-CSS changes for Forgot Password form
-Font size changed to make it aligned with carousel

## [1.8.30] - [11-June-2025]
-Override `digit-label-field-pair` class in `login-container`

## [1.8.29] - [09-June-2025]
-Override `digit-label-field-pair` class in `login-container`

## [1.8.28] - [04-June-2025]
- Added `Carousel.scss` for login screen layout.

## [1.8.27] - [04-June-2025]
- Added `Carousel.scss` for login screen layout.
- Introduced `.login-form-container` class to scope styles for FormComposer in login in case of bannerImages.

## [1.8.25]  [8-April-2025]
- Publishing a new version for Sandbox change

## [1.8.21]  [3-Mar-2025]
- Publishing a new version for json edit button alignment

## [1.8.15]  [21-Feb-2025]
- Publishing a new version for more stability & as part of Components Release

## [1.8.14]  [19-Feb-2025]
FEATURE/DUCE-244 : - Intergrated with react json editor and provided a p…

## [1.8.13]  [1-Feb-2025]
- FEATURE/HCMPRE-1425 : Added the workbench module patches and Updated localisation search screen, and core module #2181
- Upgraded with new Components in core, workbench screens

## [1.8.10]  [19-Nov-2024]
- Republihsing the same due to component version issue, 

## [1.8.3]
- Updated Landing page css and made the stable version with new components integrated core + sandbox

## [1.8.2-beta.49]
- Updated Loader with text styles

## [1.8.2-beta.28]
- Fixed the loader style 

## [1.8.2-beta.20]
- Updated topbar,breadcrumb,actionbar,toast,sidebar css.

## [1.8.2-beta.9]
- Updated LanguageSelection Style.

## [1.8.2-beta.7]
- Fixed LanguageSelection style.

## [1.8.2-beta.3] [06-06-2024]
- added audit history styles

## [1.8.2-beta.2]
- Updated LogoutDialog Popup styles.

## [1.8.2-beta.1]
- Formatted changelog file.

## [1.8.1-beta.11]
- Updated styles for language selection dropdown options card.

## [1.8.1-beta.10]
- Fixed login header alignment.

## [1.8.1-beta.8]
- Used a new Primary constant color "#c84c0e".
  - **Note:** Use this version with component 1.8.1-beta.15 and core 1.8.1-beta.12.

## [1.8.1-beta.7]
- Added CSS for Loader With Gap.
- Added CSS for viewcomposer header.

## [1.8.1-beta.5]
- Added CSS for Tab InboxSearchComposer.

## [1.8.1-beta.2]
- Added CSS for create hierarchy.

## [1.8.1-beta.1]
- Republished after merging with Master due to version issues.

## [1.8.0-beta.20]
- Added CSS for info message in localisation screen.

## [1.8.0-beta.19]
- Improved Bulk Upload and Bulk Upload Toast CSS.

## [1.8.0-beta.18]
- Added bulk upload CSS.

## [1.8.0-beta.17]
- Fixed mobile view issue for detail modals.

## [1.8.0-beta.16]
- Added styles for detail modals.

## [1.8.0-beta.15]
- Added styles for multi select dropdowns.

## [1.8.0-beta.14]
- Added tour help styles.

## [1.8.0-beta.13]
- Fixed the login text styling issue.

## [1.8.0]
- Workbench v1.0.

## [1.8.0-beta.1]
- Added styles for login dropdown and homepage dropdowns.

## [1.8.0-beta]
- Added workbench related CSS and some new Digit v2 constants based on em.

## [1.7.0]
- Urban 2.9.

## [1.6.0]
- Urban 2.8.

## [1.5.41]
- Added styles for login dropdown and homepage dropdowns.

## [1.5.40]
- Fixed alignment issue in edit and logout.

## [1.5.39]
- Updated login SCSS and fixed alignment issues.

## [1.5.37]
- Updated the README content.

## [1.5.36]
- Enhanced the formcomposer with header attribute.

## [1.5.35]
- Fixed the card CSS issues.

## [1.5.34]
- Fixed breadcrumb styling issue.

## [1.5.33]
- Fixed some card-related CSS issues due to v2 CSS.

## [1.5.32]
- Added newer CSS DIGITv2 and corrected a few existing issues.

## [1.5.31]
- Corrected the CSS for inbox composers and default core UI.

## [1.5.30]
- Updated the CSS for dynamic dropdown filter DSS.

## [1.5.29]
- Fixed layout issues.

## [1.5.28]
- Horizontal Bar chart alignment fixes.

## [1.5.27]
- DSS UI alignment fixes for Horizontal Metric and bar chart.

## [1.5.26]
- Added new CSS class for DSS enhancements.

## [1.5.25]
- Added the CSS of inbox search composers.

## [1.5.24]
- Added the README file.

## [1.5.23]
- Base version.
>>>>>>> 9a51c39ff5197a546a44da8e65d2932c915ab826:micro-ui/web/micro-ui-internals/packages/css/CHANGELOG.md
