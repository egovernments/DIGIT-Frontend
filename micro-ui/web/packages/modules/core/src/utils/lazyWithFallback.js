import React, { lazy, Suspense } from "react";
import { Loader } from "@egovernments/digit-ui-components";

/**
 * Creates a component that attempts lazy loading but falls back to direct import if it fails.
 * This allows the library to work both when chunks are available (dev/apps with code splitting)
 * and when bundled as a single file (library distribution).
 */
export const lazyWithFallback = (lazyImport, directImport) => {
  // Check if we're in an environment that supports dynamic imports
  const supportsLazyLoading = typeof window !== 'undefined' && 
    window.__webpack_require__ && 
    typeof window.__webpack_require__.e === 'function';

  if (!supportsLazyLoading || !lazyImport) {
    // Return the direct import if lazy loading is not supported
    return directImport;
  }

  // Create lazy component
  const LazyComponent = lazy(lazyImport);

  // Return a wrapper component that handles loading and errors
  return (props) => (
    <Suspense fallback={<Loader page={true} variant="PageLoader" />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

/**
 * Alternative approach: Always try lazy loading, but provide fallback
 */
export const safeLazy = (importFn) => {
  return lazy(() => 
    importFn().catch((error) => {
      console.warn('Failed to lazy load component:', error);
      // Return a default export that renders nothing or a placeholder
      return { default: () => <div>Component failed to load</div> };
    })
  );
};