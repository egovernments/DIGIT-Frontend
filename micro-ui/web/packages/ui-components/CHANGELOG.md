# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0-dev-15] [18-Dec-2025]
- Added disableClearAll prop in MultiselectDropdown component

## [2.0.0-dev-05] [27-Nov-2025]
- Fixed dropdown css issue and Added required prop in Checkbox

## [2.0.0-dev-04] [26-Nov-2025]
- Added createPortal support to render dropdown options at document body level, preventing options from being clipped by parent containers with overflow: hidden or lower z-index.

## [2.0.0-dev-03] [26-Nov-2025]
- Updated Controller render props from ({ onChange, ref, value }) to ({ field }) pattern
- Fixed form inputs not working in InboxSearchComposer and FormComposerV2
- Fixed MobileDetailsOnClick error in mobile view

## [2.0.0-dev-02] [13-Nov-2025]
- Added removeMargin prop to CheckBox component
- Disabled sort icon based on enableColumnSort prop
- Added onClearSearch callback support in SearchComponent
- Modified error display logic in FormComposer with showFieldLevelErrors and showFormLevelErrorToast checks.
- Added custom classnames support in DateRange component

## [2.0.0-dev-01] [29-Aug-2025]
- Merged with latest react 17 master changes

## [2.0.0-rc19-02] [29-Seo-2025]
- Advanced webpack optimization for comprehensive UI component library

## [2.0.0-rc19-01] [26-Aug-2025]
- Advanced webpack optimization for comprehensive UI component library
- Full CSS modules support with auto-detection for .module.css files
- Enhanced asset handling for fonts, images, and static resources
- Performance budget increased to 750KB for full-featured component library
- Externalized form libraries (react-hook-form, react-datepicker) to prevent conflicts
- Modern Babel configuration with smart polyfill injection
- Tree-shaking optimization with module concatenation in production
- Added build caching and console removal in production
- Bundle analysis command: yarn build:analyze
- Optimized dev server with HMR on port 3004

## [0.2.0-beta.40-rc19.02] [28-Jun-2025]
-New css classes introduced in index.css and submitbar.css for keyboard focus accessibilty
-Keyboard and screen reader accessibilty implemented to each atoms, molecules and HOCs

## [0.2.0-beta.40-rc19.01] [27-Jun-2025]
- ui-components(0.2.0-beta.40) from develop Upgraded to react19
- webpack for build
- npm packages upgraded and syntax changed to make them react19 compatible
- react, react-dom, react-router-dom and @tanstack/react-query are in peer dependencies now to avoid version conflict

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
