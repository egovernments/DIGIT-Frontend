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

Once the development server is running, you can access the application at `http://localhost:3000`. Explore the various digital products and interact with the features provided by the sandbox portal.

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
│   ├── root-app/                  # Main rendered JS app
│   │   ├── public/                # Public assets for root app
│   │   ├── src/                   # Source files for root app
│   ├── modules/                   # Microfrontend modules
│   │   ├── account-mgmt/          # Account Management App
│   │   │   ├── public/            # Public assets for module 1
│   │   │   ├── src/               # Source files for module 1
│   │   │   ├── css/               # css files for module 1
│   │   ├── data-mgmt/             # Data Management App
│   │   │   ├── public/            # Public assets for module 2
│   │   │   ├── src/               # Source files for module 2
│   │   │   ├── css/               # css files for module 2
│   │   ├── user-app/              # User App
│   │   │   ├── public/            # Public assets for module 3
│   │   │   ├── src/               # Source files for module 3
│   │   │   ├── css/               # css files for module 3
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

## License

[MIT](https://choosealicense.com/licenses/mit/)


## Author

- [@jagankumar-egov](https://www.github.com/jagankumar-egov)


## Documentation

[Documentation](https://https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui)


## Support

For support, add the issues in https://github.com/egovernments/DIGIT-core/issues.



![Logo](https://s3.ap-south-1.amazonaws.com/works-dev-asset/mseva-white-logo.png)

---

Happy coding! If you have any questions, feel free to reach out to us.