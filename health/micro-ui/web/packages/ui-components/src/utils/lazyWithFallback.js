import React, { lazy, Suspense } from "react";
import { Loader } from "../atoms";

/**
 * Creates a component with lazy loading that gracefully falls back to synchronous import.
 * This allows the library to work in both environments:
 * - Development/Apps with webpack code splitting enabled
 * - Production library bundles without code splitting
 * 
 * @param {Function} lazyImportFn - Function that returns a dynamic import promise
 * @param {Function} fallbackRequireFn - Function that returns a synchronous require
 * @param {Object} options - Optional configuration
 * @returns {React.Component} - Either a lazy-loaded component with Suspense or a regular component
 */
export const lazyWithFallback = (lazyImportFn, fallbackRequireFn, options = {}) => {
  const { 
    loaderText = "Loading...",
    loaderVariant = "PageLoader",
    showPage = true 
  } = options;

  let Component;
  
  try {
    // Try to create a lazy component
    Component = lazy(lazyImportFn);
  } catch (error) {
    // If lazy loading fails (e.g., in a bundled library), use fallback
    console.warn('Lazy loading not available, using synchronous import:', error.message);
    try {
      Component = fallbackRequireFn();
    } catch (requireError) {
      console.error('Both lazy and fallback loading failed:', requireError);
      return () => <div>Error loading component</div>;
    }
  }

  // If Component has the lazy signature, wrap it with Suspense
  if (Component && (Component._result || Component.$$typeof === Symbol.for('react.lazy'))) {
    return (props) => (
      <Suspense fallback={<Loader page={showPage} variant={loaderVariant} loaderText={loaderText} />}>
        <Component {...props} />
      </Suspense>
    );
  }

  // Otherwise, return the component directly
  return Component || (() => <div>Component not found</div>);
};

/**
 * Helper function to wrap a component with Suspense only if it's lazy
 * Use this when you already have a component that might or might not be lazy
 */
export const withConditionalSuspense = (Component, loaderText = "Loading...") => {
  return (props) => {
    // Check if it's a lazy component
    if (Component && (Component._result || Component.$$typeof === Symbol.for('react.lazy'))) {
      return (
        <Suspense fallback={<Loader page={true} variant="PageLoader" loaderText={loaderText} />}>
          <Component {...props} />
        </Suspense>
      );
    }
    // Regular component, render directly
    return Component ? <Component {...props} /> : null;
  };
};