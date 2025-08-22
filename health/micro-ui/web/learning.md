/**
 * DIGIT UI Component Initialization Examples
 * 
 * This file demonstrates how to use the optimized component initialization
 * methods from the core module for different use cases.
 */

// ============================================================================
// EXAMPLE 1: Basic Implementation (Current example/src/index.js)
// ============================================================================

/**
 * Two-phase initialization for optimal performance:
 * Phase 1: Critical components (ChangeLanguage, PrivacyComponent)
 * Phase 2: All remaining components (lazy loaded)
 */

export const basicInitialization = async () => {
  try {
    // Phase 1: Initialize critical components immediately
    const coreModule = await import("@egovernments/digit-ui-module-core");
    if (coreModule.initCriticalComponents) {
      coreModule.initCriticalComponents();
      console.log("✅ Critical components ready for immediate use");
    }

    // Phase 2: Initialize remaining components when needed
    if (coreModule.initCoreComponents) {
      coreModule.initCoreComponents();
      console.log("✅ All core components registered");
    }
  } catch (error) {
    console.error("❌ Component initialization failed:", error);
  }
};

// ============================================================================
// EXAMPLE 2: Performance-Optimized Implementation
// ============================================================================

/**
 * For applications that need maximum performance:
 * - Critical components initialized synchronously
 * - Non-critical components loaded on-demand
 */

export const performanceOptimizedInit = async () => {
  // Initialize critical components first (faster startup)
  const { initCriticalComponents } = await import("@egovernments/digit-ui-module-core");
  initCriticalComponents();

  // Delay non-critical component registration until actually needed
  setTimeout(async () => {
    const { initCoreComponents } = await import("@egovernments/digit-ui-module-core");
    initCoreComponents();
  }, 100);
};

// ============================================================================
// EXAMPLE 3: Progressive Enhancement Implementation
// ============================================================================

/**
 * For applications that want to show UI as soon as possible:
 * - Show basic UI with critical components
 * - Enhance functionality as more components load
 */

export const progressiveEnhancementInit = () => {
  const [coreComponentsReady, setCoreComponentsReady] = useState(false);
  const [allComponentsReady, setAllComponentsReady] = useState(false);

  useEffect(() => {
    // Phase 1: Critical components for basic functionality
    import("@egovernments/digit-ui-module-core")
      .then(({ initCriticalComponents }) => {
        initCriticalComponents();
        setCoreComponentsReady(true);
        console.log("🚀 Basic functionality ready");
      });
  }, []);

  useEffect(() => {
    if (coreComponentsReady) {
      // Phase 2: Full component set for complete functionality
      import("@egovernments/digit-ui-module-core")
        .then(({ initCoreComponents }) => {
          initCoreComponents();
          setAllComponentsReady(true);
          console.log("🎯 Full functionality ready");
        });
    }
  }, [coreComponentsReady]);

  return { coreComponentsReady, allComponentsReady };
};

// ============================================================================
// EXAMPLE 4: Error-Resilient Implementation
// ============================================================================

/**
 * For production applications that need robust error handling:
 * - Graceful fallbacks if component registration fails
 * - Retry mechanisms for critical components
 * - Monitoring and telemetry integration
 */

export const errorResilientInit = async (maxRetries = 3) => {
  const initWithRetry = async (initFn, componentType, retries = 0) => {
    try {
      await initFn();
      console.log(`✅ ${componentType} components initialized successfully`);
      
      // Optional: Send success telemetry
      window.Digit?.Telemetry?.success?.({
        event: 'component_init_success',
        componentType,
        attempt: retries + 1
      });
      
    } catch (error) {
      console.error(`❌ Failed to initialize ${componentType} components:`, error);
      
      // Optional: Send error telemetry
      window.Digit?.Telemetry?.error?.({
        event: 'component_init_error',
        componentType,
        error: error.message,
        attempt: retries + 1
      });

      if (retries < maxRetries) {
        console.log(`🔄 Retrying ${componentType} initialization (${retries + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retries + 1))); // Exponential backoff
        return initWithRetry(initFn, componentType, retries + 1);
      } else {
        console.warn(`⚠️ Max retries reached for ${componentType} components`);
        throw error;
      }
    }
  };

  try {
    // Initialize critical components with retry
    const coreModule = await import("@egovernments/digit-ui-module-core");
    await initWithRetry(coreModule.initCriticalComponents, "critical");
    await initWithRetry(coreModule.initCoreComponents, "core");
    
    return { success: true };
  } catch (error) {
    // Fallback: Continue with partial functionality
    console.warn("⚠️ Continuing with partial functionality");
    return { success: false, error };
  }
};

// ============================================================================
// EXAMPLE 5: Module-Specific Implementation
// ============================================================================

/**
 * For specific modules that only need certain components:
 * - Selective component registration
 * - Minimal bundle impact
 * - Module-specific optimization
 */

export const moduleSpecificInit = async (requiredComponents = []) => {
  const coreModule = await import("@egovernments/digit-ui-module-core");
  
  // Always initialize critical components
  coreModule.initCriticalComponents();
  
  // Conditionally initialize based on module requirements
  const componentMap = {
    'otp': () => {
      // Register OTP-related components only
      if (requiredComponents.includes('SelectOtp') || requiredComponents.includes('OtpComponent')) {
        coreModule.initCoreComponents();
      }
    },
    'city-selection': () => {
      // Register city selection components only
      if (requiredComponents.includes('ChangeCity')) {
        coreModule.initCoreComponents();
      }
    },
    'all': () => {
      // Register all components
      coreModule.initCoreComponents();
    }
  };

  // Execute required initializations
  requiredComponents.forEach(component => {
    const initFn = componentMap[component];
    if (initFn) {
      initFn();
    }
  });

  console.log(`✅ Module-specific initialization complete for: ${requiredComponents.join(', ')}`);
};

// ============================================================================
// EXAMPLE 6: React Hook Implementation
// ============================================================================

/**
 * Custom hook for component initialization in React applications
 */

export const useDigitComponentInit = (options = {}) => {
  const {
    enableCritical = true,
    enableCore = true,
    delay = 0,
    onSuccess,
    onError
  } = options;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initComponents = async () => {
      try {
        setLoading(true);
        
        if (delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        const coreModule = await import("@egovernments/digit-ui-module-core");

        if (enableCritical) {
          coreModule.initCriticalComponents();
        }

        if (enableCore) {
          coreModule.initCoreComponents();
        }

        setReady(true);
        setLoading(false);
        onSuccess?.();
        
      } catch (err) {
        setError(err);
        setLoading(false);
        onError?.(err);
      }
    };

    initComponents();
  }, [enableCritical, enableCore, delay, onSuccess, onError]);

  return { loading, error, ready };
};

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * Example usage in a React component:
 * 
 * const MyApp = () => {
 *   const { loading, error, ready } = useDigitComponentInit({
 *     enableCritical: true,
 *     enableCore: true,
 *     delay: 100,
 *     onSuccess: () => console.log('Components ready!'),
 *     onError: (err) => console.error('Init failed:', err)
 *   });
 * 
 *   if (loading) return <div>Loading components...</div>;
 *   if (error) return <div>Error loading components: {error.message}</div>;
 *   if (!ready) return <div>Preparing application...</div>;
 * 
 *   return <DigitUI {...props} />;
 * };
 */

/**
 * Example usage for performance-critical applications:
 * 
 * const App = () => {
 *   useEffect(() => {
 *     // Initialize only what's needed immediately
 *     performanceOptimizedInit();
 *   }, []);
 * 
 *   return <YourApp />;
 * };
 */

export default {
  basicInitialization,
  performanceOptimizedInit,
  progressiveEnhancementInit,
  errorResilientInit,
  moduleSpecificInit,
  useDigitComponentInit
};