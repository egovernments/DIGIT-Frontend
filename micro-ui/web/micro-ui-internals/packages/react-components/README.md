



# digit-ui-react-components

## Install

```bash
npm install --save @egovernments/digit-ui-react-components
```

## Limitation

```bash
This package is specifically designed for DIGIT-UI's but can be used across various missions.
```

## Usage

After adding the dependency make sure you have this dependency in

```bash
frontend/micro-ui/web/package.json
```

```json
"@egovernments/digit-ui-react-components":"1.5.24",
```

then navigate to App.js

```bash
 frontend/micro-ui/web/src/App.js
```

Syntax for importing any component;

```jsx
import React, { Component } from "react";
import MyComponent from "@egovernments/digit-ui-react-components";

class Example extends Component {
  render() {
    return <MyComponent />;
  }
}
```
Syntax for the Inbox Composers

```jsx
    import { InboxSearchComposer } from "@egovernments/digit-ui-react-components";

    <React.Fragment>
      <Header className="works-header-search">{t(updatedConfig?.label)}</Header>
      <div className="inbox-search-wrapper">
        <InboxSearchComposer configs={updatedConfig}></InboxSearchComposer>
      </div>
    </React.Fragment>
```

Syntax for the FormComposersV2

```jsx
    import { FormComposerV2 as FormComposer } from "@egovernments/digit-ui-react-components";

   <React.Fragment>
      <Header >{t("CREATE_HEADER")}</Header>
      <FormComposer
        label={t("PROCEED")}
        config={configs.map((config) => {
          return {
            ...config,
            body: config.body.filter((a) => !a.hideInEmployee),
          };
        })}
        defaultValues={sessionFormData}
        onFormValueChange={onFormValueChange}
        onSubmit={onFormSubmit}
        fieldStyle={{ marginRight: 0 }}
        className="form-no-margin"
        labelBold={true}
      />
    </React.Fragment>
```

To use the InboxSearchComposer component for managing multiple tabs, follow these steps:
  1. Set `ShowTab: true` in the Inboxconfig.
  2. In the Config array, include configuration objects for each tab. For example:
        ```javascript
      export const inboxconfig = {
      tenantId: "pb",
      moduleName: "inboxconfigUiConfig",
      showTab: true,
      inboxconfig: [
        {
          ...
        },
        {
          ...
        }
      ]
     ```
  3. Implement custom limit offset by adding customDefaultPagination under uiConfig in the searchResult:
        ```javascript         
            customDefaultPagination: {
                  limit: 5,
                  offset: 0,
            },
        ```
  4. For custom table sizes, add an array of page sizes in customPageSizesArray under uiConfig in the searchResult:
        ```javascript   
       customPageSizesArray: [5, 10, 15, 20],
        ```
  5. In the Inbox Screen, initialize the following states:
      This state will by default take first object from array config
        ```javascript
      const [config, setConfig] = useState(myCampaignConfig?.myCampaignConfig?.[0]);
        ```
      TabData state used to fetch which tab is active
        ```javascript
      const [tabData, setTabData] = useState(myCampaignConfig?.myCampaignConfig?.map((i, n) => ({ key: n, label: i.label, active: n === 0 ? true : false })));
        ```
      Add function to perform when tab changes. Here we are setting the respective tab active and updaing its config
        ```javascript
      const onTabChange = (n) => {
        setTabData((prev) => prev.map((i, c) => ({ ...i, active: c === n ? true : false })));
        setConfig(myCampaignConfig?.myCampaignConfig?.[n]);
      };
        ```
  6 At last pass all these in InboxSearchComposer props.
    
```jsx
      <InboxSearchComposer configs={config} showTab={true} tabData={tabData} onTabChange={onTabChange}></InboxSearchComposer>
```

### Changelog

```bash
1.8.1-beta.8 Added Close button and Loader
1.8.1-beta.7 Viewcomposer enhancement for cardheader action
1.8.1-beta.6 Added feature for Multi Tab in InboxSearchComposer
1.8.1-beta.5 Added without labelfieldpair config for removing default card
1.8.1-beta.4 Added Previous button in From Composer
1.8.1-beta.3 Added XlsPreview component to preview Xls file.
1.8.1-beta.2 Moved the sidebar footer outside of "drawer-list" to prevent overlapping issues.
1.8.1-beta.1 Republished after merging with Master due to version issues.
1.8.0-beta.5 added file type excel in multiUploadWrapper
1.8.0-beta.4 republished 
1.8.0-beta.3 republished due to some issues
1.8.0-beta.2 Added Some icons for pqm dashboard
1.8.0-beta.1 fixed some topbar issues
1.8.0 workbench v1.0 release
1.8.0-beta workbench base version beta release
1.7.0 urban 2.9
1.6.0 urban 2.8
1.5.36 added classname for topbar options
1.5.35 aligment issue in edit and logout
1.5.34 updated login scss and alignment issues
1.5.28 passing response data in case for custom component in inbox composer
1.5.27 integrated with the svg library
1.5.26 fixed shipping truck icon fill issue
1.5.25 added new icon and fixed other issues
1.5.24 added and updated the Readme file
1.5.23 base version
```

### Contributors

[jagankumar-egov] [nipunarora-eGov] [Tulika-eGov] [Ramkrishna-egov] [nabeelmd-eGov] [anil-egov] [vamshikrishnakole-wtt-egov] 

## Documentation

Documentation Site (https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui)

## Maintainer

- [jagankumar-egov](https://www.github.com/jagankumar-egov)


### Published from DIGIT Frontend 
DIGIT Frontend Repo (https://github.com/egovernments/Digit-Frontend/tree/develop)


![Logo](https://s3.ap-south-1.amazonaws.com/works-dev-asset/mseva-white-logo.png)
