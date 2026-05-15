# DIGIT Frontend

DIGIT Frontend is the web-based user interface layer of the DIGIT (Digital Infrastructure for Governance, Impact & Transformation) platform. It provides reusable UI components, micro frontend modules, shared libraries, and implementation tooling for building scalable governance applications.

DIGIT is an open-source, microservices-based platform designed to accelerate the delivery of public service applications across multiple domains such as health, sanitation, trade, payments, HRMS, and citizen services.

## About DIGIT

DIGIT (Digital Infrastructure for Governance, Impact & Transformation) is one of India’s largest open digital public infrastructure platforms for governance services.

The platform enables governments and implementation teams to rapidly configure, deploy, and scale digital public service applications using reusable backend services and frontend modules.

Learn more at:

* [DIGIT Platform](https://core.digit.org/)
* [eGov Foundation](https://egov.org.in/)

---

# DIGIT UI

This repository contains the source code for the DIGIT web applications and Micro UI architecture built using React.

It includes:

* Shared UI libraries and utilities
* Core platform modules
* Configurable micro frontend applications
* Workbench and MDMS V2 management interfaces
* Localization management utilities
* Citizen and Employee applications

The frontend architecture is designed to support:

* Micro frontend-based deployments
* Reusable configurable components
* Multi-tenant implementations
* Scalable governance workflows
* Rapid application onboarding

---

# Key Features

* Micro frontend architecture using React
* Shared component and utility libraries
* Configurable UI-driven modules
* Multi-tenant support
* Localization and internationalization support
* MDMS V2 management interfaces
* Citizen and employee-facing applications
* Extensible plugin/module architecture
* Environment-based deployments

---

# Modules

The repository includes multiple DIGIT modules and platform applications such as:

1. Core
2. Workbench
3. HRMS
4. Dashboard
5. Engagement
6. Payments
7. Health
8. Sanitation
9. Trade License
10. Common Platform Libraries

---

# Tech Stack

## Frontend Libraries & Frameworks

* [React](https://react.dev/?utm_source=chatgpt.com)
* [React Hook Form](https://react-hook-form.com/?utm_source=chatgpt.com)
* [TanStack Query (React Query)](https://tanstack.com/query/latest?utm_source=chatgpt.com)
* [Tailwind CSS](https://tailwindcss.com/?utm_source=chatgpt.com)
* [Webpack](https://webpack.js.org/?utm_source=chatgpt.com)

## Architecture & Tooling

* Micro Frontends
* Module Federation
* Yarn Workspaces
* Lerna-based Monorepo Management
* Docker-based Deployments
* Kubernetes-compatible Deployment Architecture

---

# Repository Structure

```bash
DIGIT-Frontend/
│
├── micro-ui/
│   ├── web/
│   │   ├── micro-ui-internals/
│   │   ├── packages/
│   │   └── ...
│   │
│   └── ...
│
├── packages/
├── deploy-as-code/
├── docs/
└── ...
```

---

# Run Locally

## Clone the Repository

```bash
git clone https://github.com/egovernments/DIGIT-Frontend.git
```

## Navigate to Micro UI Internals

```bash
cd micro-ui/web/micro-ui-internals
```

## Install Dependencies

```bash
yarn install
```

## Configure Environment Variables

Create a `.env` file using the sample configuration:

```bash
micro-ui/web/micro-ui-internals/example/.env
```

Sample environment configuration:

```env
REACT_APP_PROXY_API={{server_url}}
REACT_APP_GLOBAL={{server_url}}
REACT_APP_PROXY_ASSETS={{server_url}}
REACT_APP_USER_TYPE={{EMPLOYEE|CITIZEN}}
SKIP_PREFLIGHT_CHECK=true
```

Reference sample:

* [Sample .env Configuration](https://github.com/egovernments/Digit-Core/blob/workbench/frontend/micro-ui/web/micro-ui-internals/example/.env-unifieddev)

## Start Development Server

```bash
yarn start
```

---

# Starting a DIGIT Micro UI Application

For implementation teams working with Micro UI applications:

## Navigate to Web Directory

```bash
cd micro-ui/web
```

## Install Dependencies

```bash
yarn install
```

## Configure Environment

Create:

```bash
micro-ui/web/.env
```

## Run Application

```bash
yarn start
```

---

# Workbench Module

The Workbench module is used for managing:

* Master Data Management System (MDMS V2) data
* Localization data
* Configurable governance platform metadata
* Cross-module platform configurations

Workbench enables centralized management of configuration-driven platform behavior across DIGIT services and applications.

---

# Documentation

* [DIGIT UI Developer Guide](https://docs.digit.org/digit-ui/)
* [DIGIT Documentation](https://docs.digit.org/)

---

# Support

For support, bug reports, and feature requests:

* [DIGIT Core Issues](https://github.com/egovernments/DIGIT-Frontend/issues)

---

# License

This project is licensed under the MIT License.

* [MIT License](https://choosealicense.com/licenses/mit)

---

## Maintainers

* [@swathi-egov](https://github.com/swathi-egov)
* [@tulika-egov](https://github.com/tulika-egov)
* [@Ramkrishna-egov](https://github.com/Ramkrishna-egov)
* [@jagankumar-egov](https://github.com/jagankumar-egov)

---

# Author

* [@jagankumar-egov](https://github.com/jagankumar-egov)

---

# Repository

* [DIGIT-Frontend Repository](https://github.com/egovernments/DIGIT-Frontend)


![eGov Logo](https://egov-website-content.s3.ap-south-1.amazonaws.com/wp-content/uploads/2024/08/25123706/eGov-Foundation.png)

---

[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/12843/badge)](https://www.bestpractices.dev/projects/12843)

---

![License](https://img.shields.io/badge/license-MIT-blue.svg)

[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/egovernments/DIGIT-Frontend/badge)](https://scorecard.dev/viewer/?uri=github.com/egovernments/DIGIT-Frontend)

[![CI](https://github.com/egovernments/DIGIT-Frontend/actions/workflows/build.yml/badge.svg)](https://github.com/egovernments/DIGIT-Frontend/actions)
