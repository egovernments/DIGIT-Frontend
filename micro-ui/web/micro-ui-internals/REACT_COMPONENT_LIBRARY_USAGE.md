# React Component Library Usage Documentation

This document provides a comprehensive inventory of pages and components that are still using the legacy React component library (`@egovernments/digit-ui-react-components`) in the DIGIT-Frontend codebase.

## Executive Summary

- **Total Files Found:** 51 files
- **Component Categories:** Forms, UI Layout, Icons, Navigation, Data Display, File Upload, Interactive
- **Primary Usage Areas:** Workbench module, Core module, Customizations, Main web application

## Detailed Component Inventory

### 1. Customization Components (5 files)

#### Property Tax (PT) Customizations
- **PTAllotmentDetails.js** (`/micro-ui/web/src/Customisations/pt/pageComponents/`)
  - Line 1: `CardLabel`, `CitizenInfoLabel`, `FormStep`, `LabelFieldPair`, `TextInput`, `CardLabelError`

- **PTVasikaDetails.js** (`/micro-ui/web/src/Customisations/pt/pageComponents/`)
  - Line 1: `CardLabel`, `CitizenInfoLabel`, `FormStep`, `LabelFieldPair`, `TextInput`, `CardLabelError`

- **PTBusinessDetails.js** (`/micro-ui/web/src/Customisations/pt/pageComponents/`)
  - Line 1: `CardLabel`, `CitizenInfoLabel`, `FormStep`, `LabelFieldPair`, `TextInput`, `CardLabelError`

- **PropertyUsageType.js** (PT) (`/micro-ui/web/src/Customisations/pt/pageComponents/`)
  - Lines 1-3: `CardLabel`, `CardLabelError`, `CitizenInfoLabel`, `Dropdown`, `FormStep`, `LabelFieldPair`, `RadioButtons`

#### Trade License (TL) Customizations
- **PropertyUsageType.js** (TL) (`/micro-ui/web/src/Customisations/tl/pageComponents/`)
  - Lines 1-3: `CardLabel`, `CardLabelError`, `CitizenInfoLabel`, `Dropdown`, `FormStep`, `LabelFieldPair`, `RadioButtons`

### 2. Workbench Module (26 files)

#### Employee Pages (14 files)

**MDMS Management**
- **MDMSManageMaster.js** (`/packages/modules/workbench/src/pages/employee/`)
  - Line 1: `AddFilled`, `Button`, `Header`, `InboxSearchComposer`, `Dropdown`, `Card`

- **MDMSAdd.js**
  - Line 1: `Loader`, `FormComposerV2`

- **MDMSAddV2.js**
  - Line 1: `Card`, `SVG`

- **MDMSAddV4.js**
  - Line 1: `Card`, `Loader`, `SVG`

- **MDMSSearch.js**
  - Line 1: `AddFilled`, `Button`, `Header`, `InboxSearchComposer`, `Loader`

- **MDMSSearchv2.js**
  - Line 1: `AddFilled`, `Button`, `Header`, `InboxSearchComposer`, `Dropdown`, `SubmitBar`, `ActionBar`

- **MDMSSearchv2Popup.js**
  - Line 1: `AddFilled`, `Button`, `Header`, `InboxSearchComposer`, `Loader`, `Dropdown`, `SubmitBar`, `ActionBar`, `Close`

**Localization Management**
- **LocalisationAdd.js**
  - Lines 2-21: `Card`, `CustomDropdown`, `Button`, `AddFilled`, `ActionBar`, `SubmitBar`, `Table`, `TextInput`, `LabelFieldPair`, `CardLabel`, `Header`, `InfoBannerIcon`, `UploadFile`, `DeleteIconv2`, `FileUploadModal`, `BreakLine`, `InfoIconOutline`, `UploadIcon`

- **LocalisationSearch.js**
  - Line 1: `AddFilled`, `Button`, `Header`, `InboxSearchComposer`, `WorkflowModal`, `ActionBar`, `SubmitBar`, `InfoBanner`

**Boundary Management**
- **UploadBoundary.js**
  - Line 2: `CardLabel`, `Header`, `Card`, `LabelFieldPair`, `DownloadIcon`, `Button`, `CustomDropdown`

- **BoundaryUploadPure.js**
  - Lines 2, 4, 6: `CardLabel`, `Header`, `Card`, `LabelFieldPair`, `DownloadIcon`, `CustomDropdown`, `Button`

- **BoundaryHierarchyTypeAdd.js**
  - Line 2: `FormComposerV2`, `TextInput`, `Button`, `Card`, `CardLabel`, `CardSubHeader`

**Other Employee Pages**
- **index.js** (Main employee entry)
  - Line 4: `PrivateRoute`, `AppContainer`

- **SidebarConfig.js**
  - Line 4: `InboxSearchComposer`

#### Workbench Components (8 files)

- **DigitJSONForm.js**
  - Lines 1-12: `Header`, `Card`, `Button`, `ActionBar`, `AddFilled`, `SubmitBar`, `CardLabelError`, `SVG`, `Menu`, `CollapseAndExpandGroups`

- **WorkbenchCard.js**
  - Line 1: `EmployeeModuleCard`, `ArrowRightInbox`, `WorksMgmtIcon`

- **WorkbenchHeader.js**
  - Lines 1-6: `BackButton`, `Tutorial`, `useTourState`, `Help`

- **HRMSCard.js**
  - Line 1: `HRIcon`, `EmployeeModuleCard`

- **LevelCards.js**
  - Line 3: `Card`, `Button`, `TextInput`, `SVG`, `LabelFieldPair`, `Close`, `CardLabel`, `DeleteIconv2`, `AddFilled`

- **MultiSelect.js**
  - Line 5: `InfoBannerIcon`, `Button`, `Close`

- **BulkUpload.js**
  - Line 2: `UploadIcon`, `FileIcon`, `DeleteIconv2`, `ActionBar`, `SubmitBar`

- **BulkModal.js**
  - Lines 5, 7: `FileUploadModal`, `Card`, `SVG`, `CloseSvg`

- **Checkbox.js**
  - Line 1: `ToggleSwitch`

#### Workbench Configuration (4 files)

- **UICustomizations.js** (`/configs/`)
  - Line 4: `Button`

- **EditModalConfig.js** (`/configs/`)
  - Line 1: `Dropdown`, `Loader`

- **Module.js** (Main workbench module)
  - Line 1: `TourProvider`

### 3. Core Module (20 files)

#### Employee Pages (6 files)

- **ChangePassword/changePassword.js**
  - Line 1: `CardSubHeader`, `FormComposer`, `CardText`

- **QuickStart/QuickSetup.js**
  - Line 6: `CardSubHeader`, `CardSectionHeader`, `BreakLine`, `CardSectionSubText`

- **Otp/index.js**
  - Line 3: `FormComposerV2`

- **Otp/OtpCustomComponent.js**
  - Line 3: `OTPInput`

- **LanguageSelection/index.js**
  - Line 2: `CustomButton`

- **ForgotPassword/forgotPassword.js**
  - Line 1: `FormComposer` (commented out)

#### Citizen Pages (6 files)

- **Login/SelectOtp.js**
  - Line 4: `OTPInput`

- **HowItWorks/howItWorks.js**
  - Line 9: `CustomButton`

- **Home/index.js**
  - Lines 1-12: `Calender`, `CardBasedOptions`, `CaseIcon`, `ComplaintIcon`, `DocumentIcon`, `HomeIcon`, `OBPSIcon`, `PTIcon`, `Loader`, `WhatsNewCard`

- **Home/LocationSelection.js**
  - Line 2: `CardHeader`, `CardLabelError`, `PageBasedInput`, `SearchOnRadioButtons`

- **Home/UserProfile.js**
  - Line 18: `CameraIcon`

- **Home/ImageUpload/UploadDrawer.js**
  - Line 2: `GalleryIcon`, `RemoveIcon`

#### Core Components (8 files)

**TopBar and Sidebar**
- **TopBarSideBar/TopBar.js**
  - Line 1: `Hamburger`, `TopBar as TopBarComponent`

- **TopBarSideBar/SideBar/SideBar.js**
  - Lines 2-18, 189, 195, 299, 305: `ArrowForward`, `ArrowVectorDown`, `ArrowDirection`, `HomeIcon`, `ComplaintIcon`, `BPAHomeIcon`, `CollectionIcon`, `FinanceChartIcon`, `CollectionsBookmarIcons`, `DropIcon`, `DocumentIconSolid`, `PersonIcon`, `PropertyHouse`, `ReceiptIcon`, `CaseIcon`
  - Dynamic imports using `require("@egovernments/digit-ui-react-components")`

- **TopBarSideBar/SideBar/SubMenu.js**
  - Line 50: Dynamic import `require("@egovernments/digit-ui-react-components")?.[iconArr?.[1]]`

- **TopBarSideBar/SideBar/StaticCitizenSideBar.js**
  - Lines 2-21: `HomeIcon`, `EditPencilIcon`, `LogoutIcon`, `AddressBookIcon`, `PropertyHouse`, `CaseIcon`, `CollectionIcon`, `PTIcon`, `OBPSIcon`, `PGRIcon`, `FSMIcon`, `WSICon`, `MCollectIcon`, `Phone`, `BirthIcon`, `DeathIcon`, `FirenocIcon`, `Loader`

- **TopBarSideBar/SideBar/CitizenSideBar.js**
  - Line 10: `LogoutIcon`

**Other Components**
- **Search/index.js**
  - Lines 1-4: `DownloadBtnCommon`, `Table`

- **Home.js**
  - Lines 1-5: `CitizenHomeCard`, `CitizenInfoLabel`, `Loader`

- **PrivacyComponent.js**
  - Line 4: `LinkButton`

#### Configuration Files
- **config/sidebar-menu.js**
  - Line 2: `LanguageIcon`, `LogoutIcon`, `AddressBookIcon`, `LocationIcon`

### 4. Package Dependencies

#### Package.json Files (4 files)
- `micro-ui/web/package.json` - Version: "1.8.21-rc19.01"
- `micro-ui/web/micro-ui-internals/packages/modules/workbench/package.json` - Version: "1.8.21-rc19.02"
- `micro-ui/web/micro-ui-internals/packages/modules/core/package.json` - Version: "1.9.0-beta-1"
- `micro-ui/web/micro-ui-internals/example/package.json` - Version: "1.9.0-beta-1"

#### Webpack Configuration (1 file)
- `packages/modules/core/webpack.config.js` - External dependency mapping

## Component Categories Analysis

### Most Used Components

#### Form Components
- `FormComposer` / `FormComposerV2` (4 occurrences)
- `FormStep` (4 occurrences)
- `TextInput` (6 occurrences)
- `Dropdown` (5 occurrences)
- `OTPInput` (2 occurrences)

#### UI Layout
- `Card` (12 occurrences)
- `Button` (11 occurrences)
- `Header` (8 occurrences)
- `Loader` (5 occurrences)

#### Labels and Display
- `CardLabel` (9 occurrences)
- `CitizenInfoLabel` (6 occurrences)
- `LabelFieldPair` (6 occurrences)

#### Icons (SVG Components)
- Various navigation and module icons (`HomeIcon`, `LogoutIcon`, `ArrowForward`, etc.)
- Action icons (`AddFilled`, `DeleteIconv2`, `Close`, etc.)
- Module-specific icons (`PTIcon`, `OBPSIcon`, `PGRIcon`, etc.)

### Migration Priority Assessment

#### High Priority (Critical Path Components)
1. **Form Components:** FormComposer, FormComposerV2, FormStep - Used in authentication flows
2. **Navigation:** TopBar, SideBar components - Core navigation functionality
3. **Layout:** Card, Header, Button - Fundamental UI building blocks

#### Medium Priority (Module-Specific)
1. **Workbench Components:** MDMS and Localization management components
2. **Search Components:** InboxSearchComposer, Table components
3. **Upload Components:** File upload and boundary management

#### Low Priority (Customizations)
1. **Property Tax Customizations:** PT-specific form components
2. **Trade License Customizations:** TL-specific form components
3. **Icon Components:** Can be migrated in batches

## Migration Recommendations

### Phase 1: Core Infrastructure
- Migrate TopBar, SideBar, and navigation components
- Replace Card, Button, Header with new component library equivalents
- Update FormComposer and core form components

### Phase 2: Module Components
- Migrate Workbench module components
- Update search and data display components
- Replace upload and file management components

### Phase 3: Customizations and Icons
- Migrate PT and TL customization components
- Batch migrate icon components
- Update remaining specialized components

### Phase 4: Cleanup
- Remove legacy package dependencies
- Update webpack configurations
- Verify all dynamic imports are updated

## Version Information

Current React Component Library versions in use:
- Main web: `1.8.21-rc19.01`
- Workbench: `1.8.21-rc19.02`
- Core: `1.9.0-beta-1`
- Example: `1.9.0-beta-1`

Target migration: Move to `@egovernments/digit-ui-components` (v0.3.0-beta-1)

---

*Last Updated: August 23, 2025*
*Generated by: Claude Code Analysis*