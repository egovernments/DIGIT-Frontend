
# digit-ui-components

## Install

```bash
npm install --save @egovernments/digit-ui-components
```

## Limitation

```bash
This Package is more specific to DIGIT-UI's can be used across mission's for webpack builds & node v20
```

## Usage

After adding the dependency make sure you have this dependency in

```bash
frontend/micro-ui/web/package.json
```

```json
"@egovernments/digit-ui-components":"0.0.1",
```

then navigate to App.js

```bash
 frontend/micro-ui/web/src/App.js
```

# Syntax for importing any components

```jsx
import { SVG } from "@egovernments/digit-ui-components";

<SVG.Accessibility />;
```

# Local Development
Use Node 14 version 

Step 1

 ```bash
yarn install 
```

Step 2

 ```bash
yarn storybook 
```


## [0.0.2-webpack.2] 


## Changelog

### Summary for Version [0.0.2] - 2024-06-03

#### New Changes

- Added Error Message Component.
- Added Info Button Component.
- Added Panels Component.
- Added Popup Component with two variants: `default` and `alert`.
- Added RemoveableTag Component.
- Added Stepper Component.
- Added TextBlock Component.
- Added Timeline Component.
- Added Uploader Component with three variants: `UploadFile`, `UploadPopup`, and `UploadImage`.
- Added PanelCard Molecule.

#### Enhancements

- Updated Button Component Styles.
- Updated Dropdown Component Styles and added SelectAll Option.
- Updated InfoCard Component Styles.
- Added Animation for Toast.
- Added new prop `type` for Toast, replacing the separate props for `info`, `warning`, and `error`.
- Updated Typography with lineHeight.
- Updated Color Typography.

For a detailed changelog, see the [CHANGELOG.md](./CHANGELOG.md) file.

## Published from DIGIT-UI-LIBRARIES

DIGIT-UI-LIBRARIES Repo (https://github.com/egovernments/DIGIT-UI-LIBRARIES/tree/master)

# Contributors

[nabeelmd-egov] [anilsingha-eGov] [nipunarora-eGov] [swathi-egov] [jagankumar-egov]

# Reference

Home Page (https://unified-dev.digit.org/storybook/)

## License

MIT © [jagankumar-egov](https://github.com/jagankumar-egov)

![Logo](https://s3.ap-south-1.amazonaws.com/works-dev-asset/mseva-white-logo.png)

