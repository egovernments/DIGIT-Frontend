# DIGIT UI MDMS System Architecture

## Overview

This document outlines the architecture for a modern DIGIT UI system with comprehensive Master Data Management Service (MDMS) integration, localization support, and modular design patterns.

## Core Principles

### 1. **Schema-First Approach**
- Use dot notation schemas: `"ACCESSCONTROL-ROLES.roles"`
- Automatic conversion to proper MdmsCriteria format
- Support for both legacy modules array and modern schemas array

### 2. **Layered Hook Architecture**
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   useInitMDMS   │    │ useModuleMDMS    │    │ useCustomMDMS   │
│  (Core App)     │    │ (Module Level)   │    │ (On-demand)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────────┐
                    │   MDMSService       │
                    │ (Centralized Cache) │
                    └─────────────────────┘
```

### 3. **Centralized Service Layer**
- Single MDMSService for all MDMS operations
- Intelligent caching and module tracking
- Schema parsing and validation
- Legacy compatibility layer

## Architecture Components

### 1. **Core Libraries Package** (`@egovernments/digit-ui-libraries-new`)

#### Services Layer
```
src/services/
├── mdms.js          # Master Data Management Service
├── localization.js  # Internationalization Service  
└── api.js          # Base API client
```

#### Hooks Layer
```
src/hooks/
├── useInitMDMS.js      # Core app MDMS initialization
├── useModuleMDMS.js    # Module-specific MDMS loading
├── useCustomMDMS.js    # Custom/fallback MDMS queries
├── useInitLocalization.js  # Core localization setup
├── useModuleLocalization.js # Module localization loading
└── index.js           # Export all hooks
```

#### Utilities
```
src/utils/
├── constants.js    # API endpoints, default configs
├── helpers.js      # Common utility functions
└── validators.js   # Schema and data validation
```

### 2. **Core Module** (`@egovernments/digit-ui-module-core-new`)

#### Responsibilities
- App initialization and routing
- Global context providers (QueryClient, Router)
- Core MDMS and localization loading
- Authentication and session management
- Common UI components and layouts

#### Structure
```
src/
├── App.js              # Main app component with providers
├── routes/             # Application routing configuration
├── components/         # Shared UI components
├── pages/              # Core pages (login, dashboard, etc.)
└── utils/              # Module-specific utilities
```

### 3. **Feature Modules** (e.g., `@egovernments/digit-ui-module-workbench-new`)

#### Responsibilities
- Feature-specific MDMS and localization loading
- Module routes and navigation
- Feature UI components and business logic
- Module-specific utilities and services

#### Structure
```
src/
├── index.js            # Module entry point and exports
├── pages/              # Module pages
├── components/         # Module-specific components
├── hooks/              # Module-specific hooks (optional)
└── utils/              # Module utilities
```

## MDMS System Design

### 1. **Schema Format Specification**

#### Dot Notation Schema
```javascript
// Input format
const schemas = [
  'ACCESSCONTROL-ROLES.roles',
  'common-masters.Department',
  'tenant.tenants',
  'workflow.BusinessService'
];

// Generated MdmsCriteria
{
  "MdmsCriteria": {
    "tenantId": "od",
    "moduleDetails": [
      {
        "moduleName": "ACCESSCONTROL-ROLES",
        "masterDetails": [
          { "name": "roles" }
        ]
      },
      {
        "moduleName": "common-masters", 
        "masterDetails": [
          { "name": "Department" }
        ]
      }
    ]
  }
}
```

#### Advanced Schema Options
```javascript
// Object format with filters
const schemas = [
  {
    module: 'ACCESSCONTROL-ROLES',
    master: 'roles', 
    filter: '[?(@.active == true)]'
  },
  'common-masters.Department'  // Simple format
];
```

### 2. **Hook Hierarchy and Usage**

#### useInitMDMS (Core App Level)
```javascript
const useInitMDMS = ({
  stateCode,
  schemas = [
    'common-masters.Department',
    'common-masters.Designation', 
    'tenant.tenants',
    'ACCESSCONTROL-ROLES.roles'
  ],
  enabled = true,
  background = false
}) => {
  // Returns: { isReady, coreData, tenantInfo, getMasterData, error }
}
```

#### useModuleMDMS (Module Level)
```javascript
const useModuleMDMS = ({
  moduleName,
  schemas = [],
  stateCode,
  enabled = true,
  background = false,
  dependsOn = []
}) => {
  // Returns: { isLoaded, data, getMasterData, getModuleMasters, error }
}
```

#### useCustomMDMS (On-Demand)
```javascript
const useCustomMDMS = ({
  schemas = [],
  stateCode,
  enabled = true,
  lazy = false,
  filters = {}
}) => {
  // Returns: { data, trigger, getMasterData, searchMasters, error }
}
```

### 3. **Caching Strategy**

#### Multi-Level Caching
```
┌─────────────────┐
│   React Query   │  ← Query-level caching (10-30 min)
│     Cache       │
└─────────────────┘
         │
┌─────────────────┐  
│  MDMSService    │  ← Service-level caching (session)
│     Cache       │
└─────────────────┘
         │
┌─────────────────┐
│    Browser      │  ← Browser storage (localStorage)
│   LocalStorage  │
└─────────────────┘
```

#### Cache Keys Strategy
```javascript
// React Query keys
['mdms', 'core', stateCode, schemasHash]
['mdms', 'module', moduleName, stateCode, schemasHash]  
['mdms', 'custom', queryKey, stateCode, schemasHash]

// Service cache keys
`mdms:${stateCode}:core`
`mdms:${stateCode}:module:${moduleName}`
```

### 4. **Error Handling & Resilience**

#### Progressive Loading
```javascript
// Tier 1: Essential data (blocking)
const essentialSchemas = [
  'tenant.tenants',
  'common-masters.StateInfo'
];

// Tier 2: Important data (background)  
const importantSchemas = [
  'common-masters.Department',
  'ACCESSCONTROL-ROLES.roles'
];

// Tier 3: Optional data (lazy)
const optionalSchemas = [
  'workflow.BusinessService',
  'pgr-services.ServiceDefs'
];
```

#### Fallback Strategies
```javascript
const fallbackData = {
  'common-masters.Department': [],
  'tenant.tenants': [{ code: stateCode, name: stateCode }],
  'ACCESSCONTROL-ROLES.roles': []
};
```

## Localization System Design

### 1. **Localization Hook Hierarchy**

#### useInitLocalization (Core App)
- Loads essential translations for entire app
- Sets up language switching infrastructure
- Provides global translation context

#### useModuleLocalization (Module Level)  
- Loads module-specific translations
- Inherits from core localization context
- Supports module translation overrides

### 2. **Translation Key Structure**
```
{
  "EXAMPLE_HOME_TITLE": "Welcome to DIGIT UI",
  "WB_MASTER_DATA_MANAGEMENT": "Master Data Management",
  "COMMON_SAVE": "Save",
  "COMMON_CANCEL": "Cancel"
}
```

## Implementation Strategy

### Phase 1: Core Infrastructure
1. Create core libraries package with services and hooks
2. Implement MDMSService with schema parsing
3. Create base MDMS hooks (useInitMDMS, useModuleMDMS, useCustomMDMS)
4. Add comprehensive error handling and caching

### Phase 2: Core Module  
1. Create core module with app initialization
2. Integrate core MDMS and localization hooks
3. Set up routing and global providers
4. Implement authentication and session management

### Phase 3: Feature Modules
1. Create workbench module as reference implementation
2. Demonstrate module-specific MDMS and localization loading
3. Show best practices for module development
4. Create module development guidelines

### Phase 4: Advanced Features
1. Add bundle analysis and performance monitoring
2. Implement advanced caching strategies
3. Add development tools and debugging utilities
4. Create comprehensive testing framework

## Development Guidelines

### 1. **Module Development Best Practices**

#### Module Entry Point
```javascript
// src/index.js
export const WorkbenchModule = {
  // Component exports for routing
  EmployeePages: {
    MasterSelection: lazy(() => import('./pages/MasterSelection'))
  },
  
  // Module configuration
  config: {
    moduleName: 'workbench',
    requiredSchemas: [
      'common-masters.Department',
      'workflow.ProcessInstances'
    ]
  }
};
```

#### MDMS Usage Pattern
```javascript
// In module components
const { 
  isLoaded, 
  data, 
  getMasterData 
} = useModuleMDMS({
  moduleName: 'workbench',
  schemas: [
    'common-masters.Department',
    'workflow.ProcessInstances'
  ]
});

// Access data
const departments = getMasterData('common-masters', 'Department');
```

### 2. **Schema Definition Guidelines**

#### Naming Conventions
- Module names: Use existing DIGIT module names (`ACCESSCONTROL-ROLES`, `common-masters`)
- Master names: Use PascalCase (`Department`, `BusinessService`)
- Schema format: `moduleName.masterName`

#### Common Schemas Reference
```javascript
const COMMON_SCHEMAS = {
  // Core masters
  DEPARTMENTS: 'common-masters.Department',
  DESIGNATIONS: 'common-masters.Designation', 
  STATE_INFO: 'common-masters.StateInfo',
  
  // Tenant info
  TENANTS: 'tenant.tenants',
  CITY_MODULES: 'tenant.citymodule',
  
  // Access control
  ROLES: 'ACCESSCONTROL-ROLES.roles',
  ACTIONS: 'ACCESSCONTROL-ACTIONS-TEST.actions-test',
  
  // Workflow
  BUSINESS_SERVICES: 'workflow.BusinessService',
  PROCESS_INSTANCES: 'workflow.ProcessInstances'
};
```

### 3. **Performance Considerations**

#### Bundle Size Optimization
- Use dynamic imports for modules
- Implement proper tree shaking
- External dependencies for common libraries
- Bundle analysis and monitoring

#### Runtime Performance
- Implement virtual scrolling for large lists
- Use React.memo for expensive components  
- Optimize re-renders with proper dependencies
- Implement progressive data loading

### 4. **Testing Strategy**

#### Unit Tests
- Test MDMS hooks with various scenarios
- Mock API responses for consistent testing
- Test error handling and edge cases
- Validate schema parsing logic

#### Integration Tests  
- Test module integration with core app
- Validate MDMS data flow between components
- Test localization switching
- Verify caching behavior

#### E2E Tests
- Test complete user workflows
- Validate real API integrations
- Test performance under load
- Cross-browser compatibility

## File Structure for New Implementation

```
digit-ui-fresh/
├── packages/
│   ├── libraries-new/                 # Core libraries
│   │   ├── src/
│   │   │   ├── services/
│   │   │   │   ├── mdms.js
│   │   │   │   ├── localization.js
│   │   │   │   └── api.js
│   │   │   ├── hooks/
│   │   │   │   ├── useInitMDMS.js
│   │   │   │   ├── useModuleMDMS.js
│   │   │   │   ├── useCustomMDMS.js
│   │   │   │   ├── useInitLocalization.js
│   │   │   │   └── useModuleLocalization.js
│   │   │   ├── utils/
│   │   │   └── index.js
│   │   ├── package.json
│   │   └── webpack.config.js
│   │
│   ├── modules/
│   │   ├── core-new/                  # Core application module
│   │   │   ├── src/
│   │   │   │   ├── App.js
│   │   │   │   ├── routes/
│   │   │   │   ├── components/
│   │   │   │   └── pages/
│   │   │   └── package.json
│   │   │
│   │   └── workbench-new/             # Feature module example
│   │       ├── src/
│   │       │   ├── index.js
│   │       │   ├── pages/
│   │       │   └── components/
│   │       └── package.json
│   │
│   └── components/                    # Shared UI components
│       ├── src/
│       └── package.json
│
├── example-fresh/                     # Clean example app
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── webpack.config.js
│
└── docs/                              # Documentation
    ├── ARCHITECTURE.md
    ├── MODULE_DEVELOPMENT.md
    └── API_REFERENCE.md
```

## Next Steps

1. **Review Architecture**: Validate the proposed design and make adjustments
2. **Create Implementation Plan**: Break down into specific development tasks
3. **Set Up Project Structure**: Create fresh project with clean architecture
4. **Implement Core Libraries**: Start with MDMSService and core hooks
5. **Build Core Module**: Create app foundation with proper initialization
6. **Develop Feature Module**: Create workbench as reference implementation
7. **Add Testing & Documentation**: Comprehensive testing and developer guides

This architecture provides a solid foundation for scalable, maintainable DIGIT UI applications with proper separation of concerns and modern development practices.