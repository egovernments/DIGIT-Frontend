# digit-ui-module-campaign-manager

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
"@egovernments/digit-ui-module-campaign-manager" :"0.3.0",
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

## List of features available in this package were as follows

1. Helps in creating the Campaign and configure delivery rules 
    Supported Campaigns Bednet, SMC, IRS & Codelivery

2. Create Data: Validates and creates resource details of type facility,user and boundary.

3. Update Date
    > -Provides a screen to change the campaign and cycle start and end dates.
    > -Dates can be changed within boundary level or project level based on the MDMS config 


4. View Timeline
    > -Provides a feature to show the campaign current status in summary screen
    > -Provides a Dropdown if it has any referenced master 

5. Updating the campaign details

6. Configure Checklist

7. Manage Boundaries

8. Boundary Assignment through UI
    > -Provides interface for assigning boundaries to Users and Facilities
    > -Supports bulk assignment and management of boundary mappings


### Contributors

- [jagankumar-egov](https://github.com/jagankumar-egov) 
- [nabeelmd-egov](https://github.com/nabeelmd-egov)
- [Bhavya-egov](https://github.com/Bhavya-egov)
- [suryansh-egov](https://github.com/suryansh-egov)

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Documentation

Documentation Site (https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui)

[Campaign Module Documentation](https://docs.digit.org/health/0.3/setup/configuration)

## Maintainer

- [jagankumar-egov](https://www.github.com/jagankumar-egov)


### Published from DIGIT Frontend 
DIGIT Frontend Repo (https://github.com/egovernments/Digit-Frontend/tree/master)


![Logo](https://s3.ap-south-1.amazonaws.com/works-dev-asset/mseva-white-logo.png)

