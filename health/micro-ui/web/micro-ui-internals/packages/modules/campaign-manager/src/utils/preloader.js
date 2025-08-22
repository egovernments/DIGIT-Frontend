/**
 * Preloader utilities for campaign components
 * Provides smart preloading based on user interactions and route predictions
 */

// Preload functions for heavy components
export const preloadComponents = {
  // Excel processing components
  preloadUploadData: () => import("../components/UploadData"),
  preloadUploadDataMapping: () => import("../components/UploadDataMappingWrapper"),
  preloadDataUploadWrapper: () => import("../components/DataUploadWrapper"),
  preloadXlsPreview: () => import("../components/XlsPreview"),
  preloadBulkUpload: () => import("../components/BulkUpload"),
  
  // Large page components
  preloadMyCampaign: () => import("../pages/employee/MyCampaign"),
  preloadMyCampaignNew: () => import("../pages/employee/MyCampaignNew"),
  preloadConfigureApp: () => import("../pages/employee/ConfigureApp"),
  preloadCreateChecklist: () => import("../pages/employee/CreateChecklist"),
  preloadSearchChecklist: () => import("../pages/employee/SearchChecklist"),
  preloadUpdateBoundary: () => import("../pages/employee/UpdateCampaign"),
  preloadViewBoundary: () => import("../pages/employee/ViewBoundary"),
  preloadViewHierarchy: () => import("../pages/employee/ViewHierarchy"),
  preloadGeoPode: () => import("../pages/employee/BoundaryRelationCreate"),
  
  // App configuration components
  preloadAppConfiguration: () => import("../pages/employee/appConfigurationRedesign/AppConfigurationTabLayer"),
  preloadAppPreview: () => import("../components/AppPreview"),
  
  // Form processing components
  preloadDeliverySetup: () => import("../pages/employee/deliveryRule"),
  preloadCycleConfiguration: () => import("../pages/employee/CycleConfiguration"),
  preloadAddProduct: () => import("../pages/employee/AddProduct"),
};

/**
 * Smart preloader that preloads components based on user navigation patterns
 */
export class SmartPreloader {
  static preloadedComponents = new Set();
  static preloadQueue = [];
  static isPreloading = false;
  
  /**
   * Preload a component if not already preloaded
   */
  static async preload(componentName) {
    if (this.preloadedComponents.has(componentName)) {
      return Promise.resolve();
    }
    
    const preloadFn = preloadComponents[`preload${componentName}`];
    if (!preloadFn) {
      console.warn(`No preload function found for ${componentName}`);
      return Promise.resolve();
    }
    
    try {
      await preloadFn();
      this.preloadedComponents.add(componentName);
      console.log(`✅ Preloaded ${componentName}`);
    } catch (error) {
      console.error(`❌ Failed to preload ${componentName}:`, error);
    }
  }
  
  /**
   * Preload multiple components in sequence
   */
  static async preloadBatch(componentNames) {
    if (this.isPreloading) return;
    
    this.isPreloading = true;
    console.log(`🔄 Starting batch preload of ${componentNames.length} components...`);
    
    for (const componentName of componentNames) {
      await this.preload(componentName);
      // Small delay to prevent blocking
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    this.isPreloading = false;
    console.log(`✅ Batch preload complete`);
  }
  
  /**
   * Preload components on idle
   */
  static preloadOnIdle(componentNames) {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        this.preloadBatch(componentNames);
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        this.preloadBatch(componentNames);
      }, 2000);
    }
  }
  
  /**
   * Preload components based on route prediction
   */
  static preloadByRoute(currentRoute) {
    const routePreloadMap = {
      '/campaign/setup': ['UploadData', 'UploadDataMapping', 'XlsPreview'],
      '/campaign/my-campaign': ['MyCampaign', 'MyCampaignNew'],
      '/campaign/configure': ['ConfigureApp', 'AppConfiguration', 'AppPreview'],
      '/campaign/checklist': ['CreateChecklist', 'SearchChecklist'],
      '/campaign/boundary': ['ViewBoundary', 'ViewHierarchy', 'GeoPode', 'UpdateBoundary'],
      '/campaign/upload': ['UploadData', 'DataUploadWrapper', 'BulkUpload'],
    };
    
    const componentsToPreload = routePreloadMap[currentRoute];
    if (componentsToPreload) {
      this.preloadOnIdle(componentsToPreload);
    }
  }
  
  /**
   * Get preload status
   */
  static getPreloadStatus() {
    return {
      preloadedCount: this.preloadedComponents.size,
      preloadedComponents: Array.from(this.preloadedComponents),
      isPreloading: this.isPreloading,
    };
  }
}

/**
 * Hook to use smart preloading in components
 */
export const useSmartPreloader = () => {
  const preload = (componentName) => SmartPreloader.preload(componentName);
  const preloadBatch = (componentNames) => SmartPreloader.preloadBatch(componentNames);
  const preloadOnIdle = (componentNames) => SmartPreloader.preloadOnIdle(componentNames);
  const preloadByRoute = (route) => SmartPreloader.preloadByRoute(route);
  const getStatus = () => SmartPreloader.getPreloadStatus();
  
  return {
    preload,
    preloadBatch,
    preloadOnIdle,
    preloadByRoute,
    getStatus,
  };
};

/**
 * Preload components based on user interaction patterns
 */
export const InteractionPreloader = {
  /**
   * Preload on hover with debounce
   */
  onHover: (componentName, delay = 100) => {
    let timeoutId;
    return {
      onMouseEnter: () => {
        timeoutId = setTimeout(() => {
          SmartPreloader.preload(componentName);
        }, delay);
      },
      onMouseLeave: () => {
        clearTimeout(timeoutId);
      },
    };
  },
  
  /**
   * Preload on focus
   */
  onFocus: (componentName) => ({
    onFocus: () => SmartPreloader.preload(componentName),
  }),
  
  /**
   * Preload on visibility (Intersection Observer)
   */
  onVisible: (componentName, threshold = 0.1) => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return {};
    }
    
    let observer;
    return {
      ref: (element) => {
        if (element && !observer) {
          observer = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                SmartPreloader.preload(componentName);
                observer.disconnect();
              }
            },
            { threshold }
          );
          observer.observe(element);
        }
      },
    };
  },
};

export default SmartPreloader;