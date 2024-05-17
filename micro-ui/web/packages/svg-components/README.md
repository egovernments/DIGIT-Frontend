
# Digit-UI SVG Components

## Install

```bash
npm install --save @egovernments/digit-ui-svg-components
```

## Limitation

```bash
 This package is specifically designed for DIGIT-UI but can be used across various missions.
```

## Usage

After adding the dependency, make sure you have this dependency in

```bash
frontend/micro-ui/web/package.json
```

```json
"@egovernments/digit-ui-svg-components":"1.0.7",
```

then navigate to App.js

```bash
 frontend/micro-ui/web/src/App.js
```

# SVGs can be imported from svg component libraries and also from digit-ui-react-components^1.5.27 package

Syntax for importing any SVGs

# from svg library

```jsx
import { Accessibility } from "@egovernments/digit-ui-svg-components";

<Accessibility />;
```

# from digit-ui-react-components

```jsx
import { SVG } from "@egovernments/digit-ui-react-components";

<SVG.Accessibility />;

or;

import { SVG } from "@egovernments/digit-ui-react-components";

const { Accessibility } = SVG;
<Accessibility />;
```

### Changelog

```bash
1.0.7 adding NorthArrow and MapLayerIcon icon
1.0.6 Used a new Primary constant color "#c84c0e"
1.0.5 Adding Pagination icons and Fixing Population and Facility icons
1.0.4 fixed Excel icon
1.0.3 fixed and added Microplanning module icons
1.0.2 Added Trash Icon
1.0.1 Added Icons from Microplanning module
1.0.0 Released as part of workbench v1.0
1.0.0-beta workbench base version beta release
0.0.8 Added RoundedCheck Icon and DeleteBtn icon with stories
0.0.7 Added Info banner icon
0.0.6 Added TickMark, Success Svg and fixed publish related issue
0.0.5 fixed publish related issue
0.0.4 fixed some fill related issue
0.0.3 Added NoResultsFoundicon,StarFilled , Star Empty and Fixed issue on  NoResultsFoundicon
0.0.2 added the prototypes and playground stories for all svgs
0.0.1 base version
```

### Contributors


 [nabeelmd-egov](https://github.com/nabeelmd-egov)
 [anil-egov](https://github.com/anil-egov)
 [jagankumar-egov](https://github.com/jagankumar-egov)

## Documentation

Documentation Site (https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui)

## Reference

Home Page (https://unified-dev.digit.org/storybook-svg/)

## Maintainer

- [jagankumar-egov](https://www.github.com/jagankumar-egov)


### Published from DIGIT Frontend 
 Branch details (https://github.com/egovernments/Digit-Frontend/tree/develop)


![Logo](https://s3.ap-south-1.amazonaws.com/works-dev-asset/mseva-white-logo.png)
