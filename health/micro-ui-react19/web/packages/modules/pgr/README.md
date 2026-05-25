# egovernments/digit-ui-module-health-pgr

## Install

```bash
npm install --save egovernments/digit-ui-module-health-pgr
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
"@egovernments/digit-ui-module-health-pgr" :"0.0.2",
```

then navigate to App.js

```bash
 frontend/micro-ui/web/src/App.js
```

```jsx
/** add this import **/

import { initPGRComponents } from "egovernments/digit-ui-module-health-pgr"

/** inside enabledModules add this new module key **/

const enabledModules = ["PGR"];

/** inside init Function call this function **/

const initDigitUI = () => {
  initPGRComponents();
};

```

## List of features available in this package were as follows

1. Create Complaint
2. Search Complaint Inbox.
3. View/Update Complaint.


### Contributors

- [ramkrishna-egov](https://github.com/Ramkrishna-egov)
- [pitabash-eGov](https://github.com/pitabash-eGov)

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Documentation

Documentation Site (https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui)


## Maintainer

- [ramkrishna-egov](https://www.github.com/ramkrishna-egov)


### Published from DIGIT Frontend 
DIGIT Frontend Repo (https://github.com/egovernments/Digit-Frontend/tree/master)


![Logo](https://s3.ap-south-1.amazonaws.com/works-dev-asset/mseva-white-logo.png)

