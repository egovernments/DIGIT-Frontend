import React, { lazy, Suspense } from 'react';

/**
 * Enhanced lazy component loader with error boundary and loading states
 * Designed for UI component packages where lazy loading makes sense
 */

// Default loading component
const DefaultLoader = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '100px' 
  }}>
    <div>Loading...</div>
  </div>
);

// Default error component
const DefaultError = ({ error, retry }) => (
  <div style={{ 
    padding: '20px', 
    textAlign: 'center', 
    color: '#721c24',
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    borderRadius: '4px'
  }}>
    <p>Failed to load component</p>
    {error && <p style={{ fontSize: '12px' }}>{error.message}</p>}
    {retry && (
      <button 
        onClick={retry}
        style={{
          marginTop: '10px',
          padding: '5px 15px',
          backgroundColor: '#fff',
          border: '1px solid #721c24',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Retry
      </button>
    )}
  </div>
);

// Error Boundary Component
class LazyErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('⚠️ Lazy component loading failed:', error.message || error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const ErrorComponent = this.props.errorComponent || DefaultError;
      return <ErrorComponent error={this.state.error} retry={this.retry} />;
    }

    return this.props.children;
  }
}

/**
 * Create a lazy-loaded component with error handling and loading states
 * @param {Function} importFn - Dynamic import function
 * @param {Object} options - Configuration options
 * @returns {React.Component} Wrapped lazy component
 */
export const createLazyComponent = (importFn, options = {}) => {
  const {
    fallback = <DefaultLoader />,
    errorComponent = DefaultError,
    retry = true,
    preload = false
  } = options;

  const LazyComponent = lazy(importFn);

  // Preload the component if requested
  if (preload) {
    importFn();
  }

  // Return wrapped component
  return (props) => (
    <LazyErrorBoundary errorComponent={errorComponent}>
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    </LazyErrorBoundary>
  );
};

/**
 * Utility to preload multiple lazy components
 * @param {Array} components - Array of import functions
 */
export const preloadComponents = (components) => {
  components.forEach(importFn => {
    if (typeof importFn === 'function') {
      importFn();
    }
  });
};

/**
 * HOC to add lazy loading to any component
 * @param {React.Component} Component - Component to wrap
 * @param {Object} options - Lazy loading options
 * @returns {React.Component} Lazy loaded component
 */
export const withLazyLoad = (Component, options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    fallback = <DefaultLoader />
  } = options;

  return class LazyLoadWrapper extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isVisible: false
      };
      this.elementRef = React.createRef();
    }

    componentDidMount() {
      this.setupIntersectionObserver();
    }

    componentWillUnmount() {
      if (this.observer) {
        this.observer.disconnect();
      }
    }

    setupIntersectionObserver = () => {
      if (!window.IntersectionObserver) {
        // Fallback for browsers without IntersectionObserver
        this.setState({ isVisible: true });
        return;
      }

      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.setState({ isVisible: true });
              this.observer.disconnect();
            }
          });
        },
        {
          threshold,
          rootMargin
        }
      );

      if (this.elementRef.current) {
        this.observer.observe(this.elementRef.current);
      }
    };

    render() {
      const { isVisible } = this.state;

      return (
        <div ref={this.elementRef}>
          {isVisible ? <Component {...this.props} /> : fallback}
        </div>
      );
    }
  };
};

/**
 * Hook for lazy loading with intersection observer
 * @param {Object} options - Intersection observer options
 * @returns {Array} [ref, isVisible]
 */
export const useLazyLoad = (options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true
  } = options;

  const [isVisible, setIsVisible] = React.useState(false);
  const elementRef = React.useRef(null);

  React.useEffect(() => {
    if (!window.IntersectionObserver) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (triggerOnce) {
              observer.disconnect();
            }
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [elementRef, isVisible];
};

// Export lazy loaded versions of heavy UI components
export const LazyDataTable = createLazyComponent(
  () => import(/* webpackChunkName: "data-table" */ 'react-data-table-component'),
  { fallback: <DefaultLoader /> }
);

export const LazyWebcam = createLazyComponent(
  () => import(/* webpackChunkName: "webcam" */ 'react-webcam'),
  { fallback: <DefaultLoader /> }
);

export default {
  createLazyComponent,
  preloadComponents,
  withLazyLoad,
  useLazyLoad,
  LazyErrorBoundary,
  LazyDataTable,
  LazyWebcam
};