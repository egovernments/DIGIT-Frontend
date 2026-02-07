
# DIGIT UI 

A React App built on top of DIGIT UI Core.

# DIGIT

DIGIT (Digital Infrastructure for Governance, Impact & Transformation) is India's largest platform for governance services. Visit https://www.digit.org for more details.

This repository contains source code for web implementation of the new Digit UI modules with dependencies and libraries.

Workbench module is used to Manage the master data (MDMS V2 Service) used across the DIGIT Services / Applications

It is also used to manage the Localisation data present in the system (Localisation service)


## 📂 Project Structure

```bash
micro-ui-internals/
│── example/
│── node_modules/
│── packages/
│   ├── css/                    # Global CSS package with Tailwind configuration
│   │   ├── dist/
│   │   ├── example/
│   │   ├── node_modules/
│   │   ├── src/
│   │   ├── gulpfile.js
│   │   ├── package.json
│   │   ├── postcss.config.js
│   │   ├── tailwind.config.js
│   ├── modules/                 # Contains different micro UI modules
│   │   ├── campaign-manager/
│   │   ├── hcm-microplanning/
│   │   ├── health-payments/
│   │   ├── microplan/
│   │   ├── workbench-hcm/
```


## 🛠 External Dependencies
This project uses several external packages:


```bash
Dependency	Source Code Repo	Branch
@egovernments/digit-ui-libraries	digit-ui-libraries	develop
@egovernments/digit-ui-module-core	digit-frontend	develop
@egovernments/digit-ui-react-components	digit-frontend	develop
@egovernments/digit-ui-svg-components	digit-frontend	develop
@egovernments/digit-ui-module-workbench	digit-frontend	develop
@egovernments/digit-ui-module-utilities	digit-frontend	develop
@egovernments/digit-ui-components	digit-ui-libraries	develop
```

## Tech Stack

**Libraries:** 

[React](https://react.dev/)

[React Hook Form](https://www.react-hook-form.com/)

[React Query](https://tanstack.com/query/v3/)

[Tailwind CSS](https://tailwindcss.com/)

[Webpack](https://webpack.js.org/)

## 🚀 Running the Project Locally
Prerequisites
Ensure you have the following installed on your system:

Node.js (14.18)
Yarn or npm (Yarn preferred )

Installation Steps

## Run Locally

Clone the project

```bash
  git clone https://github.com/egovernments/Digit-Frontend.git
```

Go to the Sub directory to run UI
```bash
    cd into health/micro-ui/web/micro-ui-internals
```

Install dependencies

```bash
  yarn install
```

Add .env file
```bash
    health/micro-ui/web/micro-ui-internals/example/.env
```

Start the server

```bash
  yarn start
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`REACT_APP_PROXY_API` ::  `{{server url}}`

`REACT_APP_GLOBAL`  ::  `{{server url}}`

`REACT_APP_PROXY_ASSETS`  ::  `{{server url}}`

`REACT_APP_USER_TYPE`  ::  `{{EMPLOYEE||CITIZEN}}`

`SKIP_PREFLIGHT_CHECK` :: `true`

[sample .env file](https://github.com/egovernments/Digit-Frontend/health/micro-ui/web/micro-ui-internals/example/.env-unifieddev)



## Modules

    1. Console
    2. Microplan
    3. Payments
    4. Settings


🎨 Tailwind CSS Configuration
The project uses Tailwind CSS for styling. The global configuration is located in:

Tailwind Config: packages/css/tailwind.config.js
PostCSS Config: packages/css/postcss.config.js
Each module may also include its own CSS files, managed within their respective directories.

🛠 Development & Contribution Guidelines
Follow the monorepo structure for module development.
Use feature branches and create a pull request to develop branch.
Ensure Tailwind classes are used properly and avoid unnecessary CSS overrides.


This README should provide clarity on setting up and running your project locally. Let me know if you'd like to add any specific details! 🚀




## License

[MIT](https://choosealicense.com/licenses/mit/)


## Author

- [@jagankumar-egov](https://www.github.com/jagankumar-egov)


## Documentation

[Documentation](https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui)


## Support

For support, add the issues in https://github.com/egovernments/DIGIT-Frontend/issues.


![Logo](https://s3.ap-south-1.amazonaws.com/works-dev-asset/mseva-white-logo.png)

