# Health HRMS 

## Overview

Health HRMS provides the web interface for managing health campaign field workers. Program administrators use it to create employee accounts, assign them to geographic boundaries, link them to supervisors, and connect them to campaigns.

Everything in the module is scoped by boundary — meaning each user only sees the employees and data that fall within the geographic area they are assigned to at login.

The module works across these data sources:

| Data source | What it powers |
|---|---|
| Boundary Management API | Geographic hierarchy list for the selection screen |
| HRMS API | Employee designations and roles used in create / edit forms |
| MDMS (egov-hrms) | Deactivation reason options in the deactivation popup |

In HCM v2.1, this is a **platform migration release** — the module has been moved from React 17 to React 19 and is now deployed under a new build variant called `payments-ui`. Three bug fixes were also applied during migration.

---

## What is this release about?

This release does not add new features. It focuses on:

1. **Platform migration** — the module has been ported from the older React 17 stack to React 19, which is the new standard across the platform.
2. **New deployment method** — HRMS is now shipped as part of the `payments-ui` build and served from a new URL path.
3. **Three bug fixes** — mobile number validation, and two popup rendering issues that were caught during migration.

---

## ⚠️ Action Required Before Upgrading

### Deploy the new `payments-ui` variant

HRMS is no longer served from the old React 17 standalone shell. You must deploy the new `payments-ui` Docker image and configure its route.

> Set up the nginx route at `/payments-ui/` when deploying the new Docker image. The old deployment path will no longer serve HRMS.

---

## What Changed

### React 19 migration

The entire module has been ported from React 17 (old build tooling) to React 19 (modern Webpack 5 build). This is an internal platform change — the screens and features work the same way for end users. No workflow changes.

---

### New deployment variant — `payments-ui`

HRMS is now bundled and deployed as part of the `payments-ui` build variant, making it independently deployable at its own path (`/payments-ui/`). Previously it was part of the legacy standalone shell.

---

## Bug Fixes

### Mobile number validation — shown as a toast instead of a blocking popup

**Before:** When a user entered an invalid mobile number while creating an employee, a blocking modal appeared — stopping all interaction until dismissed.

**After:** The validation message now appears as a small toast notification at the bottom of the screen. The form stays accessible and the user can correct the number without being blocked.

---

### Deactivate employee popup — form fields not rendering correctly

**Before:** When opening the deactivate employee popup, the form fields inside it were not rendering correctly.

**After:** Fixed. The popup now correctly displays all form fields, including the deactivation reason dropdown.

---

### Action popup — content not appearing inside the popup

**Before:** When opening the action popup, the content inside it was blank or not rendering.

**After:** Fixed. The popup now renders its content correctly.

---

## How the Module Works

### Employee management flow

```
Hierarchy selection (required every session)
  → Employee inbox (search by name, role, or boundary)
  → Create employee / View employee details
  → Assign jurisdiction / Link supervisor
  → Activate or deactivate employee
  → Confirmation screen
```

### Campaign assignment flow

```
Campaign assignment inbox
  → Select campaign → Assign or remove employees
  → Confirmation screen
```

> **Note on hierarchy selection:** Every time a user starts a new session, they must go through the hierarchy selection screen before accessing any employee data. This is intentional — it ensures the session is always scoped to the correct boundary.

> **Note on supervisor linking:** Assigning a supervisor creates an actual backend reporting relationship — it is not just a label on screen. Changes here affect backend HRMS data.

---

## How Access and Permissions Work

| Access type | How it works |
|---|---|
| Module-level access | Only users with HRMS access can see the module at all — others see nothing |
| Boundary-scoped data | Employees visible to a user are limited to those within their assigned boundary hierarchy |
| Supervisor assignment | Requires permission to modify employee reporting relationships |

---

## Localisation

Translation keys are now centralised in `src/utils/i18nKeyConstants.js`, replacing string literals that were previously scattered across components and pages.

| Key prefix | Where it is used |
|---|---|
| `HCM_` | All HRMS screen labels |
| `HR_*` | Employee-specific labels — mobile number field, deactivation reason, remarks |

---

## API Integrations

| Endpoint | Method | Service / Hook | Purpose |
|---|---|---|---|
| `/{healthHrms}/employees/_search` | POST | `HRMSService` | Search employees by boundary / role |
| `/{healthHrms}/employees/_create` | POST | `HRMSService` | Create employee |
| `/{healthHrms}/employees/_update` | POST | `HRMSService` | Update employee |
| `/{healthHrms}/employees/_count` | POST | `HRMSService` | Count employees (pagination) |
| `/{projectContextPath}/staff/v1/_search` | POST | `StaffService` | Search project staff assignments |
| `/{projectContextPath}/staff/v1/_create` | POST | `StaffService` | Create project staff assignment |
| `/{projectContextPath}/staff/v1/_delete` | POST | `StaffService` | Remove project staff assignment |
| `/{projectContextPath}/v1/_search` | POST | `StaffService` | Search projects |
| `/{healthIndividualContextPath}/v1/_search` | POST | `AttendeeService` | Search health individuals |
| `/boundary-service/boundary-relationships/_search` | POST | `BoundarySearch` | Boundary-scoped employee data filtering |
| `/boundary-service/boundary-hierarchy-definition/_search` | POST | `useFetchAllBoundaryHierarchies` | Fetch all boundary hierarchy definitions |
| `/egov-workflow-v2/egov-wf/businessservice/_search` | POST | `WorkflowService` | Workflow business service config |
| `/egov-workflow-v2/egov-wf/process/_search` | POST | `WorkflowService` | Workflow process instances |
| `/filestore/v1/files` | POST | FileStore | File upload |
| `/filestore/v1/files/url` | GET | FileStore | Fetch file download URL |

**Context path config keys** (from `window.globalConfigs.getConfig()`):
- `HRMS_CONTEXT_PATH` → HRMS service base (default: `health-hrms`)
- `PROJECT_SERVICE_PATH` → Project service base (default: `health-project`)