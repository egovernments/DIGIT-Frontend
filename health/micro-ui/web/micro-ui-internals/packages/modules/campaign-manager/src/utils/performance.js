/**
 * Performance monitoring utilities for campaign module
 * Tracks component loading times, bundle sizes, and optimization metrics
 */

class PerformanceMonitor {
  static timers = new Map();
  static metrics = new Map();
  static componentLoadTimes = new Map();
  static bundleMetrics = {
    criticalComponents: 0,
    lazyComponents: 0,
    totalComponents: 0,
  };

  /**
   * Start timing a performance metric
   */
  static startTimer(label) {
    this.timers.set(label, performance.now());
    console.time(label);
  }

  /**
   * End timing and record the metric
   */
  static endTimer(label) {
    const startTime = this.timers.get(label);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.metrics.set(label, duration);
      this.timers.delete(label);
      console.timeEnd(label);
      return duration;
    }
    return 0;
  }

  /**
   * Record component load time
   */
  static recordComponentLoad(componentName, loadTime) {
    this.componentLoadTimes.set(componentName, {
      loadTime,
      timestamp: Date.now(),
    });
    console.log(`📊 ${componentName} loaded in ${loadTime.toFixed(2)}ms`);
  }

  /**
   * Track bundle metrics
   */
  static updateBundleMetrics(type, count = 1) {
    this.bundleMetrics[type] += count;
    this.bundleMetrics.totalComponents = 
      this.bundleMetrics.criticalComponents + this.bundleMetrics.lazyComponents;
  }

  /**
   * Get performance summary
   */
  static getSummary() {
    const componentLoadTimes = Array.from(this.componentLoadTimes.entries()).map(
      ([name, data]) => ({
        name,
        loadTime: data.loadTime,
        timestamp: data.timestamp,
      })
    );

    const metrics = Object.fromEntries(this.metrics);
    
    return {
      componentLoadTimes,
      metrics,
      bundleMetrics: { ...this.bundleMetrics },
      totalMetrics: this.metrics.size,
      averageLoadTime: componentLoadTimes.length > 0 
        ? componentLoadTimes.reduce((sum, comp) => sum + comp.loadTime, 0) / componentLoadTimes.length 
        : 0,
    };
  }

  /**
   * Export performance data for analysis
   */
  static exportData() {
    const summary = this.getSummary();
    const exportData = {
      ...summary,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
      } : null,
    };

    // Log to console for development
    console.group("📈 Campaign Module Performance Report");
    console.log("Bundle Metrics:", exportData.bundleMetrics);
    console.log("Average Component Load Time:", `${exportData.averageLoadTime.toFixed(2)}ms`);
    console.log("Component Load Times:", exportData.componentLoadTimes);
    console.log("General Metrics:", exportData.metrics);
    console.groupEnd();

    return exportData;
  }

  /**
   * Monitor Web Vitals if available
   */
  static monitorWebVitals() {
    if ('web-vitals' in window) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS((metric) => this.metrics.set('CLS', metric.value));
        getFID((metric) => this.metrics.set('FID', metric.value));
        getFCP((metric) => this.metrics.set('FCP', metric.value));
        getLCP((metric) => this.metrics.set('LCP', metric.value));
        getTTFB((metric) => this.metrics.set('TTFB', metric.value));
      });
    }
  }

  /**
   * Track memory usage
   */
  static trackMemoryUsage() {
    if ('memory' in performance) {
      const memory = performance.memory;
      this.metrics.set('usedJSHeapSize', memory.usedJSHeapSize);
      this.metrics.set('totalJSHeapSize', memory.totalJSHeapSize);
      this.metrics.set('jsHeapSizeLimit', memory.jsHeapSizeLimit);
    }
  }

  /**
   * Start bundle size tracking
   */
  static startBundleTracking() {
    this.startTimer('bundleLoad');
    this.monitorWebVitals();
  }

  /**
   * End bundle size tracking
   */
  static endBundleTracking() {
    this.endTimer('bundleLoad');
    this.trackMemoryUsage();
  }
}

/**
 * Higher Order Component for performance tracking
 */
export const withPerformanceTracking = (Component, componentName) => {
  return React.forwardRef((props, ref) => {
    React.useEffect(() => {
      const startTime = performance.now();
      PerformanceMonitor.startTimer(`${componentName}_render`);

      return () => {
        const loadTime = performance.now() - startTime;
        PerformanceMonitor.recordComponentLoad(componentName, loadTime);
        PerformanceMonitor.endTimer(`${componentName}_render`);
      };
    }, []);

    return <Component {...props} ref={ref} />;
  });
};

/**
 * React hook for performance monitoring
 */
export const usePerformanceMonitoring = (componentName) => {
  React.useEffect(() => {
    PerformanceMonitor.startTimer(`${componentName}_mount`);
    
    return () => {
      PerformanceMonitor.endTimer(`${componentName}_mount`);
    };
  }, [componentName]);

  const recordMetric = (name, value) => {
    PerformanceMonitor.metrics.set(`${componentName}_${name}`, value);
  };

  const trackUserInteraction = (action) => {
    const timestamp = performance.now();
    PerformanceMonitor.metrics.set(`${componentName}_${action}`, timestamp);
  };

  return {
    recordMetric,
    trackUserInteraction,
    getSummary: () => PerformanceMonitor.getSummary(),
  };
};

/**
 * Bundle analyzer utility
 */
export const BundleAnalyzer = {
  /**
   * Estimate bundle impact of components
   */
  estimateComponentSize: (componentName) => {
    const sizeEstimates = {
      // Heavy Excel components
      UploadData: 150, // KB
      UploadDataMappingWrapper: 200,
      DataUploadWrapper: 180,
      XlsPreview: 120,
      BulkUpload: 100,
      
      // Large page components
      MyCampaign: 80,
      MyCampaignNew: 85,
      ConfigureApp: 120,
      CreateChecklist: 90,
      SearchChecklist: 70,
      
      // App configuration
      AppConfigurationTabLayer: 150,
      AppPreview: 60,
      
      // Default estimate
      default: 30,
    };
    
    return sizeEstimates[componentName] || sizeEstimates.default;
  },

  /**
   * Calculate total bundle savings from lazy loading
   */
  calculateSavings: (lazyComponents) => {
    const totalSavings = lazyComponents.reduce((total, componentName) => {
      return total + this.estimateComponentSize(componentName);
    }, 0);
    
    return {
      totalSavings: `${totalSavings}KB`,
      percentageSaving: `${((totalSavings / 2500) * 100).toFixed(1)}%`, // Assuming 2.5MB base bundle
    };
  },

  /**
   * Generate optimization recommendations
   */
  getRecommendations: () => {
    const summary = PerformanceMonitor.getSummary();
    const recommendations = [];

    if (summary.averageLoadTime > 100) {
      recommendations.push({
        type: 'warning',
        message: 'Average component load time is high. Consider further optimization.',
        action: 'Review heavy components and implement additional splitting.'
      });
    }

    if (summary.bundleMetrics.lazyComponents < 20) {
      recommendations.push({
        type: 'info',
        message: 'More components can be lazy loaded.',
        action: 'Identify additional candidates for lazy loading.'
      });
    }

    const slowComponents = summary.componentLoadTimes
      .filter(comp => comp.loadTime > 200)
      .map(comp => comp.name);

    if (slowComponents.length > 0) {
      recommendations.push({
        type: 'warning',
        message: `Slow loading components detected: ${slowComponents.join(', ')}`,
        action: 'Investigate and optimize these components.'
      });
    }

    return recommendations;
  }
};

/**
 * Performance dashboard data
 */
export const getPerformanceDashboard = () => {
  const summary = PerformanceMonitor.getSummary();
  const recommendations = BundleAnalyzer.getRecommendations();
  
  return {
    ...summary,
    recommendations,
    optimization: {
      criticalComponents: summary.bundleMetrics.criticalComponents,
      lazyComponents: summary.bundleMetrics.lazyComponents,
      optimizationRatio: (
        (summary.bundleMetrics.lazyComponents / summary.bundleMetrics.totalComponents) * 100
      ).toFixed(1),
    },
    status: summary.averageLoadTime < 100 ? 'good' : 
            summary.averageLoadTime < 200 ? 'warning' : 'critical',
  };
};

// Initialize performance monitoring
PerformanceMonitor.startBundleTracking();

export default PerformanceMonitor;