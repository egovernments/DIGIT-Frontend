# egovernments/digit-ui-module-microplan

## Install

```bash
npm install --save egovernments/digit-ui-module-microplan
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
"@egovernments/digit-ui-module-microplan" :"0.2.0",
```

then navigate to App.js

```bash
 frontend/micro-ui/web/src/App.js
```

```jsx
/** add this import **/

import { initMicroplanComponents } from "egovernments/digit-ui-module-microplan"

/** inside enabledModules add this new module key **/

const enabledModules = ["Microplan"];

/** inside init Function call this function **/

const initDigitUI = () => {
  initMicroplanComponents();
};

```

## List of features available in this package were as follows

1. Capturing campaign Details
2. Capture microplan name
3. Selection of campaign boundary
4. Population upload
5. Facility upload
6. Microplan assumption and formula configuration
7. User Access management
8. Summary page
9. Supervisors Landing page
10. Population Data approver flow
11. Facility catchment assigner flow
12. Microplan estimation approver flow


### Contributors

- [nipunarora-egov](https://github.com/nipunarora-egov) 
- [swathi-egov](https://github.com/swathi-egov)
- [nabeel-egov](https://github.com/nabeel-egov)
- [abishek-egov](https://github.com/abhishek-egov)
- [ramkrishna-egov](https://github.com/ramkrishna-egov)
- [ashish-egov](https://github.com/ashish-egov)
- [rachna-egov](https://github.com/rachna-egov)

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Documentation

Documentation Site (https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui)

[Microplan Module Documentation](https://docs.digit.org/public-health/microplanning/setup/configuration)

## Maintainer

- [nipunarora-egov](https://www.github.com/nipunarora-egov)


### Published from DIGIT Frontend 
DIGIT Frontend Repo (https://github.com/egovernments/Digit-Frontend/tree/master)


![Logo](https://s3.ap-south-1.amazonaws.com/works-dev-asset/mseva-white-logo.png)

