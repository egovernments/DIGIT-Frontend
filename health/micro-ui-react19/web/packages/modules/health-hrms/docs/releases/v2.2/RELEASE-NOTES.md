# Health HRMS

**Release:** HCM v2.2
**Previous release:** [HCM v2.1](../v2.1/RELEASE-NOTES.md)
**Module:** `@egovernments/digit-ui-module-health-hrms`

---

## Overview

Health HRMS provides the web interface for managing health campaign field workers. Program administrators use it to create employee accounts, assign them to geographic boundaries, link them to supervisors, and connect them to campaigns.

Screens, flows, roles, localisation and API integrations are **unchanged in this release**. For that material see the [v2.1 release notes](../v2.1/RELEASE-NOTES.md).

---

## What is this release about?

This release contains **one usability improvement and one bug fix**.

- No new features
- No new screens
- No new API endpoints
- No MDMS or configuration changes
- No action required before upgrading

---

## What Changed

### Dropdowns on the create employee screen are now searchable

**Before:** The Employee Type, Department and Designation dropdowns on the create employee form, and the boundary dropdown on the employee boundary screen, could only be browsed by scrolling. On deployments with long department or designation lists this made selection slow.

**After:** All four dropdowns accept typed text and filter their options as you type. Scrolling still works as before — nothing is removed, searching is simply available in addition.

Files changed:
- `src/components/config/createEmployeeConfig.js` — Employee Type, Department, Designation
- `src/components/pageComponents/SelectEmployeeBoundary.js` — boundary dropdown

---

## Bug Fixes

### Deactivate employee popup — fields never aligned vertically

**Before:** Four fields in the deactivate employee popup — comment, effective date, document upload and remarks — asked for vertical alignment through a misspelled property name, `alignFieldPairVerically`. The component never matched that spelling, so the alignment silently never applied and the fields kept the default side-by-side layout.

**After:** Corrected to `alignFieldPairVertically`. All four fields now align vertically as intended.

File changed: `src/components/pageComponents/DeactivatePopUp.js`

---

## Package and Dependency Updates

| Package | v2.1 | v2.2 |
|---|---|---|
| `@egovernments/digit-ui-react-components` | 2.0.0-dev-18 | 2.0.0-dev-21 |
| `@egovernments/digit-ui-svg-components` | 2.0.0-dev-08 | 2.0.0-dev-11 |
| `@egovernments/digit-ui-components` | 2.0.0-dev-64 | 2.0.0-dev-79 |

The module's own package version is unchanged at `1.0.0`.

---

## What did not change

| Area | Status |
|---|---|
| Screens and navigation | Unchanged |
| API integrations | Unchanged |
| Roles and permissions | Unchanged |
| MDMS configuration | Unchanged |
| Localisation keys | Unchanged |
| Deployment (`payments-ui` variant at `/payments-ui/`) | Unchanged |
