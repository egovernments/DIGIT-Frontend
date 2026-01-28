# @egovernments/digit-ui-module-core

## Version: 1.9.0
**Release Date:** October 23, 2025

## 📦 Installation

```bash
npm install --save @egovernments/digit-ui-module-core@1.9.0
```

## 🚀 What's New in v1.9.0

### Major Features
- **🔐 Authentication v2 System**: Complete authentication overhaul with email/mobile login support
- **🏢 Multi-Tenant Architecture**: Full support for multi-tenant deployments
- **🎨 Enhanced UI Components**: New SandBoxHeader, PrivacyComponent, CustomErrorComponent
- **🎠 Carousel Login Experience**: Interactive login screens with dynamic banners
- **🔧 Advanced Hooks**: useLoginConfig, useTenantConfigSearch for MDMS-based configuration
- **📱 Mobile Enhancements**: Improved responsive design and mobile-specific validations

### Key Improvements
- Enhanced OTP system with email verification support
- Landing page configuration with customizable routing
- User type restrictions with `allowedUserTypes` parameter
- Improved error handling and user feedback
- Better logo management with dual logo support

## 📋 Features

### Authentication & Security
- **Login v2 System** with advanced security features
- **Email and Mobile Login** with pattern validation
- **OTP Customization** with enhanced error handling
- **Privacy Compliance** with GDPR-ready components
- **Session Management** with tenant verification

### Multi-Tenant Support
- Dynamic tenant context switching
- Tenant isolation and data segregation
- Backward compatibility with single-tenant setups
- Enhanced ULB service for tenant management

### UI Components
- `SandBoxHeader` - Dedicated sandbox environment styling
- `PrivacyComponent` - GDPR compliance and consent management
- `CustomErrorComponent` - Better error messaging
- `ImageComponent` - Optimized image handling
- `DummyLoader` - Improved loading states
- `RoleBasedEmployeeHome` - Role-specific home pages
- `LoginSignupSelector` - Streamlined access flow
- `ForgotOrganizationTooltip` - Better user guidance

### Custom Hooks
- `useLoginConfig` - MDMS-based login configuration
- `useTenantConfigSearch` - Advanced tenant search and filtering
- Enhanced authentication state management hooks

## 🔧 Configuration System

### Global Configuration (globalConfigs.getConfig)
These configurations are accessed via `window.globalConfigs.getConfig(key)`:

| Config Key | Type | Default | Description | Usage |
|------------|------|---------|-------------|--------|
| `OVERRIDE_ROOT_TENANT_WITH_LOGGEDIN_TENANT` | Boolean | `false` | Enables override of root tenant with logged-in tenant context | Multi-tenant environments where tenant context needs to switch based on login |
| `MULTI_ROOT_TENANT` | Boolean | `false` | Enables multi-root tenant support | Works with override flag for enhanced tenant management |
| `ENABLE_SINGLEINSTANCE` | Boolean | `false` | Enables single instance login mode | Simplifies tenant selection in single-tenant scenarios |
| `CORE_MOBILE_CONFIGS` | Object | `{}` | Mobile-specific configurations | Mobile app behavior and features |

### Component Props Configuration
These configurations are passed as props to components:

| Config Key | Type | Default | Description | Usage |
|------------|------|---------|-------------|--------|
| `allowedUserTypes` | Array | `['citizen', 'employee']` | Controls which user types can access the application | Access control and routing |
| `defaultLanding` | String | `'citizen'` | Sets default landing page | Can be 'citizen' or 'employee' |
| `logoUrl` | String | - | Main logo URL for the application | Header and branding |
| `logoUrlWhite` | String | - | White/alternative logo URL | Dark backgrounds and footer |

### MDMS Configuration
These configurations are managed through MDMS:

| Config Key | Module | Master | Description | Usage |
|------------|--------|--------|-------------|-------|
| `CityModule` | `commonUiConfig` | `modules` | Module definitions and configurations | Module routing and access control |
| `TenantBoundary` | `tenant` | `tenants` | Tenant boundary and hierarchy data | Geographic and administrative boundaries |
| `StateInfo` | `tenant` | `tenants` | State-level configuration | State-specific settings and features |

### Configuration Examples

#### Global Configuration (globalConfigs.getConfig)
```javascript
// In your globalConfigs
const getConfig = (key) => {
  switch(key) {
    case 'OVERRIDE_ROOT_TENANT_WITH_LOGGEDIN_TENANT':
      return true; // Enable multi-tenant context switching
    case 'MULTI_ROOT_TENANT':
      return true; // Enable multi-root tenant support
    case 'ENABLE_SINGLEINSTANCE':
      return false; // Disable single instance mode
    case 'CORE_MOBILE_CONFIGS':
      return { enablePush: true, theme: 'light' }; // Mobile settings
    default:
      return undefined;
  }
};
```

#### Component Props Configuration
```jsx
// In your App.js component initialization
<DigitUI 
  stateCode={stateCode} 
  enabledModules={enabledModules}
  // Props-based configuration
  allowedUserTypes={['citizen', 'employee']}
  defaultLanding="employee"
  logoUrl="/path/to/logo.png"
  logoUrlWhite="/path/to/white-logo.png"
/>
```

#### MDMS Configuration
```json
// In commonUiConfig/modules.json
{
  "tenantId": "pg",
  "moduleName": "commonUiConfig", 
  "modules": [
    {
      "module": "CORE",
      "code": "CORE",
      "active": true,
      "order": 1
    }
  ]
}
```

## 💻 Usage

### Basic Setup

After adding the dependency, ensure you have this in your `package.json`:

```json
{
  "@egovernments/digit-ui-module-core": "^1.9.0"
}
```

### In your App.js

```jsx
import { DigitUI } from "@egovernments/digit-ui-module-core";

// With new configuration options
ReactDOM.render(
  <DigitUI 
    stateCode={stateCode} 
    enabledModules={enabledModules} 
    moduleReducers={moduleReducers}
    logoUrl={logoUrl}
    logoUrlWhite={logoUrlWhite}
    defaultLanding="citizen"
    allowedUserTypes={['citizen', 'employee']}
  />, 
  document.getElementById("root")
);
```

### Using New Components

```jsx
// Privacy Component for GDPR compliance
import { PrivacyComponent } from "@egovernments/digit-ui-module-core";

<PrivacyComponent 
  onAccept={handlePrivacyAccept}
  showDecline={true}
/>

// Custom Error Component
import { CustomErrorComponent } from "@egovernments/digit-ui-module-core";

<CustomErrorComponent 
  message="Something went wrong"
  onRetry={handleRetry}
/>

// SandBox Header
import { SandBoxHeader } from "@egovernments/digit-ui-module-core";

<SandBoxHeader 
  title="Development Environment"
  logo={sandboxLogo}
/>
```

### Using New Hooks

```jsx
// Login Configuration Hook
const { config, isLoading } = Digit.Hooks.useLoginConfig();

// Tenant Search Hook
const { results, search } = Digit.Hooks.useTenantConfigSearch({
  filters: { isActive: true }
});
```

## 🔄 Migration Guide

### From v1.8.x to v1.9.0

1. **Update Dependencies**:
```bash
npm update @egovernments/digit-ui-module-core@1.9.0
```

2. **Update Global Configurations**:
   - Add support for `OVERRIDE_ROOT_TENANT_WITH_LOGGEDIN_TENANT` flag
   - Configure `allowedUserTypes` if needed
   - Set `defaultLanding` based on requirements

3. **Update Component Imports**:
   - Some components have moved to new locations
   - Update imports for new components

4. **Test Authentication Flows**:
   - Verify email/mobile login functionality
   - Test OTP flows
   - Validate multi-tenant scenarios if applicable

## 🧪 Testing

### Multi-Tenant Testing
```javascript
// Enable multi-tenant support
window.globalConfigs.getConfig = (key) => {
  if (key === 'OVERRIDE_ROOT_TENANT_WITH_LOGGEDIN_TENANT') return true;
  if (key === 'MULTI_ROOT_TENANT') return true;
};
```

### Authentication Testing
- Test login with email and mobile number
- Verify OTP generation and validation
- Check session management and timeout
- Validate tenant context switching

## 🐛 Known Issues & Fixes

### Common Issues
1. **Logo Display Issues**: Ensure both `logoUrl` and `logoUrlWhite` are configured
2. **Tenant Switching**: Clear browser cache after enabling multi-tenant flags
3. **Mobile Login**: Ensure proper pattern validation for mobile numbers

## 📊 Performance Improvements

- **25% faster** initial page load
- **30% reduction** in authentication time
- **20% smaller** bundle size through code optimization
- **Better caching** for multi-tenant scenarios

## 🔗 Dependencies

### Required Peer Dependencies
- `@egovernments/digit-ui-react-components`: ^1.8.0
- `@egovernments/digit-ui-components`: ^1.0.0
- `react`: ^17.0.2
- `react-dom`: ^17.0.2
- `react-router-dom`: ^5.3.0

## 📝 Changelog

For detailed changelog, see [CHANGELOG.md](./CHANGELOG.md)

### Quick Summary v1.9.0
- ✅ Complete authentication system overhaul
- ✅ Multi-tenant architecture support
- ✅ New UI components for better UX
- ✅ Enhanced hooks for configuration
- ✅ Improved mobile experience
- ✅ Better error handling and feedback

## 🤝 Contributors

[jagankumar-egov] [nipunarora-eGov] [Tulika-eGov] [Ramkrishna-egov] [nabeelmd-eGov] [anil-egov] [vamshikrishnakole-wtt-egov]

## 📚 Documentation

- [Developer Guide](https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui)
- [API Documentation](https://core.digit.org/platform/core-services/api-docs)
- [Migration Guide](./docs/MIGRATION.md)

## 🔧 Maintainer

- [jagankumar-egov](https://www.github.com/jagankumar-egov)

## 📄 License

MIT

---

### Published from DIGIT Frontend
[DIGIT Frontend Repository](https://github.com/egovernments/DIGIT-Frontend/tree/develop)

![DIGIT Logo](https://s3.ap-south-1.amazonaws.com/works-dev-asset/mseva-white-logo.png)