# Migration Guide

## [DATE: 2025-12-24] MDMS Validation Configuration Migration

### Overview
HRMS module (`createEmployee`, `EditForm`) now consistently uses the unified MDMS configuration path for mobile number validation, aligning with the Core module.

### Configuration Path
- **Module:** Configurable via `UICONFIG_MODULENAME` (defaults to `commonUiConfig`).
- **Master:** `UserValidation`
- **Logic:** Finds the entry with `fieldType: "mobile"` and extracts rules.

### Validation Logic
- **Pattern:** Taken from `rules.pattern`.
- **Prefix:** Taken from `attributes.prefix`.
- **Length:** Taken from `rules.maxLength` / `rules.minLength`.

### Verification Step
Ensure your MDMS `commonUiConfig` (or custom module) has the `UserValidation` master populated with the mobile field definition.
