# Health Payments UI


## Overview

The Health Payments module manages the complete payment cycle for health campaign field workers. It covers everything from recording attendance in the field through to final bank-side payment approval.

The workflow is role-based — each user sees only the screens and actions their role allows. Four roles govern the entire bill lifecycle:

| Role | Who it's for |
|---|---|
| `PAYMENT_EDITOR` | Supervisors who record attendance and generate bills |
| `PAYMENT_REVIEWER` | Reviewers who check bills and send them for approval |
| `PAYMENT_APPROVER` | Approvers who verify attendance data and approve bills |
| `PAYMENT_APPROVER_BANK` | Bank-side staff who do the final verification and approval |

The module works from a single MDMS configuration block (`HCM.paymentsConfig`) that defines payment rules, bill periods, and which actions are allowed at each stage. **If this config is missing, the module will not load at all.**

In HCM v2.1, this module has been fully rebuilt — migrated from React 17 to React 19 — and now ships as part of the new `payments-ui` deployment variant. The entire bill management lifecycle UI is new in this release.

---

## What is this release about?

This release delivers two things together:

1. **The full bill management lifecycle UI** — all screens from attendance recording through to bank approval are new in HCM v2.1. None of these existed in the previous React 17 version.
2. **Platform migration** — the module has been moved from React 17 to React 19 and is now deployed under the `payments-ui` build variant.

It also removes the module's dependency on global config for boundary hierarchy type, and adds several attendance and bill screen fixes from a final UI/UX audit pass.

---

## ⚠️ Action Required Before Upgrading

### 1. Deploy the new `payments-ui` variant

Health Payments is no longer served from the old React 17 standalone shell. Deploy the new `payments-ui` Docker image and configure its route.

> Set up the nginx route at `/payments-ui/` when deploying. The old deployment path will no longer serve this module. Note: HRMS and PGR are also bundled in the same `payments-ui` variant.

---

### 2. Configure the four payment roles

Four new roles must be assigned to the right users in the DIGIT role-action mapping before anyone can access bill management screens.

| Role | Assign to |
|---|---|
| `PAYMENT_EDITOR` | Field supervisors who record attendance and generate bills |
| `PAYMENT_REVIEWER` | Staff who review bills before approval |
| `PAYMENT_APPROVER` | Staff who approve bills and trigger payment generation |
| `PAYMENT_APPROVER_BANK` | Bank-side staff who do the final approval |

> If a user has more than one payment role, the system automatically applies the highest-priority role.

---

### 3. Configure the MDMS payment config before deployment

The module reads all payment rules, bill periods, and allowed actions from a single MDMS master: `HCM.paymentsConfig` (schema: `PAYMENTS_MASTER_DATA`).

> **This config must be in place before deployment.** The module will block its own initialization and refuse to load if this config is not found. Note: boundary hierarchy type is no longer read from this config or from global config — it is now derived directly from the campaign/project, so no separate hierarchy configuration is needed here.

---

### 4. Configure `HCM.ATTENDANCE_CONFIG` if map view is needed

Map view in the attendance view screen is now controlled by MDMS rather than being always available.

> Set `enableMapView: true` in the `HCM.ATTENDANCE_CONFIG` schema if you want the map view button and popup to appear. It stays hidden by default.

---

## What's New

All of the following screens and features are new in HCM v2.1 — they did not exist in the previous version.

### Bill management dashboard

A role-specific dashboard that shows bills at each stage with the actions available to the logged-in user. The tabs, columns, and action buttons shown are entirely determined by the user's payment role — the same screen adapts automatically for editors, reviewers, and approvers.

---

### Attendance recording and document upload

Supervisors record attendance within their assigned boundary registers. They can also attach supporting documents (photos, sign-off sheets) at the time of recording.

---

### Bill generation

Bills are generated directly from recorded attendance data. There are two paths:

- **Standard:** Generate the bill directly from the attendance record.
- **Excel upload:** Download the bill as an Excel file, edit it, and re-upload — useful for bulk corrections.

---

### Bill detail view

A drill-down view showing the full details of a bill — individual attendees, amounts, and the current status of each record.

---

### Send for approval

Reviewers can route a bill to an approver via a dedicated popup, with notes if needed.

---

### Verify and generate payments

Approvers review and verify the attendance data behind a bill, then trigger payment generation once satisfied.

---

### Bank approval

A final approval step for bank-side staff before payment is released.

---

### Worker and attendee detail popups

Click through any worker or attendee row to see their individual record. Editors can also make inline corrections or send a record back for correction from the same popup.

---

### Map view toggle for attendance (config-driven)

The attendance view screen can now show a map of attendance locations, gated behind the `HCM.ATTENDANCE_CONFIG` MDMS master. The map button and popup only render when `enableMapView` is explicitly set to `true`.

---

### Illustrated empty state for search results

Search screens with no results now show an illustrated empty state (`UndrawPeopleSearch`) instead of a plain message.

---

## What Changed in Existing Features

### React 19 migration

The entire module has been rebuilt on React 19 with Webpack 5. End users will not notice a difference in how the screens work — this is an internal platform change.

---

### New deployment variant — `payments-ui`

The module is now bundled and deployed as part of `payments-ui`, independently served at `/payments-ui/`. It shares this build with HRMS and PGR.

---

### Screen headers and footers standardised

All bill and attendance screens have been updated to use a consistent header and footer layout. This replaces the old mixed pattern from the previous version.

---

### Attendance view reworked

The attendance view screen has been significantly restructured internally as part of the React 19 migration. The screens and data shown to users remain the same.

---

### Hierarchy type no longer read from global config

Boundary hierarchy type is no longer hardcoded from `window.globalConfigs` and `paymentsConfig` MDMS. It is now derived from `project.additionalDetails`, and the lowest boundary level is fetched from the boundary hierarchy definition API instead. Both values are passed down via a React Context (`ProviderContext`).

---

## Bug Fixes

| Issue fixed | What changed |
|---|---|
| Approve button not working | The approve action in the attendance view was not correctly wired after migration — now fixed |
| Various post-migration rendering issues | Bill inbox, manage bills, fetch bills, bill detail, Excel editing, and attendance screens all had React 19 compatibility issues that have been resolved |
| UI/UX polish across bill and attendance screens | Table styling, date range picker, empty states, and button sizing fixed across bill inbox, manage bills, verify & generate payments, and attendance screens from a final audit pass |

---

## How the Bill Lifecycle Works

```
Attendance inbox
  → Record / edit attendance  (with optional document upload)
  → Generate bill
  → Bill inbox                          [PAYMENT_EDITOR]
  → Manage bills → Send for approval    [PAYMENT_REVIEWER]
  → Verify & generate payments          [PAYMENT_APPROVER]
  → Bank approval                       [PAYMENT_APPROVER_BANK]
```

Each step is gated by the user's payment role. To change what a role can see or do at any stage, the role configuration file is updated — not individual screens.

---

## How Access and Permissions Work

| Role | What they can do |
|---|---|
| `PAYMENT_EDITOR` | Record attendance, upload supporting documents, generate bill, view bill inbox |
| `PAYMENT_REVIEWER` | Review bills, send for approval, view reviewer tabs |
| `PAYMENT_APPROVER` | Verify attendance data, approve bills, trigger payment generation |
| `PAYMENT_APPROVER_BANK` | Final bank-side approval of verified bills |

> All roles can view attendance records and download bills. A user with multiple payment roles gets the highest-priority role applied.

---

## Localisation

Translation keys are now centralised in `src/utils/i18nKeyConstants.js`, replacing string literals that were previously scattered across components and pages.

| Key prefix | Where it is used |
|---|---|
| `HCM_AM_*` | All bill management screens |
| `HCM_AM_MANAGE_BILLS` | Manage Bills tab labels |
| `HCM_AM_VERIFY_BILLS` | Verify Bills tab labels |
| `HCM_AM_REVIEW_BILLS` | Review Bills tab labels |
| `HCM_AM_NOT_VERIFIED` | Status label for unverified bills |

---

## API Integrations

| Endpoint | Method | Service | Purpose |
|---|---|---|---|
| `/{healthAttendanceContextPath}/v1/_search` | POST | `AttendanceService` | Search attendance registers |
| `/{healthAttendanceContextPath}/attendee/v1/_create` | POST | `AttendeeService` | Enroll attendee in register |
| `/{healthAttendanceContextPath}/attendee/v1/_delete` | POST | `AttendeeService` | De-enroll attendee from register |
| `/{healthIndividualContextPath}/v1/_search` | POST | `AttendeeService` | Search individuals (health workers) |
| `/{healthHrms}/employees/_search` | POST | `HRMSService` | Search employees |
| `/{projectContextPath}/v1/_search` | POST | `ProjectService` | Search projects |
| `/{projectContextPath}/staff/v1/_search` | POST | `ProjectService` | Search project staff |
| `/boundary-service/boundary-relationships/_search` | POST | `AttendanceService` | Boundary-scoped register search |
| `/boundary-service/boundary-hierarchy-definition/_search` | POST | `ProviderContext` | Fetch lowest boundary level for hierarchy (replaces global-config-based lookup) |
| `/health-expense-calculator/billing-config/v1/_create` | POST | `AttendeeService` | Create billing config (payment setup) |
| `/health-expense-calculator/billing-config/v1/_update` | POST | `AttendeeService` | Update billing config |
| `/health-expense-calculator/billing-config/v1/_search` | POST | `PaymentSetupServices` | Search billing config by project |
| `/{mdmsPath}/v2/_create/HCM.WORKER_RATES` | POST | `AttendeeService` | Create worker rate MDMS entry |
| `/{mdmsPath}/v2/_update/HCM.WORKER_RATES` | POST | `AttendeeService` | Update worker rate MDMS entry |
| `/{mdmsPath}/v2/_search/HCM.ATTENDANCE_CONFIG` | POST | `ViewAttendance` | Fetch map view visibility config |
| `/project-factory/v1/project-type/search` | POST | `useSearchCampaign` | Search campaigns (project selection screen) |
| `/egov-workflow-v2/egov-wf/businessservice/_search` | POST | `WorkflowService` | Fetch workflow business service config |
| `/egov-workflow-v2/egov-wf/process/_search` | POST | `WorkflowService` | Search workflow process instances |
| `/works-inbox-service/v2/_search` | POST | Inbox hook | Bill and attendance inbox search |
| `/filestore/v1/files` | POST | FileStore | Upload supporting documents |
| `/filestore/v1/files/url` | GET | FileStore | Fetch file download URL |

**Context path config keys** (from `window.globalConfigs.getConfig()`):
- `HEALTH_HRMS_CONTEXT_PATH` → HRMS service base (default: `health-hrms`)
- `HEALTH_ATTENDANCE_CONTEXT_PATH` → Attendance service base (default: `health-attendance`)
- `HEALTH_INDIVIDUAL_CONTEXT_PATH` → Individual service base (default: `health-individual`)
- `PROJECT_SERVICE_PATH` → Project service base (default: `health-project`)

---