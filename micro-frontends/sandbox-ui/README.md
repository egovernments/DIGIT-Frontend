# Sandbox Portal

Welcome to the Sandbox Portal! This open-source project is designed to provide a platform for exploring various digital products, such as urban, health, works, and more. The application is built using React 18.3.1 and Node 20, leveraging a microfrontend architecture with Single SPA and Module Federation.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Core Technologies](#core-technologies)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Microfrontend Architecture**: Uses Single SPA and Module Federation for a scalable and modular architecture.
- **React 18.3.1**: Latest features and performance improvements of React.
- **Node 20**: Modern and efficient backend.
- **TailwindCSS**: Utility-first CSS framework for rapid UI development.
- **Digit UI Components**: Pre-built UI components from the `digit-ui-components` library.
- **React Query**: Data fetching and state management made simple.

## Installation

To get started with the Sandbox Portal, follow these steps:

1. **Clone the Repository**:

   ```sh
   git clone https://github.com/egovernments/Digit-Frontend/tree/sandbox-develop.git
   cd micro-frontends/sandbox-ui
   ```

2. **Install Dependencies**:

   ```sh
   npm install
   ```

3. **Build Packages & Components**:

   ```sh
   npm run build
   ```

4. **Start the Development Server**:
   ```sh
   npm run start
   ```

## Usage

Once the development server is running, you can access the application at `http://localhost:9001`. Explore the various digital products and interact with the features provided by the sandbox portal.

## Core Technologies

- **React 18.3.1**: A JavaScript library for building user interfaces.
- **Node 20**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Single SPA**: A JavaScript framework for front-end microservices.
- **Module Federation**: A feature of webpack that allows the sharing of modules between different projects.
- **TailwindCSS**: A utility-first CSS framework.
- **React Query**: Data fetching and state management library.
- **Digit UI Components**: Pre-built UI components tailored for the project.

### Digit UI Components

Pre-built UI components, it is a library of reusable components that can be used in the Sandbox Portal.
Refer [Storybook](https://unified-dev.digit.org/storybook/) to know more about the components.

- **Usage**

```sh
   import { DigitUIComponents } from "components";

   const { InfoCard, Stepper, Button, Timeline, InfoButton, or any component } = DigitUIComponents;

   <Button/>

```

## Project Structure

```
sandbox-ui/
├── packages/                      # Microfrontends
│   ├── components/                # Shared React components
│   │   └── src/                   # Source files for shared components
│   │       ├── components/        # React components
│   │       │   ├── DigitRouter.js
│   │       │   ├── DigitScreenWrapper.js
│   │       │   ├── ErrorBoundary.js
│   │       │   ├── NavigateButton.js
│   │       │   ├── Sidebar.js
│   │       │   ├── StepperForm.js
│   │       │   ├── TabForm.js
│   │       │   ├── Test.js
│   │       │   ├── Topbar.js
│   │       ├── contexts/          # Context providers
│   │       ├── hoc/               # Higher Order Components
│   │       │   ├── FormComposer/
│   │       │   ├── withAuth.js
│   │       │   ├── withNavigator.js
│   │       ├── hooks/             # Custom React hooks
│   │       │   ├── index.js
│   │       │   ├── useCustomAPIHook.js
│   │       │   ├── useLastUpdatedField.js
│   │       │   ├── useMDMSHook.js
│   │       ├── providers/         # Context providers
│   │       ├── services/          # Service utilities
│   │       │   ├── genericService.js
│   │       │   ├── mdmsCache.js
│   │       │   ├── Request.js
│   │       ├── states/            # State management
│   │       │   ├── createState.js
│   │       │   ├── index.js
│   │       │   ├── stateConfigs.js
│   │       │   ├── useAuthState.js
│   │       │   ├── useClearAll.js
│   │       │   ├── useDrawerState.js
│   │       │   ├── useLocaleState.js
│   │       │   ├── useNavigatorState.js
│   │       │   ├── useTenantState.js
│   │       │   ├── useUserState.js
│   │       ├── Button.js
│   │       ├── CustomCheck.js
│   │       ├── DigitUIComponents.js
│   │       ├── index.js
│   │       ├── Sample.js
│   │       ├── test.js
│   │       ├── .babelrc           # Babel configuration
│   │       ├── .gitignore         # Git ignore file
│   │       ├── package.json       # NPM package configuration
│   │       ├── webpack.config.js  # Webpack configuration
│   ├── root-app/                  # Main rendered JS app
│   │   ├── public/                # Public assets for root app
│   │   ├── src/                   # Source files for root app
│   ├── modules/                   # Microfrontend modules
│   │   ├── account-mgmt/          # Account Management App
│   │   │   ├── docker/            # Docker configuration for the module
│   │   │   ├── node_modules/      # Node.js modules
│   │   │   ├── src/               # Source files for Data Management App
│   │   │   │   ├── components/    # React components for data management
│   │   │   │   │   ├── NetworkTest.js
│   │   │   │   │   ├── Sample.js
│   │   │   │   │   ├── SampleTwo.js
│   │   │   │   ├── hooks/         # Custom React hooks
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── useToggle.js
│   │   │   │   ├── pages/         # Pages for data management
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── PageOne.js
│   │   │   │   ├── utils/         # Utility functions
│   │   │   │   │   ├── DateUtils.js
│   │   │   │   │   ├── index.js
│   │   │   │   ├── app-react-app.js
│   │   │   │   ├── App.js
│   │   │   ├── babel.config.json  # Babel configuration
│   │   │   ├── jest.config.js     # Jest configuration
│   │   │   ├── package.json       # NPM package configuration
│   │   ├── data-mgmt/             # Data Management App
│   │   │   ├── docker/            # Docker configuration for the module
│   │   │   ├── node_modules/      # Node.js modules
│   │   │   ├── src/               # Source files for Data Management App
│   │   │   │   ├── components/    # React components for data management
│   │   │   │   │   ├── NetworkTest.js
│   │   │   │   │   ├── Sample.js
│   │   │   │   │   ├── SampleTwo.js
│   │   │   │   ├── hooks/         # Custom React hooks
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── useToggle.js
│   │   │   │   ├── pages/         # Pages for data management
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── PageOne.js
│   │   │   │   ├── utils/         # Utility functions
│   │   │   │   │   ├── DateUtils.js
│   │   │   │   │   ├── index.js
│   │   │   │   ├── app-react-app.js
│   │   │   │   ├── App.js
│   │   │   ├── babel.config.json  # Babel configuration
│   │   │   ├── jest.config.js     # Jest configuration
│   │   │   ├── package.json       # NPM package configuration
│   │   ├── user-app/              # User App
│   │   │   ├── docker/            # Docker configuration for the module
│   │   │   ├── node_modules/      # Node.js modules
│   │   │   ├── src/               # Source files for Data Management App
│   │   │   │   ├── components/    # React components for data management
│   │   │   │   │   ├── NetworkTest.js
│   │   │   │   │   ├── Sample.js
│   │   │   │   │   ├── SampleTwo.js
│   │   │   │   ├── hooks/         # Custom React hooks
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── useToggle.js
│   │   │   │   ├── pages/         # Pages for data management
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── PageOne.js
│   │   │   │   ├── utils/         # Utility functions
│   │   │   │   │   ├── DateUtils.js
│   │   │   │   │   ├── index.js
│   │   │   │   ├── app-react-app.js
│   │   │   │   ├── App.js
│   │   │   ├── babel.config.json  # Babel configuration
│   │   │   ├── jest.config.js     # Jest configuration
│   │   │   ├── package.json       # NPM package configuration
├── .gitignore                     # Git ignore file
├── package.json                   # NPM package configuration
├── lerna.json                     # Lerna configuration
└── README.md                      # Project README

```

## Contributing

We welcome contributions from the community! If you have suggestions, bug reports, or feature requests, please open an issue or submit a pull request. Follow these steps to contribute:

1. **Fork the Repository**.
2. **Create a New Branch**:
   ```sh
   git checkout -b feature/jira-ticket-no
   ```
3. **Commit Your Changes**:
   ```sh
   git commit -m 'jira-ticket-no :: Add some feature details'
   ```
4. **Push to the Branch**:
   ```sh
   git push origin feature/jira-ticket-no
   ```
5. **Open a Pull Request**.


# Best Practices

This document outlines best practices for organizing and naming files, components, and other elements in your React application. Following these practices ensures consistency, readability, and maintainability across the codebase.

## Referring Reusable Components

### File Structure

1. **Reusable Components Directory:**

   - Place reusable components in a common directory like `src/components`.

2. **Atomic Design Principles:**

   - Maintain separate directories for **atoms**, **molecules**, and **organisms** to adhere to atomic design principles.
     src/
     └── components/
     ├── atoms/ # Simple, reusable components (e.g., Button, InputField)
     ├── molecules/ # Combinations of atoms (e.g., FormInputGroup, Card)
     ├── organisms/ # Larger components composed of atoms and molecules

3. **Import Statements:**

- Use relative imports for components within the same module.
- Use absolute imports (aliasing) for shared components from a centralized location.

````javascript
import Button from 'components/atoms/Button';

// src/components/atoms/Button.js
import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ label, onClick, type = 'button' }) => (
  <button className="button--primary" type={type} onClick={onClick}>
    {label}
  </button>
);

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string,
};

export default Button;
````

## Naming Conventions

### React Components

- **Component Names:** Use PascalCase.
  - Example: `MyComponent.js`

### React Screens

- **File and Component Names:** Use PascalCase and suffix with `Screen` if it represents a full screen/page.
  - Example: `UserProfileScreen.js`

### Reusable Atoms

- **Naming:** Should be self-explanatory and in PascalCase.
  - Example: `Button.js`, `InputField.js`

### Reusable Molecules

- **Naming:** Should describe the composed functionality and be in PascalCase.
  - Example: `FormInputGroup.js`, `Card.js`

### Higher Order Components (HOC)

- **Naming:** Prefix with `with` and use PascalCase.
  - Example: `withAuth.js`, `withLogger.js`

### Hooks

- **Naming:** Prefix with `use` and use camelCase.
  - Example: `useFetchData.js`, `useToggle.js`

### Services

- **Naming:** Should be in camelCase, reflecting the functionality.
  - Example: `apiService.js`, `authService.js`

### Utils

- **Naming:** Should reflect the utility purpose and be in camelCase.
  - Example: `dateUtils.js`, `stringUtils.js`

### CSS Class Names

- **Naming:** Use BEM (Block Element Modifier) methodology for naming.
  - Example: `button--primary`, `card__header--large`

---
Reusable Component (Atom)

````javascript
// src/components/atoms/Button.js
import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ label, onClick, type = 'button' }) => (
  <button className="button--primary" type={type} onClick={onClick}>
    {label}
  </button>
);

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string,
};

export default Button;
````

Reusable Component (Molecule)

````javascript
// src/components/molecules/FormInputGroup.js
import React from 'react';
import PropTypes from 'prop-types';
import InputField from '../atoms/InputField';
import Label from '../atoms/Label';

const FormInputGroup = ({ label, name, value, onChange }) => (
  <div className="form-input-group">
    <Label htmlFor={name} text={label} />
    <InputField name={name} value={value} onChange={onChange} />
  </div>
);

FormInputGroup.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FormInputGroup;

````

Custom Hook

````javascript
// src/hooks/useToggle.js
import { useState } from 'react';

const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = () => setValue((prevValue) => !prevValue);

  return [value, toggle];
};

export default useToggle;

````

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Author

- [@jagankumar-egov](https://www.github.com/jagankumar-egov)

## Documentation

[Documentation](https://https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui)

## Support

For support, add the issues in https://github.com/egovernments/DIGIT-Frontend/issues.

![Logo](https://s3.ap-south-1.amazonaws.com/works-dev-asset/mseva-white-logo.png)

---

Happy coding! If you have any questions, feel free to reach out to us.
