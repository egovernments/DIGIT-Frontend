# DIGIT UI MDMS Hook System

This document explains the comprehensive MDMS (Master Data Management Service) hook system similar to the localization hooks.

## Overview

The MDMS system provides:
- **Core initialization**: `useInitMDMS` for app startup master data loading
- **Module-specific loading**: `useModuleMDMS` for individual module master data
- **Custom queries**: `useCustomMDMS` for fallback and specific master data fetching
- **Centralized repository**: All master data managed by enhanced `MDMSService`
- **TanStack Query integration**: Automatic caching, error handling, and background updates

## Architecture

```
┌─────────────────────────┐
│    Core App (DigitUI)   │
│                         │
│     useInitMDMS         │ ← Loads essential masters
│  - common-masters       │
│  - tenant               │
│  - ACCESSCONTROL-ROLES  │
│  - workflow             │
│  - BillingService       │
│  - egov-location        │
└─────────┬───────────────┘
          │
          ▼
┌─────────────────────────┐
│   Enhanced MDMSService  │  ← Centralized repository
│                         │
│  - Master data cache    │
│  - Module tracking      │
│  - TanStack Query       │
│  - Legacy compatibility │
└─────────┬───────────────┘
          │
          ▼
┌─────────────────────────┐
│   Module Components     │
│                         │
│     useModuleMDMS       │ ← Loads module-specific masters
│  - workbench-masters    │
│  - property-tax         │
│  - trade-license        │
│  - etc.                 │
└─────────────────────────┘
```

## Usage

### 1. Core App Initialization

In your main app component (typically `App.js` or `DigitUI`):

```javascript
import React from 'react';
import { useInitMDMS } from '@egovernments/digit-ui-libraries-new';

const DigitUI = ({ stateCode, enabledModules }) => {
  const {
    isLoading: mdmsLoading,
    isReady: mdmsReady,
    coreData,
    tenantInfo,
    loadedModules,
    error: mdmsError,
    getMasterData,
    getTenantInfo
  } = useInitMDMS({
    stateCode,
    coreModules: [
      'common-masters',
      'tenant',
      'ACCESSCONTROL-ROLES',
      'ACCESSCONTROL-ACTIONS-TEST',
      'workflow',
      'BillingService',
      'egov-location'
    ],
    enabled: true,
    background: false
  });

  // Expose globally for legacy compatibility
  React.useEffect(() => {
    if (mdmsReady && !window.Digit?.MDMSService) {
      window.Digit = window.Digit || {};
      window.Digit.MDMSService = {
        getCoreData: () => coreData,
        getTenantInfo: () => tenantInfo,
        getMasterData,
        getLoadedModules: () => loadedModules
      };
    }
  }, [mdmsReady, coreData, tenantInfo, getMasterData, loadedModules]);

  if (mdmsLoading) {
    return <div>Loading master data...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
};
```

### 2. Module-Specific MDMS Loading

In individual module components:

```javascript
import React from 'react';
import { useModuleMDMS } from '@egovernments/digit-ui-libraries-new';

const WorkbenchComponent = () => {
  // Load workbench-specific master data
  const {
    isLoading: mdmsLoading,
    isLoaded: mdmsLoaded,
    data: mdmsData,
    error: mdmsError,
    getMasterData,
    getModuleMasters
  } = useModuleMDMS({
    moduleName: 'workbench',
    modules: [
      'common-masters',
      'tenant',
      'ACCESSCONTROL-ROLES',
      'workflow',
      'BillingService'
    ]
  });

  // Log MDMS status
  React.useEffect(() => {
    if (mdmsLoaded) {
      console.log('✅ Workbench MDMS loaded successfully');
      console.log('📊 Available MDMS data:', Object.keys(mdmsData || {}));
      
      // Example: Get specific master data
      const departments = getMasterData('common-masters', 'Department');
      console.log('Departments:', departments);
    }
    if (mdmsError) {
      console.warn('⚠️ Failed to load workbench MDMS:', mdmsError);
    }
  }, [mdmsLoaded, mdmsError, mdmsData, getMasterData]);

  return (
    <div>
      {mdmsLoading && <div>Loading workbench master data...</div>}
      <h1>Workbench Module</h1>
      {/* Your component content */}
    </div>
  );
};
```

### 3. Custom MDMS Queries

For specific or fallback master data requirements:

```javascript
import React from 'react';
import { useCustomMDMS, useCustomMasterData, useMultipleMasters } from '@egovernments/digit-ui-libraries-new';

const CustomDataComponent = () => {
  // General custom MDMS hook
  const {
    data: customData,
    isLoading: customLoading,
    getMasterData,
    searchMasters,
    trigger
  } = useCustomMDMS({
    modules: ['egov-workflow-v2', 'pgr-services'],
    lazy: true, // Load on demand
    queryKey: 'custom-workflow-data'
  });

  // Simplified hook for single master
  const {
    data: departments,
    isLoading: deptLoading,
    error: deptError
  } = useCustomMasterData('common-masters', 'Department', {
    stateCode: 'mz',
    enabled: true
  });

  // Hook for multiple related masters
  const {
    masters,
    isLoading: multiLoading
  } = useMultipleMasters([
    { module: 'common-masters', master: 'Department', key: 'departments' },
    { module: 'common-masters', master: 'Designation', key: 'designations' },
    { module: 'tenant', master: 'tenants', key: 'tenants' }
  ]);

  const loadAdditionalData = () => {
    // Trigger lazy loading
    trigger();
  };

  return (
    <div>
      <button onClick={loadAdditionalData}>Load Additional Data</button>
      
      {departments && (
        <div>
          <h3>Departments ({departments.length})</h3>
          {departments.map(dept => (
            <div key={dept.id}>{dept.name}</div>
          ))}
        </div>
      )}
      
      {masters.departments && (
        <div>
          <h3>All Masters Loaded</h3>
          <p>Departments: {masters.departments.length}</p>
          <p>Designations: {masters.designations?.length || 0}</p>
          <p>Tenants: {masters.tenants?.length || 0}</p>
        </div>
      )}
    </div>
  );
};
```

## API Reference

### useInitMDMS(config)

**Parameters:**
- `stateCode` (string): State/tenant code
- `coreModules` (array): Core MDMS modules to load initially
- `enabled` (boolean): Whether to enable the hook
- `background` (boolean): Load in background without blocking UI

**Returns:**
- `isLoading` (boolean): Loading state
- `isReady` (boolean): Ready state
- `coreData` (object): Loaded core master data
- `tenantInfo` (object): Tenant information
- `loadedModules` (array): List of loaded modules
- `error` (Error): Error state
- `getMasterData` (function): Get specific master data
- `getTenantInfo` (function): Get tenant information
- `refreshCore` (function): Refresh core data

### useModuleMDMS(config)

**Parameters:**
- `moduleName` (string, required): Module identifier
- `modules` (array): MDMS modules to load
- `stateCode` (string): Override state code
- `enabled` (boolean): Enable/disable loading
- `background` (boolean): Background loading
- `dependsOn` (array): Dependencies

**Returns:**
- `isLoading` (boolean): Loading state
- `isLoaded` (boolean): Loaded state
- `data` (object): Module master data
- `error` (Error): Error state
- `getMasterData` (function): Get specific master data
- `getModuleMasters` (function): Get all module masters
- `reloadModule` (function): Reload module data

### useCustomMDMS(config)

**Parameters:**
- `modules` (array|string): MDMS modules to fetch
- `stateCode` (string): State/tenant code
- `enabled` (boolean): Whether to enable the hook
- `filters` (object): Additional filters
- `lazy` (boolean): Manual trigger loading
- `staleTime` (number): Data freshness time
- `cacheTime` (number): Cache retention time

**Returns:**
- `isLoading` (boolean): Loading state
- `data` (object): Master data
- `error` (Error): Error state
- `getMasterData` (function): Get specific master data
- `searchMasters` (function): Search master data
- `trigger` (function): Manual trigger (lazy loading)
- `prefetchModules` (function): Preload additional modules

## Enhanced MDMS Service Features

The `MDMSService` has been enhanced with:

### Centralized Caching
- **Core data storage**: `setCoreData()`, `getCoreData()`
- **Module data storage**: `setModuleData()`, `getModuleData()`
- **Cache management**: `clearModuleData()`, `clearAllCaches()`

### Module Tracking
- **Load tracking**: `markModuleLoaded()`, `isModuleLoaded()`
- **Statistics**: `getCacheStats()`, `getLoadedModules()`

### Advanced Features
- **Cache warmup**: `warmupCache()`
- **Fallback support**: `getMasterWithFallback()`
- **Search capabilities**: `searchInMasters()`

## Best Practices

### 1. Module Organization

```
modules/
├── core/
│   └── uses useInitMDMS for essential masters
├── workbench/
│   └── uses useModuleMDMS with 'workbench'
├── property-tax/
│   └── uses useModuleMDMS with 'property-tax'
└── custom-component/
    └── uses useCustomMDMS for specific needs
```

### 2. Master Data Keys

Use consistent naming for master data access:
- Core: `common-masters`, `tenant`, `ACCESSCONTROL-ROLES`
- Workbench: `workbench-masters`, `mdms-workbench`
- Property Tax: `PropertyTax`, `pt-masters`

### 3. Error Handling

```javascript
const { error, isLoaded, data } = useModuleMDMS({
  moduleName: 'my-module',
  modules: ['my-module-masters']
});

if (error) {
  console.warn('Master data loading failed, using fallbacks');
  // Handle gracefully
}

if (!isLoaded) {
  return <LoadingSpinner />;
}
```

### 4. Performance

- Use `background: true` for non-critical masters
- Preload commonly used modules
- Leverage automatic caching
- Use lazy loading for optional data

## Migration from Legacy System

### Old Way
```javascript
// Legacy approach
const { data: mdmsData } = Digit.Hooks.useMdmsSearch({
  tenantId: stateCode,
  modules: ['common-masters', 'tenant']
});
```

### New Way
```javascript
// Modern approach with hooks
const { coreData } = useInitMDMS({ stateCode });
const { data: moduleData } = useModuleMDMS({
  moduleName: 'my-module',
  modules: ['my-module-masters']
});

// Legacy compatibility maintained
const coreData = window.Digit.MDMSService.getCoreData();
```

## Integration Examples

### Real-world Integration

The workbench module demonstrates real integration:

```javascript
// Add real MDMS-based masters if available
if (mdmsLoaded && mdmsData) {
  console.log('🔗 Integrating with real MDMS data');
  
  // Example: Add departments from MDMS
  const departments = getWorkbenchMasterData('common-masters', 'Department');
  if (departments && departments.length > 0) {
    mastersData.push({
      id: 1000,
      name: "Department (Live Data)",
      module: "Core - Live",
      description: "Live department data from MDMS",
      active: true,
      recordCount: departments.length
    });
  }
}
```

## Troubleshooting

### Common Issues

1. **Masters not loading**: Check module names and network connectivity
2. **Hook not initializing**: Ensure it's inside QueryClientProvider
3. **Stale data**: Use `refreshCore()` or `reloadModule()` methods

### Debug Mode

```javascript
// Check cache statistics
console.log('MDMS Cache Stats:', mdmsService.getCacheStats());

// Check loaded modules
console.log('Loaded modules:', window.Digit?.MDMSService?.getLoadedModules());
```

## Example Implementation

See the working implementation in:
- `/packages/modules/core-new/src/App.js` - Core initialization
- `/packages/modules/workbench-new/src/pages/employee/MasterSelection/index.js` - Module usage

This system ensures all modules can efficiently load and access master data with automatic caching, error handling, and legacy compatibility.