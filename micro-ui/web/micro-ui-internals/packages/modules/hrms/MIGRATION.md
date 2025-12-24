# Migration Guide

## [DATE: 2025-12-24] MDMS Validation Configuration Migration

### Overview
This module (`hrms`) has been updated to align its mobile number validation and configuration with the core platform standards. It now uses the centralized `ValidationConfigs` MDMS module.

### Old Configuration (Deprecated)
- **Module:** `common-masters` or `commonUiConfig`
- **Master:** `UserValidation`
- **Logic:** Custom logic handling `genericValidation` nesting or flat arrays.

### New Configuration (Current)
- **Module:** `ValidationConfigs`
- **Master:** `mobileNumberValidation`
- **Usage:**
  - `createEmployee.js` and `EditForm.js` now fetch this config via `useCustomMDMS`.
  - Prefix, pattern, and length constraints are derived directly from this master.

### Verification Steps
1.  **Create Employee:** Open the create employee form. Ensure the mobile number prefix (e.g., +91) is displayed and comes from the API response (check network tab or console logs if enabled).
2.  **Edit Employee:** detailed verifying the same on the edit screen.
3.  **Inbox:** No changes were needed for Inbox as it was already using this pattern, but verify search filters work as expected.

### Action Item for DevOps/Implementation
Ensure the `ValidationConfigs` -> `mobileNumberValidation` MDMS data is correctly seeded for all environments.
