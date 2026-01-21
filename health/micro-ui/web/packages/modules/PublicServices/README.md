<!-- TODO: update this -->

# Sample UI Module for DIGIT

This README provides an overview of creating a new UI module package in the DIGIT platform, following the guidelines from the [DIGIT Developer Guide](https://core.digit.org/guides/developer-guide/ui-developer-guide/create-a-new-ui-module-package).

## Prerequisites
Ensure you have the following installed:
- Node.js (14.18)
- npm or yarn
- A working DIGIT UI setup

## Steps to Create a New UI Module

### 1. Initialize the Module
Navigate to the `packages/modules` directory inside your DIGIT UI project and create a new folder for the module:
```sh
cd packages/modules
mkdir sample
cd sample
```

### 2. Initialize a Package
Run the following command to create a `package.json` file:
```sh
npm init -y
```
Modify the `package.json` to include necessary dependencies and metadata:
```json
{
  "name": "@egovernments/digit-ui-module-sample",
  "version": "0.0.1",
  "main": "src/index.js",
  "dependencies": {
   "react": "17.0.2",
    "react-router-dom": "5.3.0"
  }
}
```

### 3. Set Up the Module Structure
Create the necessary directories and files:
```sh
mkdir -p src/pages src/components src/config
```

Create an `index.js` file in `src/`:
```js
export * from "./pages";
export * from "./components";
export * from "./config";
```

### 4. Define Routes in `module.js`
Create a `module.js` file inside `src/`:
```js
const sampleModule = {
  routes: [
    {
      path: "/sample",
      component: () => import("./pages/SamplePage"),
      private: true,
    },
  ],
};
export default sampleModule;
```

### 5. Create a Sample Page
Inside `src/pages`, create `SamplePage.js`:
```js
import React from "react";
const SamplePage = () => {
  return <div>Welcome to the Sample Module!</div>;
};
export default SamplePage;
```

### 6. Import the Module in Root Application
Modify `root-app` to include the new module:
```js
import {initSampleComponents} from "@egovernments/digit-ui-module-sample";

const modules = ["sample"];

initSampleComponents()

```

### 7. Run and Test
Build and start the application:
```sh
yarn install
yarn start
```
Navigate to `http://localhost:3000/sample` to see the new module in action.

## Conclusion
This guide provides a structured approach to integrating a new module into the DIGIT UI platform. Follow these steps to create, configure, and deploy your module efficiently.

For more details, refer to the official [DIGIT Developer Guide](https://core.digit.org/guides/developer-guide/ui-developer-guide/create-a-new-ui-module-package).


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