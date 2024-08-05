
# Project Documentation: Cloning and Running the Monorepo

This documentation provides step-by-step instructions for cloning, setting up, and running a monorepo containing multiple microfrontends and a shared component library. The project uses Lerna and Yarn Workspaces for package management.

## Prerequisites

Before you begin, ensure that you have the following software installed on your machine:

- **Node.js** (v18.x or higher) and npm (v6.x or higher): [Download Node.js](https://nodejs.org/)
- **Yarn** (v1.x or v2.x): [Download Yarn](https://yarnpkg.com/getting-started/install)
- **Git**: [Download Git](https://git-scm.com/downloads)

## 1. Clone the Repository

To start, clone the repository to your local machine:

```bash
git clone https://github.com/your-username/your-repo-name.git
```

Navigate into the project directory:

```bash
cd your-repo-name
```

## 2. Install Dependencies

The project uses Yarn Workspaces and Lerna to manage dependencies. You can install all dependencies for the monorepo with the following command:

```bash
yarn install
```

This command installs all dependencies and links the packages together, as defined in the `package.json` files of each package.

## 3. Project Structure

The monorepo structure is as follows:

```
/your-repo-name
  /packages
    /microfrontend1      # First microfrontend
    /microfrontend2      # Second microfrontend
    /components-lib      # Shared React components library
```

- **`packages/microfrontend1`**: Contains the first microfrontend.
- **`packages/microfrontend2`**: Contains the second microfrontend.
- **`packages/components-lib`**: Contains the shared components library used by both microfrontends.

## 4. Running the Microfrontends

Each microfrontend can be started individually. Navigate to the root directory and use Lerna to run the start script:

To start all microfrontends:

```bash
yarn start
```

Or to start a specific microfrontend:

```bash
lerna run start --scope=microfrontend1
lerna run start --scope=microfrontend2
```

These commands use Lerna to execute the `start` script defined in the respective `package.json` files.

## 5. Building the Project

To build all packages in the monorepo, run:

```bash
yarn build
```

Or to build a specific package:

```bash
lerna run build --scope=microfrontend1
lerna run build --scope=microfrontend2
lerna run build --scope=components-lib
```

These commands will create production-ready builds of the applications and the shared component library.

## 6. Using the Component Library

The shared component library (`components-lib`) is automatically linked to the microfrontends via Yarn Workspaces. To use components from the library in your microfrontends, import them as you would with any other package:

```javascript
import { Button } from 'components-lib';
```

Ensure that the `components-lib` version specified in the microfrontends' `package.json` files matches the version in the library.

## 7. Developing and Testing

To facilitate development, you can use the following commands:

- **Watch for Changes**: Run the following to watch for changes and rebuild packages:

  ```bash
  yarn watch
  ```

- **Testing**: Run tests for all packages:

  ```bash
  yarn test
  ```

  Or run tests for a specific package:

  ```bash
  lerna run test --scope=microfrontend1
  ```

## 8. Versioning and Publishing

To version and publish the packages, use the following Lerna commands:

- **Versioning**: Increment versions for all packages:

  ```bash
  lerna version
  ```

- **Publishing**: Publish packages to npm or another registry:

  ```bash
  lerna publish
  ```

These commands will help manage versions and distribute the packages.

## 9. Contributing

If you'd like to contribute to the project, please follow these steps:

1. **Fork the repository** on GitHub.
2. **Create a new branch** with a descriptive name.
3. **Make your changes** and commit them.
4. **Push your changes** to your fork.
5. **Submit a pull request** detailing your changes.

## 10. License

Include information about the project's license here.

---

This document provides a comprehensive guide to setting up and running the monorepo project. For further questions or issues, please refer to the project's documentation or contact the maintainers.
