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

This utility ensures your library works in both:
- Applications with full webpack configuration and code splitting
- Bundled library distributions without code splitting
- Development environments with hot module replacement