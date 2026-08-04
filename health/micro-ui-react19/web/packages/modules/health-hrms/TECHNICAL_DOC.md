# Health HRMS — HCM v2.1 Technical Documentation

**Module:** `@egovernments/digit-ui-module-health-hrms`
**Release:** HCM v2.1
**Stack:** React 19, Webpack 5 (migrated from React 17)
**Deployed under:** `payments-ui` build variant at `/payments-ui/`
**Repository:** [egovernments/DIGIT-Frontend](https://github.com/egovernments/DIGIT-Frontend)

---

## Overview

Health HRMS provides the web interface for managing health campaign field workers. Program administrators use it to create employee accounts, assign them to geographic boundaries, link them to supervisors, and connect them to campaigns.

All data is scoped by boundary — users only see employees and data within the geographic area they are assigned to at login.

**In HCM v2.1, this is a platform migration release.** The module has been moved from React 17 to React 19 and now ships under the new `payments-ui` deployment variant. Three bug fixes and a localization housekeeping change were also applied during the v2.1 cycle.

---

## Migration from React 17 to React 19

**Ticket:** HCMPRE-3987
**PR:** [#3990](https://github.com/egovernments/DIGIT-Frontend/pull/3990)

The full module has been ported from the React 17 legacy stack to React 19 with Webpack 5. End users will not see any difference — all screens and features work exactly as before.

**What changed internally:**
- React Query v3 → TanStack Query v5
- React Router v5 → React Router v6
- Build output: `dist/index.js` (CJS, microbundle) → `dist/main.js` (Webpack 5)
- Module is now bundled and deployed as part of `payments-ui` alongside Health Payments and PGR

**No new screens or features were added in this release.**

---

## What Changed in v2.1

### New Deployment Variant — `payments-ui`

HRMS is no longer served from the old React 17 standalone shell. It is now bundled and deployed as part of `payments-ui`, independently served at `/payments-ui/`.

---

## Bug Fixes

### Mobile Number Validation — Changed to Toast

**PR:** [#4037](https://github.com/egovernments/DIGIT-Frontend/pull/4037)

**Before:** When a user entered an invalid mobile number while creating an employee, a blocking modal appeared — stopping all interaction until dismissed. The mobile number field used type `"number"` with `min`/`max` numeric range validators.

**After:** The field type was changed from `"number"` to `"mobileNumber"`, which uses the platform's built-in mobile validation. The validation message now appears as a toast notification at the bottom of the screen. The form stays accessible and the user can correct the number without being blocked. The `prefix` and `maxLength` properties replaced the previous `componentInFront` and range constraints.

Files changed in health-hrms:
- `src/components/config/createEmployeeConfig.js`
- `src/components/pageComponents/DeactivatePopUp.js`
- `src/components/pageComponents/popup.js`
- `src/pages/employee/createEmployee.js`

---

### Deactivate Employee Popup — Form Fields Not Rendering

**Ticket:** HCMPRE-3987
**PR:** [#3990](https://github.com/egovernments/DIGIT-Frontend/pull/3990)

**Before:** When opening the deactivate employee popup, the form fields inside it were not rendering correctly. This was a React 17 → React 19 compatibility issue.

**After:** Fixed during the React 19 migration. The popup now correctly displays all form fields, including the deactivation reason dropdown.

---

### Action Popup — Content Not Appearing

**Ticket:** HCMPRE-3987
**PR:** [#3990](https://github.com/egovernments/DIGIT-Frontend/pull/3990)

**Before:** When opening an action popup, the content inside was blank or not rendering. Also a React 17 → React 19 compatibility issue.

**After:** Fixed during migration. The popup now renders its content correctly.

---

### Localization Keys Centralised

**Ticket:** HCMPRE-4120
**PR:** [#4136](https://github.com/egovernments/DIGIT-Frontend/pull/4136)

**Before:** Translation keys were scattered as inline string literals across every component and page file, making them hard to audit, rename, or find missing keys.

**After:** All translation keys used in the health-hrms module are now declared in a single constants file: `src/utils/i18nKeyConstants.js`. Every component now imports from `I18N_KEYS` rather than using inline strings. This is a code-quality change only — no user-visible behaviour changed.

Files changed: all component and page files within health-hrms, plus the new `src/utils/i18nKeyConstants.js`.

---

## Package and Dependency Updates

The following tickets resulted in package.json changes only (version bumps or dependency vulnerability fixes) with no source code changes to health-hrms:

| PR | Description |
|---|---|
| [#4124](https://github.com/egovernments/DIGIT-Frontend/pull/4124) | Package version bump as part of cross-module CSS and localization work |
| [#4151](https://github.com/egovernments/DIGIT-Frontend/pull/4151) | Package version bump as part of attendance/CSS fixes across modules |
| [#4173](https://github.com/egovernments/DIGIT-Frontend/pull/4173) | Dependency vulnerability fix — package.json version update only |

---

## Configuration Required Before Deploying

### Deploy the `payments-ui` Variant

HRMS is no longer served from the old React 17 standalone shell. Deploy the new `payments-ui` Docker image and configure the nginx route at `/payments-ui/`.

> Health Payments and PGR are also bundled in the same `payments-ui` image.

---

## How the Module Works

### Screens

| Route (relative to `/hrms/`) | Component | Description |
|---|---|---|
| `inbox` | `InboxSearch` | Employee list — search by name, code, phone, role, or active status |
| `create` | `HRCreateEmployee` | Create new employee |
| `edit/:id` | `HRCreateEmployee` (edit mode) | Edit existing employee |
| `details/:id` | `EmployeeDetailScreen` | View employee details, activate/deactivate, navigate to campaign assignment |
| `assign-campaign/:id` | `AssignCampaignInbox` | Assign employee to a campaign |
| `update/assign-campaign/:id` | `AssignCampaignInbox` (edit mode) | Edit an existing campaign assignment |
| `response` | `ResponseScreen` | Confirmation screen after create/update |

The `HierarchySelection` screen is rendered before the main module routes are accessible and is used to scope the session to a specific boundary hierarchy.

### Employee Management Flow

```text
Hierarchy selection (required every session)
  → Employee inbox (search by name, role, or boundary)
  → Create employee / View employee details
  → Assign jurisdiction / Link supervisor
  → Activate or deactivate employee
  → Confirmation screen
```

### Campaign Assignment Flow

```text
Employee details screen
  → Click "Edit campaigns"
  → Campaign assignment inbox (campaigns scoped to employee jurisdictions)
  → Assign or remove employee from campaign
  → Confirmation screen
```

**Note on hierarchy selection:** Every session starts with a hierarchy selection screen before accessing employee data. This ensures the session is always scoped to the correct boundary.

**Note on supervisor linking:** Assigning a supervisor creates a real backend reporting relationship — it is not just a UI label. Changes affect backend HRMS data.

---

## Roles and Permissions

| Access type | How it works |
|---|---|
| Module-level access | Only users with HRMS access can see the module — others see nothing |
| Boundary-scoped data | Employees visible to a user are limited to those within their assigned boundary hierarchy |
| Supervisor assignment | Requires permission to modify employee reporting relationships |

---

## API Integrations

| Endpoint | Method | Purpose |
|---|---|---|
| `/{healthHrms}/employees/_search` | POST | Search employees by boundary / role / active status |
| `/{healthHrms}/employees/_create` | POST | Create employee |
| `/{healthHrms}/employees/_update` | POST | Update employee (including activate/deactivate) |
| `/{healthHrms}/employees/_count` | POST | Count employees (pagination) |
| `/{projectContextPath}/staff/v1/_search` | POST | Search project staff assignments |
| `/{projectContextPath}/staff/v1/_create` | POST | Create project staff assignment |
| `/{projectContextPath}/staff/v1/_delete` | POST | Remove project staff assignment |
| `/{projectContextPath}/v1/_search` | POST | Search projects (used in employee details to load campaign assignments) |
| `/{healthIndividualContextPath}/v1/_search` | POST | Search individuals by name/role for supervisor assignment |
| `/boundary-service/boundary-relationships/_search` | POST | Boundary-scoped employee data filtering |
| `/boundary-service/boundary-hierarchy-definition/_search` | POST | Fetch all boundary hierarchy definitions |
| `/health-attendance/v1/_search` | POST | Search attendance registers |
| `/health-attendance/attendee/v1/_delete` | POST | De-enrol an attendee from an attendance register |
| `/egov-workflow-v2/egov-wf/businessservice/_search` | POST | Workflow business service config |
| `/egov-workflow-v2/egov-wf/process/_search` | POST | Workflow process instances |
| `/filestore/v1/files` | POST | File upload |
| `/filestore/v1/files/url` | GET | Fetch file download URL |

**Context path config keys** (`window.globalConfigs.getConfig()`):
- `HRMS_CONTEXT_PATH` → HRMS service base (default: `health-hrms`)
- `PROJECT_SERVICE_PATH` → Project service base (default: `health-project`)
- `ATTENDANCE_CONTEXT_PATH` → Attendance service base (default: `health-attendance`)
- `INDIVIDUAL_CONTEXT_PATH` → Individual service base (default: `health-individual`)
- `HIERARCHY_TYPE` → Boundary hierarchy type used in search queries (default: `HIERARCHYTEST`)

---

## Hooks

All hooks are exported through `src/hooks/index.js` and registered on `Digit.Hooks.hrms`.

| Hook | File | Purpose |
|---|---|---|
| `useBoundriesFetch` | `boundaries/useFetchBoundaries.js` | Fetch boundary relationships for a given hierarchy |
| `useFetchAllBoundaryHierarchies` | `boundaries/useFetchAllHierarchies.js` | Paginated fetch of all boundary hierarchy definitions. `staleTime` defaults to 5 minutes (`config.staleTime \|\| 5 * 60 * 1000`) |
| `useHRMSCreate` | `hrms/useHRMSCreate.js` | Create employee mutation |
| `useHRMSSearch` | `hrms/useHRMSSearch.js` | Search employees. `staleTime: 0` and `gcTime: 0` to prevent stale results between consecutive searches |
| `useHRMSUpdate` | `hrms/useHRMSUpdate.js` | Update employee mutation |
| `useHRMSStaffCreate` | `hrms/useHRMSStaffCreate.js` | Assign employee to project staff |
| `useHRMSStaffDelete` | `hrms/useHRMSStaffDelete.js` | Remove employee from project staff |
| `useHRMSStaffSearch` | `hrms/useHRMSStaffSearch.js` | Search project staff assignments |
| `useHrmsEmployeeDetail` | `hrms/useHRMSEmployeeDetail.js` | Fetch employee project assignments (staff + projects) for the details screen |

---

## Localisation

Translation keys are centralised in `src/utils/i18nKeyConstants.js` (added in HCMPRE-4120, PR #4136).

| Key prefix | Where it is used |
|---|---|
| `HR_*` | Primary HRMS labels — employee fields, form headers, jurisdiction, assignment, activate/deactivate |
| `HCM_*` | Campaign-related labels and hierarchy selection labels (`HCM_HIERARCHY_TYPE_*`, `HCM_AM_*`) |
| `CORE_*` | Platform core labels — name, mobile number, password, close button |
| `CS_*` | Common service labels — file upload errors, OTP errors, email validation, inbox search |
| `EMPLOYEE_RESPONSE_*` | Success/error response messages for create and update actions |
| `ES_*` | Generic error messages |
| `TL_*` | File upload sub-heading label (reused from Trade Licence module) |
| `EGOV_HRMS_DEACTIVATIONREASON_*` | MDMS-driven deactivation reason codes |

---

## Complete Change History (v2.1)

| PR | What changed in health-hrms |
|---|---|---|
| [#3990](https://github.com/egovernments/DIGIT-Frontend/pull/3990) | Full React 19 migration — all source files created/ported. Popup and deactivate form rendering bugs fixed. |
| [#4037](https://github.com/egovernments/DIGIT-Frontend/pull/4037) | Mobile validation changed to toast. Field type changed from `"number"` to `"mobileNumber"`. |
| [#4102](https://github.com/egovernments/DIGIT-Frontend/pull/4102) | `RELEASE-NOTES.md` added to module directory. No source code changes. |
| [#4124](https://github.com/egovernments/DIGIT-Frontend/pull/4124) | `package.json` version bump. No source code changes in health-hrms. |
| [#4136](https://github.com/egovernments/DIGIT-Frontend/pull/4136) | All translation keys moved to `src/utils/i18nKeyConstants.js`. All component and page files updated to import from `I18N_KEYS`. |
| [#4151](https://github.com/egovernments/DIGIT-Frontend/pull/4151) | `package.json` version bump. No source code changes in health-hrms. |
| [#4173](https://github.com/egovernments/DIGIT-Frontend/pull/4173) | Dependency vulnerability fix — `package.json` version update only. |
| [#4194](https://github.com/egovernments/DIGIT-Frontend/pull/4194) | `RELEASE-NOTES.md` updated. No source code changes. |
