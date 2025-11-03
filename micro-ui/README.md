
# DIGIT UI - Modern React Frontend

A modern React 17 application built on top of DIGIT UI Core framework with micro-frontend architecture.

## 🏛️ About DIGIT

**DIGIT** (Digital Infrastructure for Governance, Impact & Transformation) is India's largest platform for governance services. Visit [core.digit.org](https://core.digit.org/) for more details.

DIGIT platform is a microservices-based API platform enabling quick rebundling of services as per specific needs. This repository contains the frontend implementation for DIGIT's web interface.

## 🚀 DIGIT UI Framework

This repository contains source code for the modern web implementation of DIGIT UI modules with a comprehensive component library and modular architecture.

### Key Features:
- **Modern React 17** with hooks and functional components
- **Micro-frontend architecture** for scalable development
- **Component-driven development** with reusable UI components
- **Advanced state management** with React Query and Redux
- **Type-safe development** with modern JavaScript patterns
- **Responsive design** with mobile-first approach

### Core Modules:
- **🏗️ Workbench**: Manage master data (MDMS V2 Service) and system configuration
- **🌐 Localization**: Manage translation data and multi-language support
- **👥 HRMS**: Human Resource Management System
- **📊 Dashboard**: Analytics and reporting interface
- **🔄 Engagement**: Citizen engagement and communication tools
- **💳 Payment**: Payment gateway integration and management


## 🚀 Quick Start

### Prerequisites
- **Node.js** >= 14.x
- **Yarn** package manager
- **Git** for version control

### Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/egovernments/DIGIT-Frontend.git
cd DIGIT-Frontend
```

2. **Navigate to micro-ui directory**
```bash
cd micro-ui/web/micro-ui-internals
```

3. **Install dependencies**
```bash
yarn install
```

4. **Setup environment variables**
```bash
# Copy the sample environment file
cp example/.env-sample example/.env

# Edit the .env file with your configuration
nano example/.env
```

5. **Start the development server**
```bash
yarn start
```

The application will be available at `http://localhost:3000`

### Development Commands

```bash
# Start all modules in development mode
yarn start

# Build all packages
yarn build

# Clean all node_modules and dist folders
yarn clean

# Format code with Prettier
yarn format

# Development mode for specific modules
yarn dev:core          # Core module
yarn dev:workbench      # Workbench module
yarn dev:css            # CSS package
yarn dev:components     # React components
```

## ⚙️ Environment Configuration

### Required Environment Variables

Create a `.env` file in `micro-ui/web/micro-ui-internals/example/` with the following variables:

```bash
# API Configuration
REACT_APP_PROXY_API=https://your-api-server.com
REACT_APP_GLOBAL=https://your-global-server.com
REACT_APP_PROXY_ASSETS=https://your-assets-server.com

# Application Configuration
REACT_APP_USER_TYPE=EMPLOYEE  # or CITIZEN
SKIP_PREFLIGHT_CHECK=true

# Optional: Feature Flags
ENABLE_MDMS_BULK_UPLOAD=true
ENABLE_JSON_EDIT=true
ENABLE_MDMS_BULK_DOWNLOAD=true

# Optional: Module Configuration
CORE_UI_MODULE_LOCALE_PREFIX=custom_prefix
OVERRIDE_ROOT_TENANT_WITH_LOGGEDIN_TENANT=true
```

### Sample Configuration Files
- [Development Environment Sample](https://github.com/egovernments/Digit-Core/blob/workbench/frontend/micro-ui/web/micro-ui-internals/example/.env-unifieddev)
- [Production Environment Guide](https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui)

## 🛠️ Tech Stack

### Core Framework
- **[React 17.0.2](https://react.dev/)** - Modern React with hooks and concurrent features
- **[React DOM 17.0.2](https://react.dev/)** - DOM rendering library
- **[React Router DOM 5.3.0](https://reactrouter.com/)** - Client-side routing

### State Management & Data Fetching
- **[React Query 3.6.1](https://tanstack.com/query/v3/)** - Server state management and caching
- **[Redux 4.1.2](https://redux.js.org/)** - Predictable state container
- **[Redux Thunk 2.4.1](https://github.com/reduxjs/redux-thunk)** - Async action creators
- **[React Redux 7.2.8](https://react-redux.js.org/)** - React bindings for Redux

### Form Management
- **[React Hook Form 6.15.8](https://www.react-hook-form.com/)** - Performant forms with minimal re-renders

### Internationalization
- **[React i18next 11.16.2](https://react.i18next.com/)** - Internationalization framework

### Build Tools & Development
- **[Webpack](https://webpack.js.org/)** - Module bundler and build tool
- **[Microbundle CRL 0.13.11](https://github.com/developit/microbundle)** - Zero-configuration bundler
- **[Yarn Workspaces](https://yarnpkg.com/features/workspaces)** - Monorepo management

### Styling & UI
- **[Tailwind CSS 1.9.6](https://tailwindcss.com/)** - Utility-first CSS framework
- **[SCSS/Sass](https://sass-lang.com/)** - CSS preprocessor
- **Custom Component Library** - DIGIT-specific UI components

### Development Tools
- **[Prettier 2.1.2](https://prettier.io/)** - Code formatter
- **[Husky 7.0.4](https://typicode.github.io/husky/)** - Git hooks
- **[Lint-staged 12.3.7](https://github.com/okonet/lint-staged)** - Pre-commit linting

### Package Versions (Latest Release: 2.0.0-dev-01)
- **@egovernments/digit-ui-module-core**: 2.0.0-dev-01
- **@egovernments/digit-ui-module-workbench**: 2.0.0-dev-01
- **@egovernments/digit-ui-css**: 2.0.0-dev-01
- **@egovernments/digit-ui-react-components**: 1.9.0
- **@egovernments/digit-ui-components**: 0.2.3

## License

[MIT](https://choosealicense.com/licenses/mit/)


## 📁 Project Structure

```
micro-ui/
├── web/
│   ├── micro-ui-internals/          # Main development workspace
│   │   ├── packages/
│   │   │   ├── modules/             # Feature modules
│   │   │   │   ├── core/           # Core module (2.0.0-dev-01)
│   │   │   │   ├── workbench/      # Workbench module (2.0.0-dev-01)
│   │   │   │   ├── hrms/           # HRMS module
│   │   │   │   └── ...             # Other modules
│   │   │   ├── css/                # CSS package (2.0.0-dev-01)
│   │   │   ├── react-components/   # React components library
│   │   │   ├── svg-components/     # SVG components
│   │   │   └── libraries/          # Shared libraries
│   │   ├── example/                # Example implementation
│   │   └── scripts/                # Build and deployment scripts
│   └── public/                      # Static assets
└── README.md
```

## 🏗️ Available Modules

| Module | Version | Description |
|--------|---------|-------------|
| **Core** | 2.0.0-dev-01 | Authentication, routing, and base functionality |
| **Workbench** | 2.0.0-dev-01 | MDMS management and system configuration |
| **HRMS** | 1.x.x | Human Resource Management System |
| **Dashboard** | 1.x.x | Analytics and reporting interface |
| **Engagement** | 1.x.x | Citizen engagement and communication |
| **Payment** | 1.x.x | Payment gateway integration |
| **PGR** | 1.x.x | Public Grievance Redressal |
| **Utilities** | 1.x.x | Common utilities and helpers |

## 📖 Documentation & Resources

### Official Documentation
- **[DIGIT UI Developer Guide](https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui)** - Comprehensive development guide
- **[DIGIT Core Documentation](https://core.digit.org/)** - Platform overview and architecture
- **[API Documentation](https://core.digit.org/platform/api)** - Backend API reference

### Component Library
- **[React Components Storybook](https://digit-ui-react-components.netlify.app/)** - Interactive component documentation
- **[Design System Guide](https://core.digit.org/guides/design-guide)** - UI/UX guidelines and principles

### Development Resources
- **[Contributing Guide](https://github.com/egovernments/DIGIT-Frontend/blob/master/CONTRIBUTING.md)** - How to contribute to the project
- **[Code Style Guide](https://github.com/egovernments/DIGIT-Frontend/wiki/Code-Style)** - Coding standards and practices
- **[Testing Guidelines](https://github.com/egovernments/DIGIT-Frontend/wiki/Testing)** - Testing strategies and best practices

## 🤝 Support & Community

### Getting Help
- **[GitHub Issues](https://github.com/egovernments/DIGIT-core/issues)** - Bug reports and feature requests
- **[GitHub Discussions](https://github.com/egovernments/DIGIT-Frontend/discussions)** - Community discussions and Q&A
- **[Developer Forum](https://discuss.digit.org/)** - Technical discussions and support

### Contributing
- **[Contribution Guidelines](https://github.com/egovernments/DIGIT-Frontend/blob/master/CONTRIBUTING.md)**
- **[Code of Conduct](https://github.com/egovernments/DIGIT-Frontend/blob/master/CODE_OF_CONDUCT.md)**
- **[Security Policy](https://github.com/egovernments/DIGIT-Frontend/security/policy)**

## 👨‍💻 Authors & Maintainers

- **Jagan Kumar** - [@jagankumar-egov](https://www.github.com/jagankumar-egov) - *Initial work and core development*
- **DIGIT Team** - [@egovernments](https://github.com/egovernments) - *Ongoing maintenance*

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](https://choosealicense.com/licenses/mit/) file for details.

## 🚀 Quick Implementation Guide

For implementation teams looking to build on DIGIT UI:

```bash
# Navigate to implementation directory
cd micro-ui/web

# Install dependencies
yarn install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Start development server
yarn start
```

---

<div align="center">
  <img src="https://s3.ap-south-1.amazonaws.com/works-dev-asset/mseva-white-logo.png" alt="DIGIT Logo" width="200">
  
  **Built with ❤️ by the DIGIT Team**
  
  [Website](https://core.digit.org/) • [Documentation](https://core.digit.org/guides/) • [Community](https://discuss.digit.org/)
</div>
