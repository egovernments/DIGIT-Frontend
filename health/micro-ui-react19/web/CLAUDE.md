# CLAUDE.md - DIGIT Frontend (Health Micro UI - React 19)

## Project Overview

This is the **DIGIT Health Micro UI** frontend application, migrated to **React 19**. It is a modular micro-frontend platform for eGovernments health services (campaign management, workbench, etc.), built on the DIGIT UI framework.

## Tech Stack

- **React 19** with **React DOM 19** (migrated from earlier React versions)
- **Webpack 5** (dev server + production builds)
- **Babel** (JSX/ES6+ transpilation)
- **Yarn 1.22** workspaces (monorepo)
- **Node >= 14** (currently using v14.21.3)
- **React Router DOM 6** / **React Query v5** (`@tanstack/react-query`)
- **styled-components 6**

## Project Structure

```
web/
├── src/
│   ├── index.js              # App entry point (ReactDOM.createRoot)
│   ├── ComponentRegistry.js  # Component registration
│   ├── globalConfig.js       # Global configuration
│   └── Customisations/       # Custom overrides
├── packages/
│   ├── css/                  # Shared CSS package
│   └── modules/
│       └── campaign-manager/ # Campaign manager module (local workspace)
├── builds/                   # Build variants (console, core-ui, workbench-ui)
├── public/                   # Static HTML templates
├── webpack.common.js         # Shared webpack config
├── webpack.dev.js            # Dev server config (proxy, HMR)
├── webpack.prod.js           # Production build config
└── package.json              # Root package with workspaces
```

## Key Commands

```bash
yarn install              # Install all dependencies (including workspace packages)
yarn start                # Start dev server with package watching (port 3000)
yarn start:webpack-only   # Start only webpack dev server (no package watching)
yarn build                # Build packages + production webpack build
yarn build:prod           # Same as build
yarn build:analyze        # Production build with bundle analyzer
yarn clean                # Remove node_modules, build, dist
```

## Development Setup

- Dev server runs on port **3000** (configurable via `PORT` env var)
- Public path: `/workbench-ui/`
- API proxy target: `REACT_APP_PROXY_URL` env var (defaults to `https://unified-uat.digit.org`)
- Environment variables are loaded from `.env` file via `dotenv-webpack`

## Architecture Notes

### Module System
- Modules are loaded dynamically via `import()` in `src/index.js`
- Each module exposes an `init*Components()` function to register itself
- Enabled modules: `assignment`, `Workbench`, `Utilities`, `Campaign`
- The `@egovernments/digit-ui-module-core` provides the `DigitUI` shell component

### DIGIT UI Packages (from npm)
- `@egovernments/digit-ui-libraries` - Core hooks and utilities
- `@egovernments/digit-ui-module-core` - Shell/layout module
- `@egovernments/digit-ui-react-components` - Shared React components
- `@egovernments/digit-ui-svg-components` - SVG icon components
- `@egovernments/digit-ui-components` - UI component library
- `@egovernments/digit-ui-module-workbench` - Workbench module

### React 19 Migration
- Uses `ReactDOM.createRoot()` (not legacy `ReactDOM.render()`)
- Yarn resolutions force all sub-dependencies to React 19 and compatible versions
- Webpack aliases ensure a single React instance across all packages
- `react-query` is aliased to `@tanstack/react-query` v5

### Webpack Configuration
- Aliases enforce single React instance (`react`, `react-dom`, `react-dom/client`, `react/jsx-runtime`)
- Local `campaign-manager` package is aliased to its `dist/main.js`
- CSS package aliased to `dist/index.css`
- `process/browser` polyfill is provided globally

## Coding Conventions

- Use **ES6+ JavaScript** (no TypeScript in this project)
- Follow existing patterns for module registration (`init*Components`)
- Use `window.Digit` as the global namespace for DIGIT framework utilities
- Prettier is configured for formatting (`.js`, `.css`, `.md`)
- ESLint extends `react-app` config

## Common Gotchas

- Always build local packages before the main build (`yarn build:packages` runs first)
- React version mismatches cause runtime errors - the resolutions and aliases in webpack are critical
- The `react-query` to `@tanstack/react-query` alias is essential for compatibility
- Dev proxy covers many backend services - check `webpack.dev.js` for the full proxy list
- `window.Digit` must be initialized before any module code runs
