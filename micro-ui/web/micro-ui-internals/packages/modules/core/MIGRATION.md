# Migration Guide

## [DATE: 2025-12-24] MDMS Validation Configuration Migration

### Overview
The application uses a tenant-aware MDMS configuration for mobile number validation. This configuration is fetched from the `UserValidation` master within `common-masters` (or a configurable module).

### Configuration Details

**Key Features:**
- **Module Name:** Dynamically fetched from `window.globalConfigs.getConfig("UICONFIG_MODULENAME")`.
- **Fallback:** Defaults to `commonUiConfig` (previously was `ValidationConfigs`, now reverted to standard `commonUiConfig` pattern).
- **Master:** `UserValidation`

**MDMS JSON Structure:**
The system expects an array of validation objects in `UserValidation`. It looks for the object where `fieldType === "mobile"`.

```json
{
  "UserValidation": [
    {
      "fieldType": "mobile",
      "rules": {
        "pattern": "^[6-9][0-9]{9}$",
        "maxLength": 10,
        "minLength": 10,
        "errorMessage": "CORE_COMMON_MOBILE_ERROR"
      },
      "attributes": {
        "prefix": "+91"
      }
    }
    // ... other field validations
  ]
}
```

### Affected Modules & Files
-   **Core:**
    -   `packages/modules/core/src/pages/citizen/Login/index.js`
    -   `packages/modules/core/src/pages/citizen/Home/UserProfile.js`
-   **HRMS:**
    -   `packages/modules/hrms/src/pages/createEmployee.js`
    -   `packages/modules/hrms/src/pages/EditEmployee/EditForm.js`

### Verification
-   **Login/Profile/HRMS:** Verify validation rules (regex, length, prefix) align with your MDMS data in `UserValidation`.
