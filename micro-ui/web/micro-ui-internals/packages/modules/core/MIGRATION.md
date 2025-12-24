# Migration Guide

## [DATE: 2025-12-24] MDMS Validation Configuration Migration

### Overview
The application has transitioned from using static global configurations or disparate MDMS configurations for mobile number validation to a unified, tenant-aware MDMS configuration structure. This primarily affects `core` (Login, User Profile) and `hrms` (Create/Edit Employee, Inbox) modules.

### Old Configuration (Deprecated)
Previously, validation rules were either hardcoded, fetched from `window.globalConfigs`, or used the `UserValidation` MDMS master.

**Old MDMS Structure (Deprecated):**
- **Module:** `common-masters` (or `commonUiConfig` in some setups)
- **Master:** `UserValidation`
- **Structure:** Array of field validations.

**Old Global Config (Deprecated):**
- `CORE_MOBILE_CONFIGS` in `globalConfigs` containing `mobileNumberPattern`, `mobilePrefix`, etc.

### New Configuration (Current)
All mobile number validation now uses the `ValidationConfigs` module.

**New MDMS Structure:**
- **Module:** `ValidationConfigs`
- **Master:** `mobileNumberValidation`
- **JSON Structure:**
  ```json
  {
    "validationName": "defaultMobileValidation",
    "rules": {
      "prefix": "+91",
      "pattern": "^[6-9][0-9]{9}$",
      "isActive": true,
      "maxLength": 10,
      "minLength": 10,
      "errorMessage": "CORE_COMMON_MOBILE_ERROR",
      "allowedStartingDigits": ["6", "7", "8", "9"]
    }
  }
  ```

### Migration Steps for Deployments

1.  **MDMS Data Request:** Ensure the `ValidationConfigs` module and `mobileNumberValidation` master data is populated for all tenant IDs in your MDMS service. Use the structure definition above.
2.  **Global Config Cleanup:** You can safely remove `CORE_MOBILE_CONFIGS` from your `globalConfigs.js` or `sampleGlobalConfig.js` as it is no longer used by the login screen.
3.  **Frontend Build:** Rebuild and deploy the `digit-ui` frontend to pick up the code changes that point to the new MDMS path.

### Affected Modules & Files
-   **Core:**
    -   `packages/modules/core/src/pages/citizen/Login/index.js` (Added `useCustomMDMS` hook)
    -   `packages/modules/core/src/pages/citizen/Login/SelectMobileNumber.js` (Consumes `validationConfig` prop)
    -   `packages/modules/core/src/pages/citizen/Home/UserProfile.js` (Updated to `ValidationConfigs`)
-   **HRMS:**
    -   `packages/modules/hrms/src/pages/createEmployee.js` (Updated to `ValidationConfigs`)
    -   `packages/modules/hrms/src/pages/EditEmployee/EditForm.js` (Updated to `ValidationConfigs`)
    -   `packages/modules/hrms/src/pages/Inbox.js` (Already using `ValidationConfigs`, served as reference)

### Verification
-   **Login:** Attempt to login with citizen/employee. Verify the number prefix matches the MDMS config (e.g., +91).
-   **Profile:** Go to User Profile. Verify validation rules (pattern, length).
-   **HRMS:** Create or Edit an employee. Verify the mobile number field shows the correct prefix and validation error messages.
