# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### [0.2.5] - 2026-01-02
-New SVG ArrowUp added

### [0.2.4] - 2025-12-05
-New components introduced during studio development : MultiChildFormWrapper and UploadAndDownloadDocumentHandler
- Few enhancements in existing components including formcomposer and inboxsearchcomposer
- New SVGs introduced in customSVG
- exporting all the svg items separately in index.js file as at many places they are being imported directly

### [0.2.3] - 2025-10-23
## 📦 Version Updates

- CSS Library: v0.2.0-beta.15 → v0.2.0-beta.64
- UI Components: Multiple beta version increments

---
⚛️ Atoms (Basic Components)

Button

- ✨ Enhanced button identifier system
- 🔧 Improved accessibility attributes

TextInput

- ✨ Added validation prop for custom validation rules
- ✨ Added pattern prop for input pattern matching
- 🐛 Improved error handling with try-catch blocks
- 🔧 Enhanced input field validation logic

Toggle

- ✨ Added vertical variant for vertical toggle layout
- ✨ Implemented disabled state handling
- 💅 Updated styling for better visual feedback

Tag

- ✨ Added loader prop for showing loading state
- 💅 Enhanced tag component styling

RadioButtons

- ✨ Added custom translation options support
- 🔧 Improved radio button group handling

OTPInput

- 🐛 Minor bug fixes and improvements

---
🧩 Molecules (Composite Components)

CustomDropdown

- ✨ Added MDMS v2 prop support for new data source
- 🔧 Enhanced dropdown configuration options
- 🐛 Fixed dropdown text clearing issue after re-render

ApiDropdown

- 🐛 Fixed API dropdown data fetching issues
- 🔧 Improved error handling for API calls

ResultsDataTable

- ✨ Enhanced to accept custom row components
- ✨ Added pagination support with total count
- 🔧 Improved table rendering performance

FilterCard

- ✨ Added translation support for filter labels
- 💅 Updated filter card styling

SummaryCard

- 🔧 Minor improvements and bug fixes

---
🎯 HOC (Higher Order Components)

InboxSearchComposer

- ✨ Major Enhancement: Added support for custom row components
- ✨ Improved pagination functionality with proper props
- 🐛 Fixed multiple API call issues
- 🐛 Replaced employee with proper userType for actionLink
- 🔧 Enhanced search and submit functionality
- 🔧 Better state management for search results

FormComposerV2

- ✨ Added backButton prop for navigation
- ✨ Enhanced form configuration flexibility
- 🔧 Improved form submission handling

BoundaryFilter

- ✨ Added multi-select and single-select options
- ✨ Enhanced boundary selection logic
- ✨ Improved pre-selection handling
- ✨ Added frozen data support
- 🔧 Better hierarchy management

---
🎨 CSS & Styling Updates

Typography

- 📱 Updated responsive typography for tablet and desktop
- 💅 Enhanced font sizes and line heights
- 🔧 Improved spacing and margins

Component Styles

- ✨ New styles for BoundaryComponent
- 💅 Updated button, card, and field styling
- 💅 Enhanced dropdown and modal styles
- 📱 Improved mobile responsiveness

---
🏗️ Infrastructure & Build

CI/CD

- ✨ Added comprehensive GitHub Actions workflow
- ✨ Multi-architecture Docker build support (amd64, arm64)
- 🔧 Improved build pipeline configuration

Docker

- 📦 Updated Dockerfiles for better optimization
- 🔧 Enhanced container build process

---
🌍 Localization & Configuration

Localization

- 🐛 Fixed localization search query issues
- ✨ Enhanced translation support across components
- 🔧 Improved language switching functionality

App Configuration

- ✨ Better tab change handling
- 🔧 Optimized configuration loading
- 🐛 Fixed configuration-related bugs

---
🐛 Notable Bug Fixes

1. Submit button tag rendering fixed
2. Dropdown text clearing issue resolved
3. Pagination props properly passed to components
4. API dropdown data fetching stabilized
5. Multiple API call prevention in search composers
6. Form validation improvements

---
⚠️ Potential Breaking Changes

- Components now require specific prop formats for MDMS v2
- Pagination implementation may require prop updates
- Custom row components in tables need specific structure

---
📊 Summary

This version represents a major update focusing on:
- Enhanced component flexibility and configurability
- Improved error handling and validation
- Better performance and UX
- Comprehensive styling updates
- Robust build and deployment infrastructure

### [0.2.0-rc.1] - 2025-10-23
## Fix
- test build

### [0.2.0-beta.100] - 2025-10-23
## Fix
- test build

### [0.2.0-beta.68] - 2025-10-17
## Fix
- Removed Logout button from Hamburger if user not logged in.

### [0.2.0-beta.67] - 2025-10-16
## Fix
- Replaced employee with proper userType for actionLink in InboxSearchComposer

### [0.2.0-beta.66] - 2025-09-12
## Enhancement
- Added Pagination fixes for InboxSearchComposer

### [0.2.0-beta.65] - 2025-08-20
## Added Dependent Field Wrapper and Filter
- Added documentation

### [0.2.0-beta.64] - 2025-08-05
## Enhancement
- Added documentation

### [0.2.0-beta.63] - 2025-08-05
## Enhancement
- Submit button tag fixed

### [0.2.0-beta.62] - 2025-08-05
## Enhancement
- All buttons to have default logic to autogenerate unique html id attribute

### [0.2.0-beta.61] - 2025-08-05
## Enhancement
- Added validation and pattern prop for textinput in formcomposer

### [0.2.0-beta.60] - 2025-08-05
## Features
- Fixes for button unique identifier


### [0.2.0-beta.51] - 2025-07-16
## Features
- app-screen-builder bug bash fixes-> pop up data resetting

### [0.2.0-beta.47] - 2025-07-11
## Features
- Added app-screen-builder feature: Introduced a set of components and utilities for dynamic app configuration screens, including AppConfigurationWrapper, AppFieldComposer, AppFieldScreenWrapper, DrawerFieldComposer, and more.
- All UI component imports in app-screen-builder now use local atoms instead of package imports.
- Enhanced modularity and maintainability for app configuration flows.

### [0.2.0-beta.44] - 2025-07-03
## Enhancements
- Added disabled state for the toggle

### [0.2.0-beta.43] - 2025-07-01
## Enhancements
- Added Citizen form composer to render based on routes

### [0.2.0-beta.42] - 2025-07-01
## Enhancements
- Added loader in tag

### [0.2.0-beta.41] - 2025-06-27
## Enhancements
- Fixed pagination issue in ResultsTableWrapper(for inboxSearchComposer)

### [0.2.0-beta.40] - 2025-06-24
## Enhancements
- Fixed pagination issue in inbox search composer

### [0.2.0-beta.39] - 2025-06-23
## Enhancements
- Fixed show toast null issue for config change

### [0.2.0-beta.38] - 2025-06-19
## Enhancements
- Added min and max validation for date

### [0.2.0-beta.37] - 2025-06-18
## Enhancements
- Removed few logs & errors

### [0.2.0-beta.36] - 2025-06-18
## Enhancements
- added new date format

### [0.2.0-beta.34] - 2025-06-12
## Enhancements
- added vertical variant to toogle

### [0.2.0-beta.33] - 2025-06-10
## Enhancements
- added props to custom row component in results 

### [0.2.0-beta.32] - 2025-06-09
## Enhancements
- updated svg 

### [0.2.0-beta.31] - 2025-06-09
## Enhancements
- updated svg 

### [0.2.0-beta.30] - 2025-06-09
## Enhancements
- fixed toogle disable prop to disable a particular option

### [0.2.0-beta.29] - 2025-06-05
## Enhancements
- Added toogle disbale prop to disable a particular option

### [0.2.0-beta.28] - 2025-06-04
## Enhancements
- Added icon props for formcomposer action buttons 

### [0.2.0-beta.27] - 2025-06-03
## Enhancements
- Sending tabData as a prop to Custom Row Component

### [0.2.0-beta.26] - 2025-06-02
## Enhancements
- Added TabInactive Svg

### [0.2.0-beta.25] - 2025-06-02
## Enhancements
- Added mdms and t selection Tag 

### [0.2.0-beta.24] - 2025-06-02
## Enhancements
- Added custom translation for radio button and selection Tag 

### [0.2.0-beta.23] - 2025-05-30
## Enhancements
- Fixed Total Count value issue in Inbox 

### [0.2.0-beta.22] - 2025-05-30
## Enhancements
- Adding Try/Catch Block onChange trigger for Date in TextInput 

### [0.2.0-beta.21] - 2025-05-30
## Enhancements
- Commented unwanted onChange trigger for Date in TextInput 
- Added custom Translation for FieldV1

### [0.2.0-beta.20] - 2025-05-29
## Enhancements
- Enhancement in InboxSearchComposer to accept custom row component

### [0.2.0-beta.19] - 2025-05-22
## Updates
- Added translation for filter card labels

### [0.2.0-beta.18] - 2025-05-20
## Updates
- Fixed logic issue is sidebar highlighting


### [0.2.0-beta.17] - 2025-05-20
## Updates
- Added custom highlighting logic in sidebar for sandbox-ui


### [0.2.0-beta.16] - 2025-05-19
## Updates
- Added url based highlighting in sidebar


### [0.2.0-beta.14] - 2025-04-28
## Updates
- Added `BoundaryFilter` HOC component to enable hierarchical administrative boundary selection.
- Allowed standalone rendering of the `BoundaryFilter` component.
- Integrated `BoundaryFilter` into `FormComposer` and `InboxSearchComposer` for boundary-based filtering.


### [0.2.0-beta.13] - 2025-04-24
## Updates
- CustomDropdown now supports MultiselectDropdown 
- Added classname and styles for section subheader in form 
- Removed unnecessary div if description orerror or charCount is not present

### [0.2.0-beta.12] - 2025-04-16
## Updates
- Fixed default data in form composer

### [0.2.0-beta.11] - 2025-04-16
## Updates
- Added classname in header and subHeader

### [0.2.0-beta.8] - 2025-04-03
## Updates
- Version Update for stability 

### [0.2.0-beta.7] - 2025-03-26
## Enhancements & New features
## Edit Row data within InboxSearchComposer within rows and with popups based on config
## Added customizers support i.e., we don't need to mention functions in UICustomizations.js we can directly mention within component level

### [0.2.0-beta.5] - 2025-03-26
## Fixes
- Fixed Tab Functionality in InboxSearchComposer

### [0.2.0-beta.3] - 2025-03-20
## Fixes
- Fixed multiple calls issue in InboxSearchLinks
- Fixed onSubmit function for FilterCard

### [0.2.0-beta.2] - 2025-03-13
## Enhancements
- Multiselect Dropdown now supports adding limit for chips and onClick function

## New Changes Added
- InboxSearchComposer now supports footer actions
- Updated the config structure for results table - inbox and search screens


## [0.2.0-beta.1] - 2025-03-06 
## New Components Added 
- ResultsDataTableWrapper and ResultsDataTable components were added
- Integrated InboxSearchComposer with ResultsDataTableWrapper

## Enhancements in Multiselectdropdown
- Limiting chips to be shown functionality 
- Frozen Data functionality
- Searchable functionality for nested multiselect variant 

## Other Changes
- Added onClose function as a prop in SidePanel

## [0.2.0] - 2025-02-19 
### New Components Added

## Atoms
- Accordion
- ActionButton
- AlertCard
- BackLink
- BreadCrumb
- Button
- CheckBox
- Chip
- Divider
- Dropdown
- Panels
- FileUpload
- Loader
- MultiselectDropdown
- OTPInput
- RadioButton
- SelectionTag
- Stepper
- Switch
- Tab
- Tag 
- TextBlock
- TextInput 
- Timeline
- Toast
- Toggle
- Tooltip

## Molecules
- AccordionList
- PopUp
- Card (Basic,FormCard,SummaryCard)
- BottomSheet
- ButtonGroup
- Header
- SidePanel
- PanelCard
- FilterCard
- Footer
- Hamburger
- LandingPageCard
- MenuCard
- MetricCard
- SideNav
- TableMolecule
- TimelineMolecule
- TooltipWrapper

## MoleculeGroup
- LandingPageWrapper
- MenuCardWrapper

### New Changes Added
- Added external link support in LandingPageCards
- Added external link support in BreadCrumbs
- Added Spacers, Colors, Typography library
- Added Icons 
- Added Animations 
- Added Error Message Component. 
- Added Info Button Component.  
- Added RemoveableTag Component. 
- Added Uploader Component With Three Varinats UploadFile,UploadPopup and UploadImage.
- Supporting multiple variants in Dropdown and MultiSelectDropdown components


## [0.0.2-beta.66] - 2025-02-13
### New Changes
- Added id prop for checkox input

## [0.0.2-beta.65] - 2025-01-27
### New Changes
- ViewCard is renamed as SummaryCard
- ViewCardFieldPair is renamed as SummaryCardFieldPair
- Header is renamed as HeaderComponent
- TopBar is renamed as Header
- Hamburger is renamed as HamburgerButton
- MobileSideNav is renamed as Hamburger
- LoaderScreen Component is removed
- LoaderComponent is renamed as Loader

## [0.0.2-beta.60] - 2024-12-26
### New Changes
- SelectionCard Component is renamed as SelectionTag Component
- AccordionWrapper Molecule is renamed as AccordionList
- Sidebar Molecule is renamed as SideNav
- MobileSideBar Molecule is renamed as MobileSideNav
- SlideOverMenu Molecule is renamed as SidePanel
- InfoCard Component is renamed as AlertCard
- Uploader Component is renamed as FileUpload
- ActionBar Component is renamed as Footer

## [0.0.2-beta.56] - 2024-11-16
### New Changes
- Added id for every field use with digit-ui-libraries with v1.8.5 for proper integartion

## [0.0.2-beta.54] - 2024-11-16
### New Changes
- Fixed Navigation redirection for landing page card if it is an external url.


## [0.0.2-beta.51] - 2024-11-06
### New Changes
- ButtonsGroup has been renamed as ButtonGroup

## [0.0.2-beta.50] - 2024-10-29
### New Changes
- Updated Breadcrumb crumb.path property to crumb.internalLink or crumb.externalLink

## [0.0.2-beta.46] - 2024-10-11
### New Changes
- Added MaterialUI Icons,Updated Colors and Spacers Stories

## [0.0.2-beta.44] - 2024-10-07
### New Changes
- Added NestedTable, FilterCard and FormCards

## [0.0.2-beta.42] - 2024-09-23
### New Changes
- Added Table Molecule 

## [0.0.2-beta.41] - 2024-09-19
### New Changes
- Added OTPInput 

## [0.0.2-beta.40] - 2024-09-18
### New Changes
- Added ChipsKey for Multiselectdropdown and configuration for close icon in chips

## [0.0.2-beta.39] - 2024-09-12
### New Changes
- Added Tab Component and other changes

## [0.0.2-beta.38] - 2024-09-12
### fixes
- Css version fix 

## [0.0.2-beta.37] - 2024-09-06
### New Changes
- Css version fix 

## [0.0.2-beta.36] - 2024-09-06
### New Changes
- Updated SelectionCard Component 

## [0.0.2-beta.35] - 2024-09-06
### New Changes
- Added LandingPageCard,MenuCard Molecules

## [0.0.2-beta.34] - 2024-09-05
### New Changes
- Updated Accordion with animation

## [0.0.2-beta.33] - 2024-09-04
### New Changes
- Added BottomSheet Draggable Functionality

## [0.0.2-beta.32] - 2024-09-04
### New Changes
- Updated Tooltip with header and description

## [0.0.2-beta.28] - 2024-08-29
### New Changes
- Updated Sidebar and added AccordionWrapper

## [0.0.2-beta.27] - 2024-08-27
### New Changes
- Fixed MobileSidebar issue 

## [0.0.2-beta.26] - 2024-08-27
### New Changes
- Changed Classname for Submitbar disabled

## [0.0.2-beta.25] - 2024-08-22
### New Changes
- Updated Sidebar,SVGs,Added Spacers and Accordion

## [0.0.2-beta.24] - 2024-08-16
### New Changes
- Added Switch Component

## [0.0.2-beta.22] - 2024-08-07
### New Changes
- Fixes on usgae of utils

## [0.0.2-beta.22] - 2024-08-07
### New Changes
- Updated Tooltip Component

## [0.0.2-beta.21] - 2024-08-02
### New Changes
- Added Tag Component

## [0.0.2-beta.20] - 2024-07-30
### New Changes
- Added Error State for Timeline, SelectionCard Component

## [0.0.2-beta.18] - 2024-07-24
### New Changes
- Fixed header dropdown selection

## [0.0.2-beta.17] - 2024-07-23
### New Changes
- Updated multiselectdropdown

## [0.0.2-beta.16] - 2024-07-22
### New Changes
- Updated prop for Menu

## [0.0.2-beta.15] - 2024-07-18
### New Changes
- Added translation for option label

## [0.0.2-beta.14] - 2024-07-16
### New Changes
- Added Sidebar and Hamburger
- Updated Colors as constants


## [0.0.2-beta.13] - 2024-07-08
### New Changes
- Updated Button OnClick and added digit footer images 

## [0.0.2-beta.12] - 2024-07-05
### New Changes
- Updated Button


## [0.0.2-beta.11] - 2024-07-04
### New Changes
- Added ActionBar, Header, ActionButton variant for Button
- Updated Timeline Molecule 

## [0.0.2-beta.10] - 2024-06-28
### New Changes
- Added Card Variants 

## [0.0.2-beta.9] - 2024-06-25
### New Changes
- Updated Uploader preview 

## [0.0.2-beta.8] - 2024-06-24
### New Changes
- Added Title prop for Button

## [0.0.2-beta.7] - 2024-06-24
### New Changes
- Added ViewMore button for Timeline Molecule. 

## [0.0.2-beta.6] - 2024-06-19
### New Changes
- Added BreadCrumb Component. 

## [0.0.2-beta.5] - 2024-06-17
### New Changes
- Added Timeline Molecule. 

## [0.0.2-beta.4] - 2024-06-15
### Changed
- fix: Fixed prop for the document upload.

## [0.0.2-beta.3] - 2024-06-14
### Changed
- Updated Storybook
- Modified BackButton as BackLink

## [0.0.2-beta.1] - 2024-06-04
### Changed
- Updated Popup Classname
- Added InfoCard Header Classname

## [0.0.2] - 2024-06-03
- New components and enhancements for old components

### New Changes

- Added Error Message Component. 
- Added Info Button Component. 
- Added Panels Component. 
- Added Popup Component With Two Variants defualt and alert. 
- Added RemoveableTag Component. 
- Added Stepper Component.
- Added TextBlock Component.
- Added Timeline Component.
- Added Uploader Component With Three Varinats UploadFile,UploadPopup and UploadImage.
- Added PanelCard Molecule.

### Enhancements 

- Updated Button Component Styles. 
- Updated Dropdown Component Styles and Added SelectAll Option. 
- Updated InfoCard Component Styles. 
- Added Animation for Toast. 
- Added new prop named type for Toast replacing the separate props for `info`, `warning`, and `error`. 
- Updated Typography with lineHeight 
- Updated Color Typography

## [0.0.1-beta.32] - YYYY-MM-DD
### Changed
- Updated Panel Success Animation

## [0.0.1-beta.31] - YYYY-MM-DD
### Added
- New prop named `activeSteps` in Stepper

## [0.0.1-beta.30] - YYYY-MM-DD
### Changed
- Updated Panel Animation Styles

## [0.0.1-beta.29] - YYYY-MM-DD
### Added
- PopUp, Panels, and Panel Cards

## [0.0.1-beta.28] - YYYY-MM-DD
### Added
- `restrictSelection` prop in MultiSelectDropdown

## [0.0.1-beta.27] - YYYY-MM-DD
### Added
- Uploader variants and its CSS

## [0.0.1-beta.26] - YYYY-MM-DD
### Changed
- Updated Toast Usage

## [0.0.1-beta.25] - YYYY-MM-DD
### Changed
- Updated RemoveableTag component to have error 

## [0.0.1-beta.24] - YYYY-MM-DD
### Changed
- Updated numeric type to disable input and use only buttons 
- Made date and time fields clickable

## [0.0.1-beta.23] - YYYY-MM-DD
### Added
- New props `showIcon`, `truncateMessage`, and `maxLength` to ErrorMessage component

## [0.0.1-beta.22] - YYYY-MM-DD
### Changed
- `Toast` component now has a new prop `type`, replacing the separate props for `info`, `warning`, and `error`

## [0.0.1-beta.21] - YYYY-MM-DD
### Added
- `categorySelectAllState` in the nestedmultiselect variant of MultiSelectDropdown

## [0.0.1-beta.20] - YYYY-MM-DD
### Changed
- Updated MultiSelectDropdown `categoryselectall` functionality 
- Added key navigation for dropdown options 

## [0.0.1-beta.19] - YYYY-MM-DD
### Changed
- Made CheckBox more customizable 
- Added custom color for Button

## [0.0.1-beta.18] - YYYY-MM-DD
### Changed
- Updated dropdown option labels

## [0.0.1-beta.17] - YYYY-MM-DD
### Changed
- Updated Toast info variant CSS 
- Updated category option CSS 

## [0.0.1-beta.16] - YYYY-MM-DD
### Added
- Error boundary atom

## [0.0.1-beta.15] - YYYY-MM-DD
### Added
- Info variant for Toast

## [0.0.1-beta.14] - YYYY-MM-DD
### Changed
- Updated dropdown options label to use `optionsKey`

## [0.0.1-beta.13] - YYYY-MM-DD
### Changed
- Updated nested and tree dropdown variant

## [0.0.1-beta.12] - YYYY-MM-DD
### Changed
- Enhancements of components

## [0.0.1-beta.11] - YYYY-MM-DD
### Changed
- Updated `mobilenumber` classname

## [0.0.1-beta.10] - YYYY-MM-DD
### Changed
- Updated header and textinput classnames

## [0.0.1-beta.9] - YYYY-MM-DD
### Changed
- Updated key to `IS_STRING_MANIPULATED`

## [0.0.1-beta.8] - YYYY-MM-DD
### Changed
- Updated the string manipulation based on `globalConfig` flag `isStringManipulated`

## [0.0.1-beta.7] - YYYY-MM-DD
### Changed
- Updated classnames 

## [0.0.1-beta.6] - YYYY-MM-DD
### Changed
- Updated version

## [0.0.1-beta.5] - YYYY-MM-DD
### Changed
- Modified classnames

## [0.0.1-beta.4] - YYYY-MM-DD
### Fixed
- Fixed some date issues 

## [0.0.1] - 2024-03-22
### Added Base version
- Button Component. 
- Dropdown Component. 
- InfoCard Component. 
- Toast. 
- Input fields. 
