

# digit-ui-module-utilities

## Install

```bash
npm install --save digit-ui-module-utilities
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
"@egovernments/digit-ui-module-utilities":"0.0.1",
```

then navigate to App.js

```bash
 frontend/micro-ui/web/src/App.js
```

```jsx
/** add this import **/

import { initUtilitiesComponents } from "@egovernments/digit-ui-module-utilities";

/** inside enabledModules add this new module key **/

const enabledModules = ["Utilities"];

/** inside init Function call this function **/

const initDigitUI = () => {
  initUtilitiesComponents();
};

```

Add the Inbox /search config and use as mentioned below

```jsx
    import { InboxSearchComposer } from "@egovernments/digit-ui-module-utilities";

    <React.Fragment>
      <Header className="works-header-search">{t(updatedConfig?.label)}</Header>
      <div className="inbox-search-wrapper">
        <InboxSearchComposer configs={updatedConfig}></InboxSearchComposer>
      </div>
    </React.Fragment>
```


In MDMS

_Add this configuration to enable this module [MDMS Enabling Utilities Module](https://github.com/egovernments/works-mdms-data/blob/48461ecaf944ea243e24e1c1f9a5e2179d8091ac/data/pg/tenant/citymodule.json#L193)_

## List of Screens available in this versions were as follows

1. Search or Inbox
   Example Routes as follows

   ```bash
   workbench-ui/employee/utilities/search/commonMuktaUiConfig/SearchIndividualConfig
   
   workbench-ui/employee/utilities/search/commonMuktaUiConfig/InboxMusterConfig
   ```

2. Iframe

   ```bash
   workbench-ui/employee/utilities/iframe/shg/home
   ```

3. Workflow Test for any module

Sample URL

_Contract Module

```bash
  workbench-ui/employee/utilities/workflow?tenantId=pg.citya&applicationNo=WO/2023-24/000721&businessService=CONTRACT&moduleCode=contract
```

_Estimate Module

```bash
  workbench-ui/employee/utilities/workflow?tenantId=pg.citya&applicationNo=ES/2023-24/001606&businessService=ESTIMATE&moduleCode=estimate
```

_Attendance Module

```bash
  workbench-ui/employee/utilities/workflow?tenantId=pg.citya&applicationNo=MR/2023-24/05/31/000778&businessService=MR&moduleCode=muster%20roll
```

_Bill Module

```bash
  workbench-ui/employee/utilities/workflow?tenantId=pg.citya&applicationNo=PB/2023-24/000379&businessService=EXPENSE.PURCHASE&moduleCode=wages.purchase
```

4. View Document

   Upload and view

   ```bash
   workbench-ui/employee/utilities/doc-viewer
   ```

   view from url

   ```bash
   workbench-ui/employee/utilities/doc-viewer?fileUrl=https://egov-uat-assets.s3.ap-south-1.amazonaws.com/hcm/logo-image.jpeg&fileName=logo-image.jpeg
   ```
5. View Audit history 

 ```bash
   workbench-ui/employee/utilities/audit-log?id=dfeca4e2-4478-472d-939b-9dfe3ebaeb64&tenantId=mz
   ```

6. Playground for Create & Inbox Screen

### Form Composer
```bash
workbench-ui/employee/utilities/playground/form-composer
```

### Inbox  Composer
```bash
workbench-ui/employee/utilities/playground/inbox-composer
```

## Coming Soon

1. Create Screen
2. View Screen


## Changelog

### Summary for Version [1.0.2-beta.1] - 2024-06-05

For a detailed changelog, see the [CHANGELOG.md](./CHANGELOG.md) file.


### Contributors

[jagankumar-egov] 


## Maintainer

- [jagankumar-egov](https://www.github.com/jagankumar-egov)

### Published from DIGIT Frontend 
DIGIT Frontend Repo (https://github.com/egovernments/Digit-Frontend/tree/master)


![Logo](https://s3.ap-south-1.amazonaws.com/works-dev-asset/mseva-white-logo.png)
