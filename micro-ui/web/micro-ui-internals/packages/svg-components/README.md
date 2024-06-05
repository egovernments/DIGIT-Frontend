
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
"@egovernments/digit-ui-svg-components":"1.0.10",
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

## Changelog

### Summary for Version [1.0.10] - 2024-06-05

For a detailed changelog, see the [CHANGELOG.md](./CHANGELOG.md) file.

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
