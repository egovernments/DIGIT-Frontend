# digit-ui-module-workbench

## Install

```bash
npm install --save digit-ui-module-workbench
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
"@egovernments/digit-ui-module-workbench":"1.0.0",
```

then navigate to App.js

```bash
 frontend/micro-ui/web/src/App.js
```

```jsx
/** add this import **/

import { initWorkbenchComponents } from "@egovernments/digit-ui-module-workbench";

/** inside enabledModules add this new module key **/

const enabledModules = ["workbench"];

/** inside init Function call this function **/

const initDigitUI = () => {
  initWorkbenchComponents();
};

```

In MDMS

_Add this configuration to enable this module [MDMS Enabling Workbench Module](https://github.com/egovernments/works-mdms-data/blob/588d241ba3a9ab30f4d4c2c387a513da811620ca/data/pg/tenant/citymodule.json#L227)_

## List of Screens available in this versions were as follows

1 . Search Master Data
    > -Provides a screen based on Schema and renders the search result if data is present
    > -It also provides a dynamic filter based on which data can be filtered


2 . Add Master Data based on selected schema
    > -Provides a screen to add new master data according to the schema
    > -Provides a Dropdown if it has any referenced master 

3 . Update Master data for selected data.
    > -View the master data from search screen
    > -Disable/Enable the master data if required
    > -Update the master data value except the unique-identifier field mentioned in the schema



4 . Localisation screens
    > -Provides a screen to search the localisation present in the environment
    > -Add new localisation 
    > -Update existing localisation
    > -Bulk Upload of Localisation data

5 . MDMS UI Schema

6 . Data push for any API based on schema

7 . Json-edit-react to view and edit schema 

### Mandatory changes to use Workbench module

1 . Assuming core module is already updated with 1.5.38+ and related changes were taken

2 . add the following hook method in micro-ui-internals/packages/libraries/src/hooks/useCustomAPIMutationHook.js

reference:: 
https://github.com/egovernments/DIGIT-Dev/blob/6e711bdc005c226c7debd533209681fc77078a3e/frontend/micro-ui/web/micro-ui-internals/packages/libraries/src/hooks/useCustomAPIMutationHook.js

3 . add the following utility method in micro-ui-internals/packages/libraries/src/utils/index.js
```jsx
didEmployeeHasAtleastOneRole

const didEmployeeHasAtleastOneRole = (roles = []) => {
  return roles.some((role) => didEmployeeHasRole(role));
};

```

4 . stylesheet link has to be added 
```jsx
<link rel="stylesheet" href="https://unpkg.com/@egovernments/digit-ui-css@1.2.114/dist/index.css" />
```
Reference commit for the enabling workbench
https://github.com/egovernments/DIGIT-OSS/pull/99/commits/6e711bdc005c226c7debd533209681fc77078a3e



### Changelog

```bash
1.0.2-beta.7 : localisation admin issue fixed
1.0.2-beta.6 : boundary screen updated for support migration of data
1.0.2-beta.4 If you dont want to use modulename and mastername in mdms-v2 data create and update api use {MDMS_SCHEMACODE_INACTION} this constant in global config and set it as false
1.0.2-beta.3 updated the bulkupload time for MDMS data create
1.0.2-beta.2 added audit history feature
1.0.2-beta.1 fix after build issue of ajv package
1.0.1-beta.14 added direct boundary bulk upload screen
1.0.1-beta.4 Added boundary bulk upload screen
1.0.1-beta.3 minor fixes in create hierarchy screen
1.0.1-beta.2 Added create heirarchty screen
1.0.1-beta.1 Republished after merging with Master due to version issues.
1.0.0-beta.14 Added info message in localisation search
1.0.0-beta.13 Added new role to support hcm localisation create
1.0.0-beta.13 Added customisable label for custom dropdown through workbench ui schema
1.0.0-beta.11 Added customisable label for custom dropdown through workbench ui schema
1.0.0-beta.10 fixed the dropdown undefined issue 
1.0.0-beta.9 Added new role to support hcm manage masters
1.0.0-beta.8 minor fixes
1.0.0-beta.7 Added Bulk Upload Ui for MDMS Add
1.0.0-beta.6 Added Bulk Upload Ui for MDMS Add
1.0.0-beta.5 Fixed some loading issue
1.0.0-beta.2 custom api support added
1.0.0-beta.1 republished due to some version issues
1.0.1 Fixes related to the limits
1.0.0 Workbench v1.0 release
1.0.0-beta workbench base version beta release
0.0.3 readme updated
0.0.2 readme updated
0.0.1 base version
```

### Contributors

- [jagankumar-egov](https://github.com/jagankumar-egov) 
- [nipun-egov](https://github.com/nipun-egov)


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

