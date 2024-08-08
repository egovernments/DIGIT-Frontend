# digit-ui-module-workbench

## Install

```bash
npm install --save digit-ui-module-campaign-manager
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
"@egovernments/digit-ui-module-campaign-manager" :"0.2.0",
```

then navigate to App.js

```bash
 frontend/micro-ui/web/src/App.js
```

```jsx
/** add this import **/

import { initCampaignComponents } from "@egovernments/digit-ui-module-campaign-manager"

/** inside enabledModules add this new module key **/

const enabledModules = ["Campaign"];

/** inside init Function call this function **/

const initDigitUI = () => {
  initCampaignComponents();
};

```
## List of features available in this versions were as follows

1 . Update Date change
    > -Provides a screen to change the campaign and cycle start date and end date.
    > -Date can be change within boundary level or project level based on the MDMS config 


2 . View Timeline
    > -Provides a feature to show the campaign current status in summary screen
    > -Provides a Dropdown if it has any referenced master 

3 . Action column.
    > - Added Action column in my campaign screen to perform actions


### Changelog

```bash
0.2.0 Feature added for Campaign Date change, View timeline 
0.0.1 base version
```

### Contributors

- [jagankumar-egov](https://github.com/jagankumar-egov) 
- [nabeelmd-egov](https://github.com/nabeelmd-egov)


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

