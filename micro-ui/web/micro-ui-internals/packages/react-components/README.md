



# digit-ui-react-components

## Install

```bash
npm install --save @egovernments/digit-ui-react-components
```

## Limitation

```bash
This package is specifically designed for DIGIT-UI but can be used across various missions.
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
  1. Set `showTab: true` in the inboxconfig.
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
      Add function to perform when tab changes. Here we are setting the respective tab active and updating its config
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

## Changelog

### Summary for Version [1.8.2-beta.1] - 2024-06-05

For a detailed changelog, see the [CHANGELOG.md](./CHANGELOG.md) file.


### Contributors

[jagankumar-egov] [nipunarora-eGov] [Tulika-eGov] [Ramkrishna-egov] [nabeelmd-eGov] [anil-egov] [vamshikrishnakole-wtt-egov] 

## Documentation

Documentation Site (https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui)

## Maintainer

- [jagankumar-egov](https://www.github.com/jagankumar-egov)


### Published from DIGIT Frontend 
DIGIT Frontend Repo (https://github.com/egovernments/Digit-Frontend/tree/develop)


![Logo](https://s3.ap-south-1.amazonaws.com/works-dev-asset/mseva-white-logo.png)
