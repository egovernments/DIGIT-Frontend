# digit-ui-module-hcmworkbench

## Install

```bash
npm install --save digit-ui-module-hcmworkbench
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
"@egovernments/digit-ui-module-hcmworkbench" :"0.0.41",
```

then navigate to App.js

```bash
 frontend/micro-ui/web/src/App.js
```

```jsx
/** add this import **/

import { initWorkbenchHCMComponents } from "@egovernments/digit-ui-module-hcmworkbench"

/** inside enabledModules add this new module key **/

const enabledModules = ["HCMWORKBENCH"];

/** inside init Function call this function **/

const initDigitUI = () => {
  initWorkbenchHCMComponents();
};

```
## List of features available in this versions were as follows

1 . View Projects
2 . View Projects relations like childrens, staff, facility and resources
3 . Helps in settings of admin console for boundary and settings itself 


### Changelog

```bash
0.0.48 Cleaned up code and and added comments
0.0.40 base version
```

### Contributors

- [jagankumar-egov](https://github.com/jagankumar-egov) 
- [Bhavya-egov](https://github.com/Bhavya-egov)
- [himanshukeshari-eGov](https://github.com/himanshukeshari-eGov)


## License

[MIT](https://choosealicense.com/licenses/mit/)

## Documentation

Documentation Site (https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui)
Workbench Documentation(https://workbench.digit.org/platform/functional-specifications/workbench-ui)

## Maintainer

- [jagankumar-egov](https://www.github.com/jagankumar-egov)


### Published from DIGIT Frontend 
DIGIT Frontend Repo (https://github.com/egovernments/Digit-Frontend/tree/master)


![Logo](https://s3.ap-south-1.amazonaws.com/works-dev-asset/mseva-white-logo.png)

