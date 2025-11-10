# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the DIGIT-Frontend repository containing the DIGIT eGovernance Platform UI implementation. DIGIT (Digital Infrastructure for Governance, Impact & Transformation) is India's largest platform for governance services. This repository implements a React-based micro-frontend architecture with multiple independent governance modules.

**Current Branch**: `mSeva-upgrade-1.0.0-react19` - This is a React 19 upgrade branch.

## Architecture

### Micro-Frontend Structure

The repository uses a **Yarn workspaces-based micro-frontend architecture** where:

1. **Main Application Entry Points**:
   - `micro-ui/web/` - Production application entry (for deployment)
   - `micro-ui/web/micro-ui-internals/example/` - Development application entry (for local development)

2. **Workspace Packages** (`micro-ui/web/micro-ui-internals/packages/`):
   - `css/` - Shared CSS package (`@egovernments/digit-ui-mseva-css`)
   - `libraries/` - Core libraries package (`@egovernments/digit-ui-libraries`)
   - `modules/*` - Individual governance modules (each is a separate package)

3. **Module System**:
   Each module in `packages/modules/` is an independent webpack-compiled package that:
   - Exports a `Module.js` file containing module registration
   - Has its own `package.json`, `webpack.config.js`, and `.babelrc`
   - Registers components via `Digit.ComponentRegistryService.setComponent()`
   - Initializes with an `init*Components()` function (e.g., `initPropertyTaxComponents()`)

### Available Modules

- `property-tax` (PT) - Property tax management
- `birth` - Birth certificate services
- `death` - Death certificate services
- `firenoc` (FIRENOC) - Fire NOC services
- `tl` (TL) - Trade License services
- `ws` (WS) - Water & Sewerage services
- `hrms` (HRMS) - HR Management System
- `pgr` (PGR) - Public Grievance Redressal
- `receipts` (RECEIPTS) - Receipts management
- `bills` (Bills) - Bill management
- `engagement` (Engagement) - Citizen engagement
- `finance` (Finance) - Financial management

### Core Concepts

1. **Module Registration**: Modules register themselves and their components in `Module.js` using the `Digit.ComponentRegistryService`
2. **Lazy Loading**: Modules are dynamically imported in `example/src/index.js` and initialized sequentially
3. **Dual User Types**: Each module typically has separate `pages/employee/` and `pages/citizen/` directories
4. **UI Customizations**: Each module can override UI configs via `UICustomizations.js` files
5. **External Dependencies**: React, ReactDOM, react-router-dom, etc. are externalized in webpack configs to avoid duplication

## Development Commands

### Initial Setup

```bash
# Clone and navigate to the development directory
cd micro-ui/web/micro-ui-internals

# Install dependencies
yarn install

# Create .env file (required)
# Location: micro-ui/web/micro-ui-internals/example/.env
```

### Environment Variables (.env)

Required environment variables for `micro-ui/web/micro-ui-internals/example/.env`:

```bash
SKIP_PREFLIGHT_CHECK=true
REACT_APP_STATE_LEVEL_TENANT_ID=pb
REACT_APP_PROXY_API=<backend-api-url>
REACT_APP_GLOBAL=<global-config-url>
REACT_APP_PROXY_ASSETS=<assets-url>
REACT_APP_USER_TYPE=EMPLOYEE  # or CITIZEN
```

### Running the Application

```bash
# From micro-ui/web/micro-ui-internals/
yarn start
# This runs: yarn build && run-p dev:**
# Starts all module dev servers + example app in parallel
# Dev server runs on http://localhost:3000
```

### Development Workflows

```bash
# Start development with example app
cd micro-ui/web/micro-ui-internals
yarn start

# Start only the example app (without rebuilding modules)
yarn dev:example

# Develop a specific module in watch mode
yarn dev:property-tax  # or dev:birth, dev:ws, dev:hrms, etc.
yarn dev:css  # CSS package in watch mode

# Build all modules for production
yarn build
# This builds all modules in parallel: build:property-tax, build:birth, etc.
```

### Production Build Commands

```bash
# From micro-ui/web/ (production app)
yarn install
yarn build  # Uses react-scripts build
yarn build:webpack  # Webpack production build
yarn build:libraries  # Build libraries first, then webpack

# From micro-ui/web/micro-ui-internals/ (module packages)
yarn build  # Build all modules in parallel
```

### Module-Specific Commands

Each module can be developed independently:

```bash
# From micro-ui/web/micro-ui-internals/packages/modules/<module-name>/
yarn start  # Start webpack dev server for this module
yarn build  # Build this module only
```

## Key Technical Details

### React Version
- **React 19.0.0** - This is a React 19 migration. All modules use React 19 and React DOM 19.
- React Router v6.x.x
- React Hook Form 6.15.8
- React Query 3.6.1 (legacy modules) + @tanstack/react-query 5.x (newer code)

### Build Tools
- **Webpack 5** for production builds and module bundling
- **react-scripts 4.0.1** for development server (CRA-based)
- **microbundle-crl** for library package builds
- **Babel** for transpilation with React 19 presets

### Webpack Configuration Details

Production build (`micro-ui/web/webpack.config.js`):
- **Externals**: React, ReactDOM, react-router-dom, and all @egovernments/* packages are externalized
- **Code Splitting**: Configured with multiple cache groups (vendor, react, digitUI, excel, maps, forms, tables)
- **Chunk Optimization**: Max chunk size 150KB, async loading for heavy dependencies
- **Dev Server Proxy**: Extensive proxy configuration for 60+ backend API endpoints

### Important Patterns

1. **Module Initialization Flow**:
   ```
   example/src/index.js (lazy loads DigitUI)
   → initLibraries()
   → Dynamic imports of all modules
   → Call init*Components() for each module
   → Module registers components via Digit.ComponentRegistryService
   → DigitUI renders with enabledModules
   ```

2. **User Type Routing**: Modules check `userType === "employee"` vs `"citizen"` to render different app experiences

3. **Session Storage**: User authentication stored in `window.Digit.SessionStorage` with keys like `User`, `Citizen.tenantId`, `Employee.tenantId`

4. **Customizations**: Override configs via `window.Digit.Customizations = { commonUiConfig: UICustomizations }`

## File Structure

```
micro-ui/web/
├── package.json                 # Production app dependencies
├── webpack.config.js            # Production webpack config
├── src/                         # Production app source
├── public/                      # Static assets
├── docker/                      # Dockerfile and nginx config
└── micro-ui-internals/
    ├── package.json             # Root workspace config
    ├── example/                 # Development app
    │   ├── src/index.js         # Dev entry point
    │   └── .env                 # Required env config
    ├── packages/
    │   ├── css/                 # Shared CSS package
    │   ├── libraries/           # Core libraries
    │   └── modules/
    │       ├── property-tax/    # Each module has:
    │       │   ├── src/Module.js         # Module registration
    │       │   ├── src/pages/employee/   # Employee UI
    │       │   ├── src/pages/citizen/    # Citizen UI
    │       │   ├── src/components/       # Module components
    │       │   ├── webpack.config.js     # Module webpack config
    │       │   ├── .babelrc              # Babel config
    │       │   └── package.json          # Module dependencies
    │       ├── birth/
    │       ├── death/
    │       └── ... (12 total modules)
    └── scripts/                 # Build and deployment scripts
```

## Docker & CI/CD

- **Dockerfile**: `micro-ui/web/docker/Dockerfile` - Multi-stage build (Node 14 Alpine → nginx)
- **Build Command**: `yarn build:webpack` (builds libraries then webpack production build)
- **CI**: `.github/workflows/build.yml` - Multi-arch Docker builds (amd64/arm64) with manifest creation
- **Output**: Static build served via nginx from `/var/web/mseva-ui/`

## Code Style

- **Prettier**: Configured with lint-staged for pre-commit formatting
- **ESLint**: Uses `react-app` config
- **Husky**: Git hooks configured for code formatting on commit

## External Dependencies

Published packages from @egovernments:
- `@egovernments/digit-ui-libraries` (1.9.0)
- `@egovernments/digit-ui-components` (0.2.3)
- `@egovernments/digit-ui-react-components` (1.9.0)
- `@egovernments/digit-ui-module-core` (1.9.0)
- `@egovernments/digit-ui-module-utilities` (1.0.16)
- `@egovernments/digit-ui-svg-components` (1.1.0)

## Working with Modules

When making changes to a specific module:

1. Navigate to the module directory: `cd micro-ui/web/micro-ui-internals/packages/modules/<module-name>`
2. Run `yarn start` to start the module dev server
3. In another terminal, run `yarn dev:example` from `micro-ui-internals/` to see changes
4. Module changes will hot-reload automatically

When adding a new module:

1. Create module structure in `packages/modules/<module-name>/`
2. Add to workspace in `micro-ui/web/micro-ui-internals/package.json` workspaces array
3. Add to `micro-ui/web/package.json` workspaces array
4. Add module to `enabledModules` array in `example/src/index.js`
5. Create dynamic import and call `init*Components()` in the useEffect hook
6. Add dev and build scripts to `micro-ui-internals/package.json`

## Testing

The project does not currently have a comprehensive test suite configured. When writing tests:
- Use Jest (included via react-scripts)
- Follow React Testing Library patterns
- Test files should be colocated with components

## Common Issues

1. **"Module not found" errors**: Ensure all workspaces are properly linked with `yarn install` at root
2. **React version conflicts**: All packages must use React 19.0.0 as peer dependency
3. **Build failures**: Check that `.env` file exists with required variables
4. **Memory issues during build**: Webpack may need increased Node memory (already set to 4792MB in Dockerfile)
5. **Port conflicts**: Dev server runs on port 3000, ensure it's available

## Documentation

- Official docs: https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui
- Support/Issues: https://github.com/egovernments/DIGIT-core/issues
