

# digit-ui-module-core

## Install

```bash
npm install --save @egovernments/digit-ui-module-core
```

## Limitation

```bash
This Package is more specific to DIGIT-UI's can be used across mission's
```

## Usage

After adding the dependency make sure you have this dependency in

```bash
frontend/micro-ui/web/package.json
```

```json
"@egovernments/digit-ui-module-core":"^1.5.0",
```

then navigate to App.js

```bash
 frontend/micro-ui/web/src/App.js
```

```jsx
/** add this import **/

import { DigitUI } from "@egovernments/digit-ui-module-core";


/** inside render Function add  the import for the component **/

  ReactDOM.render(<DigitUI stateCode={stateCode} enabledModules={enabledModules} moduleReducers={moduleReducers} />, document.getElementById("root"));

```

# Mandatory changes to use following version

```
from 1.5.38 add the following utility method in micro-ui-internals/packages/libraries/src/utils/index.js

const createFunction = (functionAsString) => {
  return Function("return " + functionAsString)();
};

export as createFunction;

similarly update line 76 of react-components/src/molecules/CustomDropdown.js

with  
 .filter((opt) => (opt?.hasOwnProperty("active") ? opt.active : true))

```
 *   Digit.Utils.getDefaultLanguage()

```
from 1.8.0 beta version add the following utility method in micro-ui/web/micro-ui-internals/packages/libraries/src/utils/index.js

const getDefaultLanguage = () => {
  return  `${getLocaleDefault()}_${getLocaleRegion()}`;
};

and add its related functions

```

## Changelog

### Summary for Version [1.8.2-beta.1] - 2024-06-05

For a detailed changelog, see the [CHANGELOG.md](./CHANGELOG.md) file.


### Contributors

[jagankumar-egov] [nipunarora-eGov] [Tulika-eGov] [Ramkrishna-egov] [nabeelmd-eGov] [anil-egov] [vamshikrishnakole-wtt-egov] 

## Documentation

Documentation Site (https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui)

## Maintainer

- [jagankumar-egov](https://www.github.com/jagankumar-egov)


### Published from DIGIT Frontend 
DIGIT Frontend Repo (https://github.com/egovernments/Digit-Frontend/tree/develop)


![Logo](https://s3.ap-south-1.amazonaws.com/works-dev-asset/mseva-white-logo.png)
