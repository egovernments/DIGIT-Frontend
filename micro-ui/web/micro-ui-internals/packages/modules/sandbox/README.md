# @egovernments/digit-ui-module-sandbox

## Version: 0.1.0 🎉 NEW MODULE
**Release Date:** October 23, 2025

## 📦 Installation

```bash
npm install --save @egovernments/digit-ui-module-sandbox@0.1.0
```

## 🎉 What's New - Complete Sandbox Environment

### 🏗️ Brand New Module
This is a **completely new module** providing a comprehensive sandbox environment for DIGIT platform development, testing, and tenant management.

### 🚀 Major Features
- **🏢 Complete Tenant Management System**: Full CRUD operations for tenant lifecycle
- **⚙️ Configuration Management**: Upload, validate, and manage system configurations
- **🔧 Module Management**: Dynamic module selection and configuration
- **🧪 Testing Environment**: Comprehensive testing and validation tools
- **🎨 Rich UI Components**: Interactive cards, forms, and management interfaces

## 📋 Core Features

### 🏢 Tenant Management System
- **TenantCreate**: Complete tenant creation workflow with form validation
- **TenantUpdate**: Advanced tenant modification capabilities
- **TenantView**: Comprehensive tenant information display
- **TenantConfigUpload**: Configuration file management and validation

### ⚙️ Configuration Management
- **ConfigUploaderComponent**: Drag-drop configuration file uploads
- **LogoUploaderComponent**: Brand logo management system
- **PUCAR Integration**: Dedicated create/search/update configurations
- **Validation System**: Configuration validation and error handling

### 🔧 Application Management System
- **ApplicationHome**: Central dashboard for application management
- **ModuleMasterTable**: Comprehensive module overview and management
- **ModuleSelect**: Dynamic module selection interface
- **SetupMaster**: Master data configuration and setup

### 🎨 Rich UI Component Library
- **SandboxCard**: Main sandbox navigation component
- **ModuleCard**: Individual module representation and interaction
- **SandboxTestComponent**: Testing and validation interface

### 🖼️ Visual Assets
Complete SVG icon library included:
- `Citizen.svg` - Citizen portal representation
- `Employee.svg` - Employee interface icons
- `bar_chart.svg`, `graph.svg` - Analytics visualization
- `feature_search.svg` - Advanced search capabilities
- `calculate.svg` - Computation features
- `chat.svg` - Communication features

## 🔧 Configuration System

The Sandbox module supports a comprehensive configuration system with multiple configuration types for tenant management and demo environments.

### 1. Global Configuration (globalConfigs.getConfig)

Global configurations that affect the entire sandbox module behavior:

| Config Key | Type | Default | Description | Usage |
|------------|------|---------|-------------|--------|
| `OVERRIDE_ROOT_TENANT_WITH_LOGGEDIN_TENANT` | Boolean | `false` | Multi-tenant support for sandbox operations | Tenant context switching in sandbox |
| `MULTI_ROOT_TENANT` | Boolean | `false` | Enables multi-root tenant support | Enhanced tenant management |
| `contextPath` | String | `'sandbox-ui'` | Context path for sandbox application | Routing and navigation |
| `configModuleName` | String | `'commonUiConfig'` | Configuration module name | MDMS configuration |
| `SANDBOX_AUTO_TENANT_CREATION` | Boolean | `false` | Enable automatic tenant creation | Demo environment setup |
| `SANDBOX_MAX_TENANTS` | Number | `50` | Maximum tenants per sandbox | Resource limitation |
| `SANDBOX_CONFIG_VALIDATION` | Boolean | `true` | Enable configuration validation | Quality assurance |

```javascript
// Global Configuration Example
const getConfig = (key) => {
  switch(key) {
    case 'OVERRIDE_ROOT_TENANT_WITH_LOGGEDIN_TENANT':
      return true; // Enable multi-tenant sandbox environment
    case 'MULTI_ROOT_TENANT':
      return true; // Enable multi-root tenant support
    case 'contextPath':
      return 'sandbox-ui'; // Set sandbox context path
    case 'configModuleName':
      return 'commonUiConfig'; // Set configuration module
    case 'SANDBOX_AUTO_TENANT_CREATION':
      return false; // Disable auto tenant creation
    case 'SANDBOX_MAX_TENANTS':
      return 25; // Limit to 25 tenants
    case 'SANDBOX_CONFIG_VALIDATION':
      return true; // Enable validation
    default:
      return undefined;
  }
};
```

### 2. Component Props Configuration

Direct configuration passed as props to sandbox components:

```javascript
// SandboxCard Component Configuration
<SandboxCard
  config={{
    title: "Tenant Management",
    description: "Manage tenant configurations and settings",
    icon: "tenant",
    features: ["create", "update", "delete", "configure"],
    permissions: ["SANDBOX_ADMIN"]
  }}
  onClick={navigateToTenantManagement}
/>

// TenantCreate Component Configuration
<TenantCreate
  config={{
    validationRules: {
      tenantCode: /^[a-z0-9.-]+$/,
      tenantName: { minLength: 3, maxLength: 50 },
      logoSize: { maxSize: 2048000 } // 2MB
    },
    defaultModules: ["core", "workbench", "utilities"],
    autoSave: true,
    progressTracking: true
  }}
  onTenantCreated={handleTenantCreation}
/>

// ConfigUploader Component Configuration
<ConfigUploaderComponent
  config={{
    supportedFormats: ['.json', '.yaml', '.yml'],
    maxFileSize: 10485760, // 10MB
    validationSchema: "sandbox-config-v1",
    enablePreview: true,
    autoValidate: true
  }}
  onUpload={handleConfigUpload}
/>
```

### 3. MDMS Configuration

Configuration stored in MDMS for dynamic sandbox behavior:

```json
{
  "tenantId": "pg",
  "moduleName": "sandbox-config",
  "SandboxConfig": [
    {
      "module": "TenantManagement",
      "config": {
        "maxTenantsPerUser": 5,
        "tenantCodePattern": "^[a-z][a-z0-9.-]*[a-z0-9]$",
        "requiredModules": ["core"],
        "optionalModules": ["workbench", "utilities", "hrms"],
        "tenantTypes": ["demo", "development", "testing"]
      }
    },
    {
      "module": "ConfigurationManagement",
      "config": {
        "allowedConfigTypes": ["json", "yaml"],
        "maxConfigSize": 10485760,
        "validationRules": {
          "strictMode": true,
          "allowUnknownFields": false
        },
        "backupRetention": 30
      }
    },
    {
      "module": "ModuleManagement",
      "config": {
        "availableModules": [
          {
            "code": "core",
            "name": "Core Module",
            "version": "1.9.0",
            "required": true
          },
          {
            "code": "workbench",
            "name": "Workbench Module",
            "version": "1.9.0",
            "dependencies": ["core"]
          }
        ]
      }
    }
  ]
}
```

### 4. UI Customizations (Digit.Customizations)

Customizations for sandbox components and workflows:

```javascript
// Sandbox Module Customizations
Digit.Customizations = {
  "sandbox": {
    "TenantCreate": {
      "customValidators": {
        "uniqueTenantCode": async (code) => {
          const exists = await checkTenantExists(code);
          return !exists;
        },
        "domainValidator": (domain) => /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain)
      },
      "formSteps": [
        {
          "key": "basic",
          "label": "Basic Information",
          "fields": ["tenantCode", "tenantName", "description"]
        },
        {
          "key": "modules",
          "label": "Module Selection",
          "fields": ["selectedModules", "moduleConfigs"]
        },
        {
          "key": "branding",
          "label": "Branding & Assets",
          "fields": ["logo", "theme", "customStyles"]
        }
      ],
      "autoSaveInterval": 30000
    },
    "TenantManagement": {
      "listView": {
        "columns": [
          {
            "key": "tenantCode",
            "label": "Tenant Code",
            "sortable": true,
            "filterable": true
          },
          {
            "key": "status",
            "label": "Status",
            "formatter": "status",
            "filters": ["active", "inactive", "suspended"]
          },
          {
            "key": "modules",
            "label": "Modules",
            "formatter": "moduleList"
          },
          {
            "key": "lastModified",
            "label": "Last Modified",
            "sortable": true,
            "formatter": "date"
          }
        ],
        "actions": [
          {
            "key": "edit",
            "label": "Edit",
            "icon": "edit",
            "permission": "SANDBOX_TENANT_EDIT"
          },
          {
            "key": "configure",
            "label": "Configure",
            "icon": "settings",
            "permission": "SANDBOX_TENANT_CONFIG"
          },
          {
            "key": "delete",
            "label": "Delete",
            "icon": "delete",
            "permission": "SANDBOX_TENANT_DELETE",
            "confirmDialog": true
          }
        ]
      }
    },
    "ConfigUploader": {
      "uploadConfig": {
        "dragDropArea": {
          "height": 200,
          "acceptMessage": "Drop configuration files here",
          "rejectMessage": "Invalid file format"
        },
        "validationRules": {
          "json": {
            "parser": "JSON.parse",
            "requiredFields": ["module", "version"]
          },
          "yaml": {
            "parser": "yaml.parse",
            "requiredFields": ["module", "version"]
          }
        },
        "previewConfig": {
          "enabled": true,
          "maxLines": 100,
          "syntax": "json"
        }
      }
    },
    "ModuleManager": {
      "moduleCards": {
        "layout": "grid",
        "cardsPerRow": 3,
        "showDependencies": true,
        "showVersions": true,
        "enableBulkActions": true
      },
      "dependencyManagement": {
        "autoResolveDependencies": true,
        "showDependencyTree": true,
        "warnOnConflicts": true
      }
    }
  }
};
```

## 💻 Usage

### Basic Setup

Add the dependency to your `package.json`:

```json
{
  "@egovernments/digit-ui-module-sandbox": "^0.1.0"
}
```

### In your App.js

```jsx
import { initSandboxComponents } from "@egovernments/digit-ui-module-sandbox";

// Enable sandbox module
const enabledModules = ["sandbox"];

// Initialize sandbox components
const initDigitUI = () => {
  initSandboxComponents();
};
```

### Using Sandbox Components

```jsx
// Sandbox Card for navigation
import { SandboxCard } from "@egovernments/digit-ui-module-sandbox";

<SandboxCard
  title="Tenant Management"
  description="Manage tenant configurations"
  icon="tenant"
  onClick={navigateToTenantManagement}
/>

// Module Card for module management
import { ModuleCard } from "@egovernments/digit-ui-module-sandbox";

<ModuleCard
  moduleName="HRMS"
  moduleVersion="1.9.0"
  status="active"
  onManage={handleModuleManagement}
/>

// Configuration Uploader
import { ConfigUploaderComponent } from "@egovernments/digit-ui-module-sandbox";

<ConfigUploaderComponent
  onUpload={handleConfigUpload}
  supportedFormats={['.json', '.yaml']}
  maxSize="10MB"
/>
```

### MDMS Configuration

Enable sandbox in MDMS by adding this configuration:

```json
{
  "module": "digit-sandbox",
  "code": "sandbox",
  "active": true,
  "order": 1,
  "tenants": [
    {
      "code": "your-tenant-code"
    }
  ]
}
```

## 🏗️ Architecture & Components

### 📄 Configuration Files
- **moduleMasterConfig.js**: Module-specific configuration management
- **setupMasterConfig.js**: System setup and initialization configurations
- **pucarCreateConfig.js**: PUCAR system creation workflows
- **pucarSearchConfig.js**: Advanced search configurations for PUCAR
- **tenantCreateConfig.js**: Tenant creation form configurations
- **tenantSearchConfig.js**: Tenant search and filtering options
- **tenantUpdateConfig.js**: Tenant modification form layouts

### 🛠️ Utility Systems
- **TenantCreateUtil.js**: Helper functions for tenant creation
- **TenantUpdateUtil.js**: Utilities for tenant modification workflows
- **createUtils.js**: General creation and validation utilities
- **index.js**: Centralized utility exports and management

### 🔄 Page Structure
- **Employee Interface**: Complete employee routing system
- **SandboxCreate.js**: Resource creation workflows
- **SandboxSearch.js**: Advanced search and filtering capabilities
- **SandboxResponse.js**: Response handling and display

## 🎯 Key Capabilities

### 🏢 Tenant Lifecycle Management
- **Create Tenants**: Step-by-step tenant creation with validation
- **Update Configurations**: Modify tenant settings and configurations
- **View Details**: Comprehensive tenant information display
- **Manage Assets**: Logo and branding management per tenant

### ⚙️ Configuration Management
- **Upload Configs**: Drag-drop configuration file uploads
- **Validate Settings**: Real-time configuration validation
- **Manage Templates**: Template creation and management
- **Export/Import**: Configuration export and import functionality

### 🔧 Module Management
- **Dynamic Selection**: Choose and configure modules per tenant
- **Version Management**: Handle different module versions
- **Dependency Tracking**: Manage module dependencies
- **Health Monitoring**: Monitor module health and status

### 🧪 Testing & Validation
- **Environment Testing**: Test configurations in sandbox environment
- **Data Validation**: Validate data integrity and formats
- **Performance Testing**: Monitor performance metrics
- **Error Simulation**: Simulate error conditions for testing

## 🎨 User Interface

### 🖥️ Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Enhanced tablet experience
- **Desktop Full**: Complete desktop functionality
- **Cross-Browser**: Tested across major browsers

### 🎯 User Experience
- **Intuitive Navigation**: Easy-to-use interface design
- **Visual Feedback**: Clear status indicators and progress tracking
- **Error Handling**: User-friendly error messages and guidance
- **Accessibility**: WCAG compliant design

## 🔄 Migration & Setup

### Initial Setup
1. **Install Package**: `npm install @egovernments/digit-ui-module-sandbox@0.1.0`
2. **Configure MDMS**: Add sandbox module to tenant configuration
3. **Update App.js**: Initialize sandbox components
4. **Set Global Configs**: Configure sandbox-specific settings

### Development Workflow
1. **Environment Setup**: Configure sandbox environment
2. **Tenant Creation**: Create development tenants
3. **Module Configuration**: Configure required modules
4. **Testing**: Validate configurations and functionality

## 🧪 Testing

### Sandbox Testing
```javascript
// Enable sandbox testing features
window.globalConfigs.getConfig = (key) => {
  if (key === 'OVERRIDE_ROOT_TENANT_WITH_LOGGEDIN_TENANT') return true;
  if (key === 'MULTI_ROOT_TENANT') return true;
  if (key === 'contextPath') return 'sandbox-ui';
};
```

### Feature Testing Checklist
- [ ] Tenant creation workflow
- [ ] Configuration upload and validation
- [ ] Module selection and management
- [ ] Logo and asset management
- [ ] Multi-tenant switching
- [ ] Search and filtering functionality

## 🔗 Dependencies

### Required Dependencies
- `@egovernments/digit-ui-react-components`: ^1.8.0
- `@egovernments/digit-ui-components`: ^1.0.0
- `react`: ^17.0.2
- `react-dom`: ^17.0.2
- `react-router-dom`: ^5.3.0

### Peer Dependencies
- `lodash`: ^4.17.21
- `axios`: ^0.24.0

## 🐛 Known Issues & Solutions

### Common Issues
1. **Configuration Upload Fails**: Ensure file format is correct (JSON/YAML)
2. **Tenant Creation Error**: Verify all required fields are filled
3. **Module Loading Issues**: Check MDMS configuration and module availability
4. **Asset Upload Problems**: Verify file size and format requirements

## 📊 Performance

- **Fast Loading**: Optimized component loading
- **Efficient Rendering**: Minimal re-renders with proper state management
- **Memory Management**: Proper cleanup of resources
- **Bundle Size**: Optimized bundle size for production

## 🌐 Integration

### Platform Integration
- **Core Integration**: Seamless integration with Core v1.9.0
- **Multi-Tenant**: Full multi-tenant architecture support
- **MDMS Integration**: Dynamic configuration through MDMS
- **Workflow Integration**: Integration with platform workflows

### External Services
- **File Services**: File upload and management integration
- **User Services**: User authentication and authorization
- **Tenant Services**: Tenant management and validation
- **Configuration Services**: Dynamic configuration management

## 📚 Explore & Demo

### Live Demo
Visit our sandbox portal to explore the features:
[Sandbox Demo](https://sandbox.digit.org/sandbox-ui)

### Documentation
- [Developer Guide](https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui)
- [Sandbox Documentation](https://sandbox.digit.org/platform/functional-specifications/sandbox-ui)
- [API Documentation](https://core.digit.org/platform/core-services/tenant-management)

## 🤝 Contributors

- [jagankumar-egov](https://github.com/jagankumar-egov)
- [nabeel-egov](https://github.com/nabeel-egov)
- [mithun-egov](https://github.com/mithun-egov)
- [aaradhya-egov](https://github.com/aaradhya-egov)

## 🔧 Maintainer

- [jagankumar-egov](https://www.github.com/jagankumar-egov)

## 📄 License

MIT

---

### Published from DIGIT Frontend
[DIGIT Frontend Repository](https://github.com/egovernments/DIGIT-Frontend/tree/develop)

![DIGIT Logo](https://s3.ap-south-1.amazonaws.com/works-dev-asset/mseva-white-logo.png)