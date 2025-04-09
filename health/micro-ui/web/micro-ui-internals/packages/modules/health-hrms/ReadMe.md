# egovernments/digit-ui-module-health-hrms

## Install

```bash
npm install --save egovernments/digit-ui-module-health-hrms
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
"@egovernments/digit-ui-module-health-hrms" :"0.0.1",
```

then navigate to App.js

```bash
 frontend/micro-ui/web/src/App.js
```

```jsx
/** add this import **/

import { initHrmsComponents } from "egovernments/digit-ui-module-health-hrms"

/** inside enabledModules add this new module key **/

const enabledModules = ["HRMS"];

/** inside init Function call this function **/

const initDigitUI = () => {
  initHrmsComponents();
};

```

## List of features available in this package were as follows

1. Implement User create and edit functionality.
2. Implement Campaign assign and edit functionality.
3. Enable Activate/Deactivate user functionality.



### Contributors

- [ramkrishna-egov](https://github.com/ramkrishna-egov)
- [pitabash-eGov](https://github.com/pitabash-eGov)

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Documentation

Documentation Site (https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui)

[Microplan Module Documentation](https://docs.digit.org/public-health/v1.7/setup/configuration/ui-configuration)

## Maintainer

- [pitabash-eGov](https://github.com/pitabash-eGov)


### Published from DIGIT Frontend 
DIGIT Frontend Repo (https://github.com/egovernments/Digit-Frontend/tree/master)


![Logo](https://s3.ap-south-1.amazonaws.com/works-dev-asset/mseva-white-logo.png)

