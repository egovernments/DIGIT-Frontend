# Health Payments — HCM v2.1 Technical Documentation

**Module:** `@egovernments/digit-ui-module-health-payments`
**Release:** HCM v2.1
**Stack:** React 19, Webpack 5 (migrated from React 17)
**Deployed under:** `payments-ui` build variant at `/payments-ui/`
**Repository:** [egovernments/DIGIT-Frontend](https://github.com/egovernments/DIGIT-Frontend)

---

## Overview

The Health Payments module manages the complete payment cycle for health campaign field workers — from recording attendance in the field through to final bank-side payment approval. The workflow is role-based: each user sees only the screens and actions their role allows.

**In HCM v2.1, this module has been completely rebuilt.** It was migrated from React 17 to React 19 and now ships as part of the new `payments-ui` deployment variant. The entire bill management lifecycle UI is **new** in this release — none of it existed in the previous version.

---

## Migration from React 17 to React 19

**Ticket:** HCMPRE-3987
**PR:** [#3990](https://github.com/egovernments/DIGIT-Frontend/pull/3990)

The full module has been rebuilt on React 19 with Webpack 5. End users will not notice a difference in how the screens work — this is an internal platform change that enables the module to be bundled with HRMS and PGR as a single deployable unit (`payments-ui`).

**Internal changes:**
- React Query v3 → TanStack Query v5
- Build output: legacy microbundle → Webpack 5 (`dist/main.js`)
- Module now deployed at `/payments-ui/` alongside HRMS and PGR

---

## What's New in v2.1

All of the following screens and features are **new** in this release. They did not exist in the previous React 17 version.

### Attendance Registers Inbox (`PROXIMITY_SUPERVISOR`)

**Ticket:** HCMPRE-4085
**PRs:** [#4090](https://github.com/egovernments/DIGIT-Frontend/pull/4090), [#4099](https://github.com/egovernments/DIGIT-Frontend/pull/4099), [#4151](https://github.com/egovernments/DIGIT-Frontend/pull/4151), [#4158](https://github.com/egovernments/DIGIT-Frontend/pull/4158), [#4202](https://github.com/egovernments/DIGIT-Frontend/pull/4202)

Proximity supervisors select their project, then view attendance registers filtered by boundary and period. From here they can:

- View registers in **Pending** and **Approved** tabs
- Edit registers
- Search and assign attendees
- Record and edit attendance
- Upload supporting documents
- Approve or submit attendance with comments
- View comment logs on approved records

---

### Bill Inbox and Bill Generation (`CAMPAIGN_SUPERVISOR`)

**Ticket:** HCMPRE-4085
**PRs:** [#4090](https://github.com/egovernments/DIGIT-Frontend/pull/4090), [#4099](https://github.com/egovernments/DIGIT-Frontend/pull/4099), [#4102](https://github.com/egovernments/DIGIT-Frontend/pull/4102)

Campaign supervisors select a project and aggregation level, then view attendance registers grouped by boundary in **Approved** and **Pending** tabs. From here they can:

- View attendance (read-only)
- Generate bills from approved attendance
- Access "My Bills" to view bill payment details and download bills

---

### Bill Detail View

**Ticket:** HCMPRE-4085
**PR:** [#4090](https://github.com/egovernments/DIGIT-Frontend/pull/4090)

A drill-down screen showing individual attendees, amounts, and the current status of each record within a bill. Accessible from My Bills for `CAMPAIGN_SUPERVISOR`.

---

### Payment Setup (`CAMPAIGN_MANAGER`)

**Ticket:** HCMPRE-4085
**PRs:** [#4090](https://github.com/egovernments/DIGIT-Frontend/pull/4090), [#4099](https://github.com/egovernments/DIGIT-Frontend/pull/4099)

Managers configure billing settings for a campaign:

- Select campaign
- Select billing cycle — options are loaded from MDMS (`HCM-BILLING-CONFIG-PAYMENT-SETUP.BillingCycle`); when `CUSTOM` is selected, an additional days-input field appears
- Configure role-based wages
- Submit billing configuration

---

### Map View Toggle for Attendance (Config-Driven)

**Tickets:** HCMPRE-4085, HCMPRE-4074
**PRs:** [#4090](https://github.com/egovernments/DIGIT-Frontend/pull/4090), [#4108](https://github.com/egovernments/DIGIT-Frontend/pull/4108)

The attendance view screen can now show a map of attendance locations. This is controlled by MDMS rather than being always available — the map button and popup only render when `enableMapView: true` is set in `HCM.ATTENDANCE_CONFIG`.

**Configuration required:** Set `enableMapView: true` in `HCM.ATTENDANCE_CONFIG` MDMS schema if map view is needed. It is hidden by default.

---

### Localization Keys Centralized

**Ticket:** HCMPRE-4120
**PRs:** [#4124](https://github.com/egovernments/DIGIT-Frontend/pull/4124), [#4136](https://github.com/egovernments/DIGIT-Frontend/pull/4136)

All plain-literal `t()` translation keys across the module have been moved to a central constant file at `src/utils/i18nKeyConstants.js`, organized by feature category. Dynamic template-literal keys (e.g. `` t(`HCM_AM_${action}_SUCCESS`) ``) remain inline at their call sites.

---

### Illustrated Empty State for Search Results

Search screens with no results now show an illustrated empty state (`SearchResultsPlaceholder`) instead of a plain text message.

---

## Changes to Existing Features

### Hierarchy Type No Longer Read from Global Config

**Ticket:** HCMPRE-4085
**PRs:** [#4090](https://github.com/egovernments/DIGIT-Frontend/pull/4090), [#4170](https://github.com/egovernments/DIGIT-Frontend/pull/4170)

Boundary hierarchy type is no longer sourced from `window.globalConfigs` or `paymentsConfig` MDMS. During module initialization (`PaymentsInitialization.js`), the module:

1. Fetches the projects the logged-in user is staff on
2. Reads `project.additionalDetails.hierarchyType` from the first matched project
3. Calls the Boundary Hierarchy Definition API (`/boundary-service/boundary-hierarchy-definition/_search`) to resolve the sorted hierarchy chain
4. Derives `lowestBoundaryLevel` as the third item in the sorted chain (or the last item if the chain is shorter)

Both `hierarchyType` and `lowestBoundaryLevel` are passed to all screens via `ProviderContext`.

**Impact:** Remove any hierarchy-type configuration from `paymentsConfig` MDMS — it is no longer read.

---

### Screen Headers and Footers Standardised

All bill and attendance screens now use a consistent header and footer layout, replacing the old mixed pattern from the React 17 version.

---

## Bug Fixes

| Issue | PR |
|---|---|
| Approve button not working after React 19 migration | [#4090](https://github.com/egovernments/DIGIT-Frontend/pull/4090) |
| Various post-migration rendering issues: bill inbox, manage bills, fetch bills, bill detail, Excel editing, attendance screens | [#4090](https://github.com/egovernments/DIGIT-Frontend/pull/4090) |
| Payments URL issue for commodity shipment screens | [#4099](https://github.com/egovernments/DIGIT-Frontend/pull/4099) |
| Table styling, date range picker, empty states, and button sizing issues across bill and attendance screens | [#4099](https://github.com/egovernments/DIGIT-Frontend/pull/4099) |
| Payment screen button not working | [#4102](https://github.com/egovernments/DIGIT-Frontend/pull/4102) |
| UI/UX fixes for attendance screens (table styling, spacing, layout) | [#4102](https://github.com/egovernments/DIGIT-Frontend/pull/4102) |
| Multi-project facility filtering: transactions not showing for users with multiple projects | [#4108](https://github.com/egovernments/DIGIT-Frontend/pull/4108) |
| Custom reports CSS fixes and remaining localization keys not yet centralized | [#4124](https://github.com/egovernments/DIGIT-Frontend/pull/4124) |
| Remaining inline localization keys moved to constants file | [#4136](https://github.com/egovernments/DIGIT-Frontend/pull/4136) |
| Attendance fixes and SVG asset version conflict | [#4151](https://github.com/egovernments/DIGIT-Frontend/pull/4151) |
| Final audit fixes across attendance, reports, and hierarchy screens | [#4158](https://github.com/egovernments/DIGIT-Frontend/pull/4158) |
| Header missing in View Register screen | [#4202](https://github.com/egovernments/DIGIT-Frontend/pull/4202) |
| Crash and state management issues in campaign state; boundary selection performance with 50k+ boundaries | [#4170](https://github.com/egovernments/DIGIT-Frontend/pull/4170) |
| Dependency version bump to address security vulnerability | [#4173](https://github.com/egovernments/DIGIT-Frontend/pull/4173) |

---

## Configuration Required Before Deploying

### 1. Deploy the `payments-ui` Variant

Health Payments is no longer served from the old React 17 standalone shell. Deploy the new `payments-ui` Docker image and configure the nginx route at `/payments-ui/`.

> HRMS and PGR are also bundled in the same `payments-ui` image.

### 2. Configure Payment Roles

Assign the following roles in the DIGIT role-action mapping before going live:

| Role | Assign to |
|---|---|
| `PROXIMITY_SUPERVISOR` | Field supervisors who record and edit attendance |
| `CAMPAIGN_SUPERVISOR` | Supervisors who access the bill inbox and generate bills |
| `CAMPAIGN_MANAGER` | Managers who configure payment setup |

### 3. Configure MDMS — `HCM.paymentsConfig`

The module reads all payment rules, bill periods, and allowed actions from the MDMS master `HCM.paymentsConfig` (schema: `PAYMENTS_MASTER_DATA`).

> **This config must be in place before deployment.** The module blocks its own initialization and refuses to load if this config is missing.

### 4. Configure MDMS — `HCM-BILLING-CONFIG-PAYMENT-SETUP.BillingCycle`

The billing cycle options shown in Payment Setup are loaded from this MDMS master. Include all frequency options (e.g. weekly, biweekly, monthly, custom) here. The `CUSTOM` code is special-cased in the UI to display a days-input field.

### 5. Configure `HCM.ATTENDANCE_CONFIG` (Optional — for Map View)

If map view in the attendance screen is needed, set `enableMapView: true` in the `HCM.ATTENDANCE_CONFIG` MDMS schema. It is hidden by default.

---

## Bill Lifecycle Flow

```text
Attendance Registers Inbox                          [PROXIMITY_SUPERVISOR]
  → Project Selection
  → View Registers (Pending / Approved tabs)
  → Edit Register → Search & Assign Attendees
  → View Attendance → Record/Edit Attendance
  → Upload Supporting Documents
  → Approve/Submit Attendance (with comments)
  → View Comment Logs (on approved records)

Bill Inbox                                          [CAMPAIGN_SUPERVISOR]
  → Project + Aggregation Level Selection
  → View Attendance Registers (Approved / Pending tabs)
  → View Attendance (read-only)
  → Generate Bill (from approved attendance)
  → My Bills → View Bill Details → Download Bills

Payment Setup                                       [CAMPAIGN_MANAGER]
  → Select Campaign
  → Select Billing Cycle (MDMS-driven; CUSTOM shows days-input)
  → Configure Role-Based Wages
  → Submit Billing Configuration
```

---

## Roles and Permissions

| Role | Root Screen | What they can do |
|---|---|---|
| `PROXIMITY_SUPERVISOR` | Attendance Registers Inbox | Select project, view registers, edit register, search & assign attendees, record/edit attendance, upload documents, approve/submit attendance, view comment logs |
| `CAMPAIGN_SUPERVISOR` | Bill Inbox | Select project + aggregation level, view registers, view attendance (read-only), generate bills, access My Bills, view bill details, download bills |
| `CAMPAIGN_MANAGER` | Payment Setup | Select campaign, select billing cycle, configure role-based wages, submit configuration |

---

## API Integrations

### Attendance Service

| Endpoint | Method | Purpose |
|---|---|---|
| `/{ATTENDANCE_CONTEXT_PATH}/v1/_search` | POST | Search attendance registers |
| `/{ATTENDANCE_CONTEXT_PATH}/attendee/v1/_create` | POST | Enroll attendee in register |
| `/{ATTENDANCE_CONTEXT_PATH}/attendee/v1/_delete` | POST | De-enroll attendee |

### Individual / HRMS Service

| Endpoint | Method | Purpose |
|---|---|---|
| `/{INDIVIDUAL_CONTEXT_PATH}/v1/_search` | POST | Search individuals (health workers) |
| `/{HRMS_CONTEXT_PATH}/employees/_search` | POST | Search employees |

### Project Service

| Endpoint | Method | Purpose |
|---|---|---|
| `/{PROJECT_CONTEXT_PATH}/v1/_search` | POST | Search projects |
| `/{PROJECT_CONTEXT_PATH}/staff/v1/_search` | POST | Search project staff |

### Boundary Service

| Endpoint | Method | Purpose |
|---|---|---|
| `/boundary-service/boundary-hierarchy-definition/_search` | POST | Fetch boundary hierarchy definition (resolves lowestBoundaryLevel at init) |
| `/boundary-service/boundary-relationships/_search` | POST | Fetch boundary tree for a national-level project (used during init to build hierarchy order) |

### Expense / Bill Service

| Endpoint | Method | Purpose |
|---|---|---|
| `/{EXPENSE_CONTEXT_PATH}/bill/v1/_search` | POST | Search bills |
| `/{EXPENSE_CONTEXT_PATH}/bill/v1/_update` | POST | Update bill header |
| `/{EXPENSE_CONTEXT_PATH}/bill/v1/_bulkupdatestatus` | POST | Bulk update bill status |
| `/{EXPENSE_CONTEXT_PATH}/bill/v1/billdetails/_update` | POST | Update individual bill line items |
| `/{EXPENSE_CONTEXT_PATH}/bill/v1/billdetails/_generateTemplate` | POST | Download bill as editable Excel template |
| `/{EXPENSE_CONTEXT_PATH}/bill/v1/billdetails/_uploadTemplate` | POST | Upload edited Excel bill template |
| `/{EXPENSE_CONTEXT_PATH}/bill/v1/report/_generate` | POST | Generate transaction report |
| `/{EXPENSE_CONTEXT_PATH}/bill/v1/report/_search` | POST | Poll report generation status |
| `/{EXPENSE_CONTEXT_PATH}/v1/bill/details/status/_update` | POST | Update status on individual bill detail rows |
| `/{EXPENSE_CONTEXT_PATH}/v1/bill/_verify` | POST | Verify bill |
| `/{EXPENSE_CONTEXT_PATH}/v1/payment/_transfer` | POST | Initiate payment transfer to bank |
| `/{EXPENSE_CONTEXT_PATH}/v1/task/_status` | POST | Poll async task status (verify / payment) |

### Billing Config (Expense Calculator)

| Endpoint | Method | Purpose |
|---|---|---|
| `/health-expense-calculator/billing-config/v1/_create` | POST | Create billing config for a campaign |
| `/health-expense-calculator/billing-config/v1/_update` | POST | Update billing config |
| `/health-expense-calculator/billing-config/v1/_search` | POST | Search billing config by project |

### Muster Roll Service

| Endpoint | Method | Purpose |
|---|---|---|
| `/{MUSTER_ROLL_CONTEXT_PATH}/v1/_search` | POST | Search muster roll (attendance summary for bill inbox table) |

### Workflow, File Store, MDMS

| Endpoint | Method | Purpose |
|---|---|---|
| `/egov-workflow-v2/egov-wf/businessservice/_search` | POST | Workflow business service config |
| `/egov-workflow-v2/egov-wf/process/_search` | POST | Workflow process instances |
| `/works-inbox-service/v2/_search` | POST | Bill and attendance inbox search |
| `/filestore/v1/files` | POST | Upload supporting documents |
| `/filestore/v1/files/url` | GET | Fetch file download URL |
| `/{MDMS_CONTEXT_PATH}/v2/_search` | POST | Fetch MDMS data (billing cycles, map view config, Kibana config) |

**Context path config keys** (read via `window.globalConfigs.getConfig()`):

| Config key | Default value | Used for |
|---|---|---|
| `HRMS_CONTEXT_PATH` | `health-hrms` | HRMS employee search |
| `ATTENDANCE_CONTEXT_PATH` | `health-attendance` | Attendance registers and attendee enroll/de-enroll |
| `INDIVIDUAL_CONTEXT_PATH` | `health-individual` | Individual (health worker) search |
| `PROJECT_CONTEXT_PATH` | `health-project` | Project search and staff lookup (used in init and payment setup) |
| `PROJECT_SERVICE_PATH` | `health-project` | Project search (used in `urls.js`; functionally same as `PROJECT_CONTEXT_PATH`) |
| `EXPENSE_CONTEXT_PATH` | `health-expense` | Bill search, update, verify, payment transfer, reporting |
| `EXPENSE_CALCULATOR_CONTEXT_PATH` | `health-expense-calculator` | Billing config CRUD |
| `MUSTER_ROLL_CONTEXT_PATH` | `health-muster-roll` | Muster roll (attendance summary) search |
| `MDMS_CONTEXT_PATH` | `mdms-v2` | General MDMS v2 queries |
| `BOUNDARY_CONTEXT` | `boundary-service/boundary-relationships/_search?` | Boundary relationship search (legacy path used in urls.js) |

---

## Localisation

Translation keys are centralised in `src/utils/i18nKeyConstants.js` (added in HCMPRE-4120).

All keys in this module use the `HCM_AM_` prefix. The constants file organises keys into categories by feature:

| Category in `I18N_KEYS` | Covers |
|---|---|
| `COMMON` | Shared keys used across 2 or more screens |
| `COMPONENTS_BILLS` | Bill inbox, manage bills, My Bills, verify/generate payments |
| `COMPONENTS_ATTENDANCE` | Attendance inbox, edit register, attendee popup, document upload |
| `COMPONENTS_APPROVAL_POPUPS` | Send for approval, send for edit, approve comment popups |
| `PAYMENT_SETUP` | Payment setup page and wage table component |
| `COMPONENTS_MISC` | Campaign card, payments card, date range picker, search placeholder |
| `CONFIGS` | `config/UIcustomizations` (attendee inbox column config) |
| `PAGES_BILLS` | Bill pages: EditBillOnExcel, bill_payment_details, manage_bills, my_bills, verify_generate_payments, upload_and_fetch_bills, fetch_bills |
| `PAGES_ATTENDANCE` | EditRegister, ViewAttendance, attendance_inbox pages |
| `PAGES_PROJECT_SELECTION` | Project selection and aggregation selection page |
| `PAGES_NAVIGATION` | Breadcrumb labels in pages/employee/index.js |
| `UTILS` | Pagination helpers (rows per page, "of" label) |

Dynamic keys built from template literals (e.g. `` t(`HCM_AM_${action}_SUCCESS`) ``) are not listed in `i18nKeyConstants.js` and remain inline at their call sites.
