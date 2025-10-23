# Global Configuration Changelog

## Version: 2025.01.15

---

## 🌍 Global Configuration Updates

### **New Configuration Flags**

#### **1. OVERRIDE_ROOT_TENANT_WITH_LOGGEDIN_TENANT**
- **Type**: Boolean
- **Default**: false
- **Purpose**: Enables override of root tenant with the currently logged-in tenant
- **Use Case**: Multi-tenant environments where tenant context needs to switch based on login
- **Modules Affected**: Core, Workbench, All tenant-dependent modules
- **Implementation Location**: `packages/libraries/src/services/molecules/Ulb/index.js`

```javascript
// Usage Example
const overrideRootTenant = window?.globalConfigs?.getConfig("OVERRIDE_ROOT_TENANT_WITH_LOGGEDIN_TENANT") || false;
```

### **Existing Flags Referenced**

#### **MULTI_ROOT_TENANT**
- **Type**: Boolean
- **Default**: false
- **Purpose**: Enables multi-root tenant support
- **Works With**: OVERRIDE_ROOT_TENANT_WITH_LOGGEDIN_TENANT for enhanced tenant management

#### **ENABLE_MDMS_BULK_UPLOAD**
- **Status**: Active in Workbench module
- **Purpose**: Enables bulk upload functionality for master data

#### **ENABLE_MDMS_BULK_DOWNLOAD**
- **Status**: Active in Workbench module  
- **Purpose**: Enables bulk download of master data

#### **ENABLE_JSON_EDIT**
- **Status**: Active in Workbench module
- **Purpose**: Enables JSON editor for schema data manipulation

---

## 📦 Module Version Updates

| Module | Previous Version | New Version | Key Changes |
|--------|-----------------|-------------|-------------|
| **Core** | 1.8.55 | 1.8.57 | Multi-tenant support, logo fixes |
| **Workbench** | 1.0.28 | 1.0.29 | MDMS UI redesign, card-based navigation |
| **Sandbox** | 0.0.3 | 0.0.4 | Module navigation enhancement |
| **Utilities** | 1.0.16 | 1.0.17 | Enhanced module integration |

---

## 🔧 Configuration Changes in sampleGlobalConfig.js

### **Updated Variables**
```javascript
// Context and Module Configuration
var contextPath = 'sandbox-ui';
var configModuleName = 'commonUiConfig';

// Locale Configuration  
var localeRegion = "MZ";
var localeDefault = "en";

// MDMS Configuration
var mdmsContextV1 = "egov-mdms-service";
var mdmsContextV2 = "mdms-v2";

// Asset Configuration
var assetS3Bucket = 'works-qa-asset';

// Logo URLs
var footerBWLogoURL = 'https://unified-dev.digit.org/egov-dev-assets/mseva-white-logo.png';
var footerLogoURL = 'https://unified-dev.digit.org/egov-dev-assets/digit-footer.png';
var digitHomeURL = 'https://www.digit.org/';
```

---

## 🚀 Key Implementation Details

### **Multi-Tenant Flow Enhancement**

1. **Login Flow**:
   - User logs in with specific tenant credentials
   - System checks `OVERRIDE_ROOT_TENANT_WITH_LOGGEDIN_TENANT` flag
   - If enabled, replaces root tenant context with logged-in tenant
   - All subsequent API calls use the logged-in tenant context

2. **State Management**:
   ```javascript
   // In ULB Service
   getStateId: () => {
     const isMultiRootTenant = window?.globalConfigs?.getConfig("MULTI_ROOT_TENANT") || false;
     const overrideRootTenant = window?.globalConfigs?.getConfig("OVERRIDE_ROOT_TENANT_WITH_LOGGEDIN_TENANT") || false;
     
     if (overrideRootTenant && loggedInTenant) {
       return loggedInTenant;
     }
     // ... rest of logic
   }
   ```

3. **Backward Compatibility**:
   - All new flags default to `false`
   - Existing single-tenant setups continue to work without changes
   - Multi-tenant features activate only when explicitly enabled

---

## 🔄 Migration Guidelines

### **For Existing Deployments**

1. **Single Tenant → Multi-Tenant**:
   - Set `MULTI_ROOT_TENANT = true`
   - Optionally set `OVERRIDE_ROOT_TENANT_WITH_LOGGEDIN_TENANT = true`
   - Update tenant configurations in backend

2. **Updating Global Config**:
   ```javascript
   // Add to your globalConfigs
   if (key === 'OVERRIDE_ROOT_TENANT_WITH_LOGGEDIN_TENANT') {
     return true; // or false based on requirement
   }
   ```

3. **Module Updates**:
   - Update Core to v1.8.57 or higher
   - Update Workbench to v1.0.29 for new UI features
   - Ensure all dependent modules are compatible

---

## 🛡️ Security Considerations

### **Tenant Isolation**
- New multi-tenant flags ensure proper data isolation
- Tenant context is validated on every API call
- Session management includes tenant verification

### **Configuration Security**
- Global configs should be set at deployment time
- Avoid exposing sensitive configuration in client-side code
- Use environment variables for production deployments

---

## 📊 Performance Impact

### **Optimizations**
- Schema limit increased from 200 to 500 for better scalability
- Card-based UI reduces DOM operations
- Memoized filtering for search functionality

### **Resource Usage**
- No significant increase in bundle size
- Improved caching for multi-tenant scenarios
- Reduced API calls with better state management

---

## 🔍 Testing Checklist

### **Multi-Tenant Testing**
- [ ] Test with `OVERRIDE_ROOT_TENANT_WITH_LOGGEDIN_TENANT = true`
- [ ] Verify tenant switching on login
- [ ] Check data isolation between tenants
- [ ] Test backward compatibility with single tenant

### **UI Testing**
- [ ] Test new card-based MDMS interface
- [ ] Verify search functionality
- [ ] Test responsive design on mobile/tablet
- [ ] Check text truncation and hover effects

### **Integration Testing**
- [ ] Test all modules with new Core version
- [ ] Verify global config flag propagation
- [ ] Test API calls with tenant context
- [ ] Check session management

---

## 📝 Notes

- All changes maintain backward compatibility
- New features are opt-in via configuration flags
- Multi-tenant support is enterprise-ready
- UI improvements enhance user experience without breaking existing workflows

---

## 🔗 Related Documentation

- PR Reference: https://github.com/egovernments/DIGIT-Frontend/pull/3278
- Module Changelogs: See individual CHANGELOG.md files in each module
- Configuration Guide: Refer to sampleGlobalConfig.js for examples

---

*Last Updated: January 15, 2025*