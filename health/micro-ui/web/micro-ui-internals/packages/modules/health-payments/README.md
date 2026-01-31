# egovernments/digit-ui-module-health-payments

## Install

```bash
npm install --save egovernments/digit-ui-module-health-payments
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
"@egovernments/digit-ui-module-health-payments" :"0.3.0",
```

then navigate to App.js

```bash
 frontend/micro-ui/web/src/App.js
```

```jsx
/** add this import **/

import { initPaymentComponents } from "egovernments/digit-ui-module-health-payments"

/** inside enabledModules add this new module key **/

const enabledModules = ["payments"];

/** inside init Function call this function **/

const initDigitUI = () => {
  initPaymentComponents();
};

```

## List of features available in this package were as follows

1. Implement attendance data edit and approval functionality.
2. Introduce bill generation feature.
3. Enable bill download in PDF format.
4. Enable bill download in Excel format.
5. Enrolment of attendee in the attendance register
6. Disabling the attendee in the attendance register
7. Create periodic payment reports at flexible intervals, enabling timely worker compensation during ongoing campaigns


### Contributors

- [ramkrishna-egov](https://github.com/ramkrishna-egov)
- [rachna-egov](https://github.com/rachna-egov)
- [pitabash-eGov](https://github.com/pitabash-eGov)

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Documentation

Documentation Site (https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui)

[Microplan Module Documentation](https://docs.digit.org/public-health/v1.7/setup/configuration/ui-configuration)

## Maintainer

- [ramkrishna-egov](https://www.github.com/ramkrishna-egov)


### Published from DIGIT Frontend 
DIGIT Frontend Repo (https://github.com/egovernments/Digit-Frontend/tree/master)


![Logo](https://s3.ap-south-1.amazonaws.com/works-dev-asset/mseva-white-logo.png)

