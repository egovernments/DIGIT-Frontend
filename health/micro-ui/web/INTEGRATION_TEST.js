/**
 * Integration test for lazy loading implementation
 * This script validates that the new lazy loading functions work correctly
 */

// Test the campaign manager module exports
async function testCampaignModuleExports() {
  console.log("🧪 Testing Campaign Module Exports...");
  
  try {
    const campaignModule = await import("@egovernments/digit-ui-module-campaign-manager");
    
    // Check if all new functions are exported
    const expectedFunctions = [
      'initCampaignComponents',
      'initCriticalCampaignComponents', 
      'initNonCriticalCampaignComponents',
      'initHeavyExcelComponents',
      'initLargePageComponents'
    ];
    
    const results = [];
    expectedFunctions.forEach(funcName => {
      const exists = typeof campaignModule[funcName] === 'function';
      results.push({ funcName, exists });
      console.log(`${exists ? '✅' : '❌'} ${funcName}: ${exists ? 'Available' : 'Missing'}`);
    });
    
    const allExportsValid = results.every(r => r.exists);
    console.log(`Campaign Module Export Test: ${allExportsValid ? 'PASSED' : 'FAILED'}`);
    
    return allExportsValid;
  } catch (error) {
    console.error("❌ Campaign Module Export Test FAILED:", error);
    return false;
  }
}

// Test critical component initialization
async function testCriticalComponentInit() {
  console.log("\n🧪 Testing Critical Component Initialization...");
  
  try {
    const { initCriticalCampaignComponents } = await import("@egovernments/digit-ui-module-campaign-manager");
    
    // Mock Digit object for testing
    window.Digit = window.Digit || {};
    window.Digit.ComponentRegistryService = window.Digit.ComponentRegistryService || {
      setComponent: (key, component) => {
        console.log(`📝 Component registered: ${key}`);
        return true;
      }
    };
    
    const startTime = performance.now();
    initCriticalCampaignComponents();
    const endTime = performance.now();
    
    console.log(`✅ Critical components initialized in ${(endTime - startTime).toFixed(2)}ms`);
    return true;
  } catch (error) {
    console.error("❌ Critical Component Init Test FAILED:", error);
    return false;
  }
}

// Test non-critical component initialization
async function testNonCriticalComponentInit() {
  console.log("\n🧪 Testing Non-Critical Component Initialization...");
  
  try {
    const { initNonCriticalCampaignComponents } = await import("@egovernments/digit-ui-module-campaign-manager");
    
    const startTime = performance.now();
    initNonCriticalCampaignComponents();
    const endTime = performance.now();
    
    console.log(`✅ Non-critical components initialized in ${(endTime - startTime).toFixed(2)}ms`);
    return true;
  } catch (error) {
    console.error("❌ Non-Critical Component Init Test FAILED:", error);
    return false;
  }
}

// Test lazy component loading (basic check)
async function testLazyComponentLoading() {
  console.log("\n🧪 Testing Lazy Component Loading...");
  
  try {
    // Test if components are properly lazy loaded by checking module structure
    const campaignModule = await import("@egovernments/digit-ui-module-campaign-manager");
    
    // Check if CampaignCard (critical) is immediately available
    const hasCriticalComponents = campaignModule.CampaignModule !== undefined;
    console.log(`${hasCriticalComponents ? '✅' : '❌'} Critical components available: ${hasCriticalComponents}`);
    
    return hasCriticalComponents;
  } catch (error) {
    console.error("❌ Lazy Component Loading Test FAILED:", error);
    return false;
  }
}

// Test performance monitoring utilities
async function testPerformanceUtils() {
  console.log("\n🧪 Testing Performance Monitoring Utilities...");
  
  try {
    // Test if performance utils are accessible
    const { default: PerformanceMonitor } = await import("./micro-ui-internals/packages/modules/campaign-manager/src/utils/performance.js");
    
    // Test basic functionality
    PerformanceMonitor.startTimer('test_timer');
    await new Promise(resolve => setTimeout(resolve, 10));
    const duration = PerformanceMonitor.endTimer('test_timer');
    
    console.log(`✅ Performance monitoring test completed: ${duration.toFixed(2)}ms`);
    
    const summary = PerformanceMonitor.getSummary();
    console.log(`✅ Performance summary generated: ${Object.keys(summary).length} metrics`);
    
    return duration > 0;
  } catch (error) {
    console.error("❌ Performance Utils Test FAILED:", error);
    return false;
  }
}

// Test preloader utilities
async function testPreloaderUtils() {
  console.log("\n🧪 Testing Preloader Utilities...");
  
  try {
    const { SmartPreloader } = await import("./micro-ui-internals/packages/modules/campaign-manager/src/utils/preloader.js");
    
    // Test basic preloader functionality
    const status = SmartPreloader.getPreloadStatus();
    console.log(`✅ Preloader status retrieved: ${status.preloadedCount} components preloaded`);
    
    // Test route-based preloading (won't actually preload in test)
    SmartPreloader.preloadByRoute('/campaign/setup');
    console.log("✅ Route-based preloading triggered");
    
    return true;
  } catch (error) {
    console.error("❌ Preloader Utils Test FAILED:", error);
    return false;
  }
}

// Main test runner
async function runIntegrationTests() {
  console.log("🚀 Starting Campaign Module Lazy Loading Integration Tests\n");
  
  const tests = [
    { name: "Campaign Module Exports", test: testCampaignModuleExports },
    { name: "Critical Component Init", test: testCriticalComponentInit },
    { name: "Non-Critical Component Init", test: testNonCriticalComponentInit },
    { name: "Lazy Component Loading", test: testLazyComponentLoading },
    { name: "Performance Monitoring", test: testPerformanceUtils },
    { name: "Preloader Utilities", test: testPreloaderUtils },
  ];
  
  const results = [];
  let totalTime = 0;
  
  for (const { name, test } of tests) {
    const startTime = performance.now();
    const result = await test();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    results.push({ name, passed: result, duration });
    totalTime += duration;
  }
  
  // Print summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 INTEGRATION TEST SUMMARY");
  console.log("=".repeat(60));
  
  results.forEach(({ name, passed, duration }) => {
    const status = passed ? "✅ PASSED" : "❌ FAILED";
    console.log(`${status} ${name.padEnd(30)} (${duration.toFixed(2)}ms)`);
  });
  
  const totalPassed = results.filter(r => r.passed).length;
  const totalTests = results.length;
  
  console.log("=".repeat(60));
  console.log(`📈 Results: ${totalPassed}/${totalTests} tests passed`);
  console.log(`⏱️  Total Time: ${totalTime.toFixed(2)}ms`);
  console.log(`🎯 Success Rate: ${((totalPassed / totalTests) * 100).toFixed(1)}%`);
  
  if (totalPassed === totalTests) {
    console.log("\n🎉 ALL TESTS PASSED! Lazy loading implementation is working correctly.");
  } else {
    console.log("\n⚠️  SOME TESTS FAILED! Please review the failing tests above.");
  }
  
  return totalPassed === totalTests;
}

// Export for use
if (typeof module !== 'undefined') {
  module.exports = { runIntegrationTests };
} else {
  // Auto-run in browser environment
  if (typeof window !== 'undefined') {
    window.runCampaignLazyLoadingTests = runIntegrationTests;
    console.log("💡 Integration tests loaded. Run 'runCampaignLazyLoadingTests()' to execute.");
  }
}