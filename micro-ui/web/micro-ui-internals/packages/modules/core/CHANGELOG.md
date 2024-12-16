# Changelog 

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
