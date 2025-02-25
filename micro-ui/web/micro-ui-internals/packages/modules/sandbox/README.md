# digit-ui-module-sandbox

## Install

```bash
npm install --save digit-ui-module-sandbox
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
"@egovernments/digit-ui-module-sandbox":"0.0.1",
```

then navigate to App.js

```bash
 frontend/micro-ui/web/src/App.js
```

```jsx
/** add this import **/

import { initSandboxComponents } from "@egovernments/digit-ui-module-sandbox";

/** inside enabledModules add this new module key **/

const enabledModules = ["sandbox"];

/** inside init Function call this function **/

const initDigitUI = () => {
  initSandboxComponents();
};

```

In MDMS

_Add this configuration to enable this module [MDMS Enabling sandbox Module](https://github.com/egovernments/works-mdms-data/blob/588d241ba3a9ab30f4d4c2c387a513da811620ca/data/pg/tenant/citymodule.json#L227)_

```

4 . stylesheet link has to be added 
```jsx
<link rel="stylesheet" href="https://unpkg.com/@egovernments/digit-ui-css@1.2.114/dist/index.css" />
```
Reference commit for the enabling sandbox
https://github.com/egovernments/DIGIT-OSS/pull/99/commits/6e711bdc005c226c7debd533209681fc77078a3e



### Changelog
```
0.0.1 base version
```

### Contributors

- [jagankumar-egov](https://github.com/jagankumar-egov) 
- [nabeel-egov](https://github.com/nabeel-egov)
- [mithun-egov](https://github.com/mithun-egov)
- [aaradhya-egov](https://github.com/aaradhya-egov)

## Explore

Signup in sandbox portal to know more about sandbox

[DEMO](https://sandbox.digit.org/sandbox-ui)


## License

[MIT](https://choosealicense.com/licenses/mit/)

## Documentation

Documentation Site (https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui)
sandbox Documentation(https://sandbox.digit.org/platform/functional-specifications/sandbox-ui)

## Maintainer

- [jagankumar-egov](https://www.github.com/jagankumar-egov)


### Published from DIGIT Frontend 
DIGIT Frontend Repo (https://github.com/egovernments/Digit-Frontend/tree/master)


![Logo](https://s3.ap-south-1.amazonaws.com/works-dev-asset/mseva-white-logo.png)

