# Lazy Loading Utilities

This directory contains utilities for implementing lazy loading in a library that needs to work in multiple environments.

## lazyWithFallback

The `lazyWithFallback` utility allows you to implement lazy loading that gracefully falls back to synchronous imports when code splitting is not available.

### Usage

```javascript
import { lazyWithFallback } from './utils/lazyWithFallback';

// Create a lazy component with fallback
const MyComponent = lazyWithFallback(
  // Lazy import function (for environments with code splitting)
  () => import(/* webpackChunkName: "my-component" */ './MyComponent'),
  
  // Fallback require function (for bundled library environments)
  () => require('./MyComponent').default,
  
  // Optional configuration
  {
    loaderText: "Loading My Component...",
    loaderVariant: "PageLoader",
    showPage: true
  }
);

// Use the component normally
<MyComponent prop1="value1" prop2="value2" />
```

### Parameters

- `lazyImportFn`: Function that returns a dynamic import promise
- `fallbackRequireFn`: Function that returns a synchronous require
- `options`: Optional configuration object
  - `loaderText`: Text to display while loading (default: "Loading...")
  - `loaderVariant`: Loader variant to use (default: "PageLoader")
  - `showPage`: Whether to show page-level loader (default: true)

### How it works

1. **In development/apps with webpack code splitting**: Uses React.lazy() with dynamic imports, automatically wraps with Suspense
2. **In bundled library environments**: Falls back to synchronous require, no Suspense wrapper needed
3. **Error handling**: If both lazy and fallback fail, returns an error component

## withConditionalSuspense

Helper function to wrap an existing component with Suspense only if it's a lazy component.

### Usage

```javascript
import { withConditionalSuspense } from './utils/lazyWithFallback';

const WrappedComponent = withConditionalSuspense(SomeComponent, "Loading...");
```

## Implementation Coverage

This utility has been implemented throughout the core module:

### Employee App Routes
- `/src/pages/employee/index.js` - All employee route components:
  - ChangePassword
  - ForgotPassword
  - LanguageSelection
  - EmployeeLogin
  - Otp
  - UserProfile
  - ErrorComponent

### Citizen App Routes
- `/src/pages/citizen/index.js` - All citizen route components:
  - CitizenHome
  - LanguageSelection
  - LocationSelection
  - UserProfile
  - Login
  - Search
  - ErrorComponent
  - FAQsSection
  - HowItWorks
  - StaticDynamicCard

### Main App Routes
- `/src/App.js` - Top-level app components:
  - CitizenApp
  - EmployeeApp
  - SignUp
  - Otp
  - ViewUrl
  - CustomErrorComponent
  - DummyLoaderScreen

### App Modules
- `/src/components/AppModules.js` - Module-level components:
  - ChangePassword
  - ForgotPassword
  - AppHome

## Webpack Configuration

The webpack configuration has been updated to support code splitting in library mode:

```javascript
// webpack.config.js
output: {
  filename: "[name].js",
  chunkFilename: "[name].[contenthash:8].chunk.js",
  publicPath: "auto"
},
optimization: {
  splitChunks: {
    chunks: "async", // Only split async chunks
    cacheGroups: {
      async: {
        chunks: "async",
        minSize: 20000,
        minChunks: 1,
        priority: 10
      }
    }
  }
}
```

## Benefits

This utility ensures your library works in both:
- Applications with full webpack configuration and code splitting
- Bundled library distributions without code splitting
- Development environments with hot module replacement
- Provides consistent loading states across all components
- Improves performance through code splitting when available
- Graceful error handling and fallback mechanisms

## Chunk Naming Convention

All components use descriptive webpack chunk names:
- Employee components: `employee-*` (e.g., `employee-login`, `employee-otp`)
- Citizen components: `citizen-*` (e.g., `citizen-home`, `citizen-login`)
- App-level components: `*-app` (e.g., `citizen-app`, `employee-app`)
- Shared components: `*-component` (e.g., `error-component`, `custom-error`)