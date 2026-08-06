# HCM Frontend — Complete Release Notes
**New features, enhancements, bug fixes, and migration instructions across all modules**

---

**Release:** HCM-v2.1
**Release Date:** June 2026
**Previous Release:** [HCM-v2.0](https://github.com/egovernments/DIGIT-Frontend/releases/tag/HCM-v2.0)
**Repository:** [egovernments/DIGIT-Frontend](https://github.com/egovernments/DIGIT-Frontend)

---

## Release Summary

HCM-v2.1 is a significant feature release accompanied by a platform modernisation pass. It delivers new campaign planning capabilities, a new analytics section for field worker activity, a fully rebuilt Payments module, and migrates HRMS, PGR, and Payments from the React 17 legacy stack to React 19 under a new independently deployable `payments-ui` variant.

| Module | Nature of change |
|---|---|
| Campaign Manager | New features: multi-hierarchy selection, Commodity Management, Attendance Register Setup |
| Health DSS | New features: User Activity Tracking, Custom Reports, live report status |
| Health Payments | Fully rebuilt module with complete bill lifecycle UI; React 19 migration |
| Health HRMS | Platform migration only (React 17 → React 19); three bug fixes |
| Complaints Management (PGR) | Platform migration only (React 17 → React 19); three bug fixes |

---

## What's in This Release — At a Glance

**New deployable variant:**
- `payments-ui` — independently deployable frontend serving Payments, HRMS, and PGR at `/payments-ui/`

**New features:**
- Multi-hierarchy boundary selection in campaign setup
- Commodity Management: stock dashboard, bulk stock upload, shipment tracking
- Attendance Register Setup flow within campaign workflow
- User Activity Tracking section in the DSS analytics dashboard
- Custom Reports: MDMS-configured, campaign-scoped reports with live progress tracking
- Full bill lifecycle UI: attendance → bill generation → verification → bank approval

**Changed behaviour:**
- Hierarchy selection is now locked once a campaign status becomes "created"
- Unified campaign Excel sheet always on (toggle removed)
- PGR hierarchy now sourced from MDMS instead of global config
- `useSearchCampaign` hook moved from `Digit.Hooks.campaign` to `Digit.Hooks.DSS`

**Removed:**
- `@cyntler/react-doc-viewer` dependency (security vulnerability)

---

## ⚠️ Action Required Before Upgrading

Complete all of the following before deploying HCM-v2.1.

### 1. Deploy the new `payments-ui` Docker variant

Health Payments, HRMS, and Complaints Management (PGR) are no longer served from the old React 17 standalone shells. All three now ship in a single new Docker image.

> Configure the nginx route at `/payments-ui/` when deploying. The old deployment paths will no longer serve these modules.

---

### 2. Configure payment roles in DIGIT role-action mapping

Assign the following roles before going live with the Payments module:

| Role | Assign to |
|---|---|
| `PROXIMITY_SUPERVISOR` | Field supervisors who record and edit attendance |
| `CAMPAIGN_SUPERVISOR` | Supervisors who access the bill inbox and generate bills |
| `CAMPAIGN_MANAGER` | Managers who configure payment setup |

---

### 3. Configure MDMS masters before deployment

| MDMS master | Required for | Notes |
|---|---|---|
| `HCM.paymentsConfig` (schema: `PAYMENTS_MASTER_DATA`) | Health Payments | **Module blocks its own initialization if this is missing** |
| `HCM-BILLING-CONFIG-PAYMENT-SETUP.BillingCycle` | Payment Setup screen | Billing cycle options (weekly, biweekly, monthly, custom) |
| `HCM.ATTENDANCE_CONFIG` | Map view in attendance | Optional — set `enableMapView: true` to enable map |
| `PGR.HierarchySelectedForPGR` | Complaints Management | Required for PGR hierarchy resolution |
| Commodity management schemas | Commodity Management screens | Required before enabling commodity screens |

---

### 4. Set up Elasticsearch before enabling User Activity Tracking (DSS)

The User Activity Tracking section in the DSS dashboard pulls all its data from Elasticsearch. If the index is not set up before you deploy, the section will silently fail to load — no error message will appear.

> Make sure Elasticsearch is deployed and its index is configured before enabling this section.

---

### 5. Update the campaign search hook reference (DSS integrations)

If any of your code calls `Digit.Hooks.campaign.useSearchCampaign`, rename it to:

```text
Digit.Hooks.DSS.useSearchCampaign
```

The DSS version only sets `gcTime: 0`, whereas the previous campaign version also set `staleTime: 0` and `refetchOnMount: "always"`. If your code relies on those options, pass them explicitly via the `config` parameter.

---

### 6. Add `HIERARCHY_TYPE` to `globalConfig.js` in all deployment variants

Required for multi-hierarchy campaigns to function correctly.

```js
// Default value:
HIERARCHY_TYPE: "ADMIN"
```

Affects: Campaign Manager, Payments, HRMS, PGR.

---

### 7. Remove references to `@cyntler/react-doc-viewer`

This dependency has been removed due to a known security vulnerability. Remove any references to it in implementation-level customisations.

---

## Campaign Manager

### Overview

Campaign Manager provides the full campaign lifecycle — from creating a campaign and configuring the mobile app, to uploading boundary and beneficiary data, managing cycles and delivery rules, and setting up attendance registers.

In HCM v2.1, it gains three major new capabilities:
- **Commodity Management** — track warehouse stock, create shipments, upload bulk stock transactions
- **Attendance Register Setup** — post-creation flow to configure registers within the campaign workflow
- **Multi-hierarchy boundary selection** — hierarchy type is now chosen at the start of campaign creation

---

### What's New

#### Multi-hierarchy selection step

A new **step 4 (the final step)** has been added to the initial campaign creation wizard. Users select the boundary hierarchy type (e.g., administrative vs. health facility hierarchy) as the last step before the campaign draft is saved.

- Available hierarchy types are pulled from the Boundary Management API. Each card shows the hierarchy's boundary levels and a tag indicating whether boundary data is already loaded.
- The selection is saved to the campaign store (`campaign.hierarchy` in Redux, persisted to IndexedDB via the `CAMPAIGN_APP_STATE` key) and used by all subsequent steps in the wizard.
- While the campaign is in **draft state**, hierarchy can still be changed from the campaign details screen via an Edit button. If boundary selections or uploaded files already exist, a confirmation popup appears before switching (dependent data is cleared).
- Once the campaign status becomes **"created"**, the hierarchy edit button is hidden and the hierarchy is locked — it cannot be changed.

---

#### Campaign state consolidation and boundary selection performance

**State consolidation:**
- Reduced from 16 IndexedDB keys and 7 Redux slices down to 1 IndexedDB key and 4 slices
- Duplicate keys (`FORM_DATA`, `ADMIN_SETUP`, `ADMIN_UPLOAD`) merged into a single `campaign.formData`
- Single debounced write-back to IndexedDB via a new `CAMPAIGN_APP_STATE` key

**Boundary selection performance (50k+ boundaries):**
- Replaced O(n²) tree walks and child-boundary lookups with `Map`/`Set`-based indexes
- Memoized filtered option lists that were previously recomputed on every render
- Added a loader overlay (via `useTransition`) during heavy selection processing (e.g. "Select All")

**Reliability fixes:**
- Fixed a crash in the delivery setup screen caused by a nested Redux Provider shadowing the campaign store
- Fixed stale/incorrect campaign data appearing across create, update, and clone flows
- Fixed the boundary selection page issuing an unnecessary empty localization search call

---

#### Attendance Register Setup

After a campaign is created, users can now set up attendance registers without leaving the campaign workflow. The flow uses a hub screen (`SetupAttendanceScreen`) as the entry point, from which users navigate to register creation and user mapping via separate routes.

| Screen / File | Purpose |
|---|---|
| `SetupAttendanceScreen` | Hub entry screen — initiates the register setup process |
| `CreateRegistersScreen` | Multi-step flow to define and create attendance registers |
| `AttendanceUploadScreen` | Upload attendance data via Excel |
| `MapAttendeesScreen` | Map attendees to registers |
| `MapUsersToRegistersScreen` | Assign users to specific registers |
| `RegisterDetailsScreen` | Review register configuration |
| `ReportsConfigurationScreen` | Configure automated report generation (report type and frequency) |

Each screen reads and writes directly to the campaign API. Navigation uses `campaignName`, `campaignNumber`, and `tenantId` as query parameters.

---

#### Commodity Management

A new module for tracking campaign stock and warehouse transactions. Accessible from the campaign home screen via a new dashboard card (shown only for commodity campaigns).

**Dashboard tabs:**

| Tab | What it shows |
|---|---|
| Stock Summary | Current stock levels across warehouses for the selected campaign |
| Pending Transactions | Stock transactions awaiting processing |
| Transaction Summary | Historical summary of all stock transactions |

**Additional screens:**

| Screen | What it does |
|---|---|
| Bulk stock upload | Upload multiple stock transactions at once via Excel |
| Create shipment popup | Create a new shipment scoped to a warehouse |
| Edit shipment popup | Edit an existing shipment |

**Flow:**
```text
Campaign home → Commodity card → Select campaign → Commodity dashboard
  → Stock Summary / Pending Transactions / Transaction Summary (tabs)
  → Create shipment or Bulk upload stock → Edit shipment
```

> Stock data is pulled from Kibana / Elasticsearch. All commodity operations are scoped to the selected campaign and boundary.

---

### What Changed in Existing Features

#### Unified campaign Excel sheet — always on

The toggle that enabled multi-sheet Excel uploads has been removed. Multi-sheet upload is now the default for all campaigns.

---

#### Clone campaign — hierarchy now carried over correctly

When cloning an existing campaign, the source campaign's hierarchy type is now correctly copied to both the UI state and the API call. Previously, cloned campaigns could end up with the wrong hierarchy.

---

#### Commodity Management — hierarchy type no longer sourced from MDMS

Commodity screens now derive hierarchy type directly from the campaign rather than an MDMS-configured schema, removing a separate configuration dependency.

---

#### Stock calculations — duplicate entries removed

`RECEIPT`, `EXCESS`, and `LESS` stock entries were being double-counted alongside `ISSUED`/`ACCEPTED` records, inflating totals. These entry types are now excluded from stock balance and summary calculations. Stock Summary also gains a **Total Accepted** figure.

---

#### Persistent validation status on file upload

`NewUploadData` now shows a persistent `AlertCard` below the upload section summarising validation results (success / warning / error), which stays visible until a new file is uploaded, the file is removed, or validation restarts. When validation fails, the card displays the API error code to help diagnose the issue.

---

### Bug Fixes

| Issue fixed | Details |
|---|---|
| Stale campaign data on update screen | Old data was shown instead of the latest campaign state |
| Template polling timeout | Polling interval was too short, causing premature timeouts |
| Stale data when switching hierarchy | Hierarchy, name, boundary, loader, and cycle display all refreshed incorrectly |
| Clone campaign sent wrong hierarchy to API | Now correctly passes the source hierarchy |
| Multi-hierarchy API call and boundary propagation bugs | Fixed propagation of selected hierarchy through the boundary data flow |
| Delivery Rules not applied on final submit | Rules were being dropped at the last step |
| Tab overflow in campaign setup layout | Layout tabs overflowed on smaller screens |
| Delivery summary not shown correctly on preview | Summary rendered incorrectly on the review screen |
| "Show Category" missing in flow search panel | Filter option was not appearing |
| Blank upload screen | Caused by a missing `customProps.type` value |
| Step navigation skipping steps incorrectly | Custom MDMS logic was incorrectly filtering step navigation |
| Shipment popup used wrong project for multi-project users | Now uses selected project ID instead of defaulting to first |
| Commodity facility filtering broke for multi-project users | Selected project now read from URL/session storage |
| `RECEIPT`/`EXCESS`/`LESS` transactions showed "N/A" status | Now shown as "Received" |
| Validation toast showed blank text when translation was missing | Falls back to raw field name |
| Field matching in App Configuration updated wrong field | Matching now uses field name + key together |
| Checklist search toast, View Boundary pagination, alert action popup title issues | Fixed |
| Hydration guard missing in campaign store | Stale campaign data could pre-fill "create from scratch" forms across SPA navigation |
| MultiSelectDropdown scroll position | Reset correctly after selection |
| Delivery-rule tab shown unnecessarily | Tab removed when campaign has only 1 cycle and 1 delivery |

---

### How Access and Permissions Work

| Role | What they can do |
|---|---|
| All authenticated employees | View campaign list and campaign details |
| System administrator | Retry a failed campaign creation |
| Campaign-scoped users | Create or update campaigns within their assigned boundary scope |

Role-based access for campaign actions is configured via MDMS — not hardcoded.

---

### Localisation

All translation keys are centralised in `src/utils/i18nKeyConstants.js` under the `I18N_KEYS` constant.

| Category | Key namespace |
|---|---|
| Common | `I18N_KEYS.COMMON` |
| Campaign creation | `I18N_KEYS.CAMPAIGN_CREATE` |
| Commodity Management | `I18N_KEYS.COMMODITY_MANAGEMENT` |
| App Configuration | `I18N_KEYS.APP_CONFIGURATION` |

New keys added in HCM v2.1 for Commodity Management, Hierarchy Selection, and Attendance Register Setup.

---

### API Integrations

| Endpoint | Method | Hook / Service | Purpose | Status |
|---|---|---|---|---|
| `/project-factory/v1/project-type/search` | POST | `useSearchCampaign` | Search campaigns | Existing |
| `/project-factory/v1/project-type/create` | POST | `createCampaignService` | Create campaign | Existing |
| `/project-factory/v1/project-type/update` | POST | `updateCampaignService` | Update campaign | Existing |
| `/project-factory/v1/data/_search` | POST | `useProcessData` | Poll campaign data processing status | Existing |
| `/boundary-service/boundary-relationships/_search` | GET | `useBoundaryRelationshipSearch` | Fetch boundary relationships | Existing |
| `/dashboard-analytics/dashboard/getChartV2` | POST | `useKibanaStockSearch`, `useWarehouseManagerSync` | Commodity stock balance and warehouse sync (Kibana-backed) | **New** |
| `/stock/v1/_search` | POST | `useStockSearch`, `useBatchStockCreation` | Search and verify stock records | **New** |
| `/stock/v1/bulk/_create` | POST | `useBatchStockCreation` | Batch-create stock transaction records | **New** |
| `/excel-ingestion/v1/data/process/_validation` | POST | `useProcessData` | Validate uploaded attendance register Excel | **New** |
| `/excel-ingestion/v1/data/process/_search` | POST | `useProcessData` | Poll Excel ingestion processing status | **New** |
| `/project-factory/v2/data/_process` | POST | `useProcessData` | Trigger campaign data processing (v2 endpoint) | **New** |

**Context path config keys** (from `window.globalConfigs.getConfig()`):
- `MDMS_V2_CONTEXT_PATH` → MDMS v2 base path (default: `mdms-v2`)
- `PROJECT_SERVICE_PATH` → project-factory base (default: `health-project`)

---

## Health DSS

### Overview

The Health DSS module provides the analytics and reporting dashboard for health campaign program managers. It gives teams a single place to monitor campaign KPIs, explore data by geography and date range, and drill into field-level activity.

In HCM v2.1, the dashboard gains two new capabilities: **User Activity Tracking** and **Custom Reports**. The module has also been **migrated from React 17 to React 19**.

---

### What's New

#### User Activity Tracking

A new section added to the main L2 dashboard. It shows field worker activity data pulled from multiple sources.

| Component | What it does |
|---|---|
| Activity metrics cards | Summary indicators showing overall field worker activity across the campaign |
| Per-user activity table | Lists each field worker with their individual activity data |
| User profile popup | Click any row to open a detailed activity view for that worker |

**Flow:**
```text
L2 Dashboard → User Activity Section → Metrics cards + Table → Click a user → Profile popup
```

> `useSimpleElasticsearch` and `useUserTrackingData` query Elasticsearch directly via Kibana proxy. `useUserActivityData` fetches activity metrics through `Digit.Hooks.DSS.useGetChartV2` (the dashboard analytics endpoint), not ES directly. There is no fallback if Elasticsearch is unavailable — the section silently fails to load.

---

#### Custom Reports

Program managers can now access campaign-scoped reports directly from the dashboard.

| Page | What it does |
|---|---|
| Reports list page | Click "View Reports" on a campaign row to see all reports available for that campaign, filtered by project type |
| Report detail page | Select a report to open the full report for that campaign |

**Flow:**
```text
Campaign row → "View Reports" link → Reports list page → Select a report → Report detail page
```

> The reports list is populated from MDMS based on the campaign's project type.

---

#### Live report status tracking

While a custom report is generating, the Report Detail page shows in-progress runs as cards with a **live progress bar and percentage**. When a run completes, it automatically moves to the completed reports list — no page reload needed.

- A pre-flight check (`checkExistingCustomReport`) runs before triggering a report to detect whether a completed, in-progress, or failed run already exists for the same campaign, report, and date range — preventing duplicate triggers. The result is shown as a popup with context-specific actions (download existing, retry after cooldown, or close).
- Completed report cards show the triggered time in the viewer's **local time**.
- Progress polling runs only while a report is active and stops automatically when no runs remain in progress (5-second polling interval).

---

#### New Hook: `useSearchCampaign` (DSS-owned)

A new DSS-owned version of the campaign search hook is available as `Digit.Hooks.DSS.useSearchCampaign`. It queries the project factory search API and is used internally by the Custom Reports flow.

> This hook only sets `gcTime: 0`. The previous campaign version also set `staleTime: 0` and `refetchOnMount: "always"` — pass these explicitly if your code depends on them.

---

### What Changed in Existing Features

#### React 19 migration

The module has been ported from React 17 + microbundle-crl to React 19 + Webpack 5. End users will not notice a difference. Internal changes:
- React Query v3 → TanStack Query v5
- React Router v5 → React Router v6
- Build output: `dist/index.js` (CJS, microbundle) → `dist/main.js` (ESM, Webpack 5)
- Web Worker for Elasticsearch queries compiled via Webpack worker loader

---

#### Dashboard date range — now supports both old and new formats

The L2 dashboard date range logic now handles two campaign date formats:
- **Old format** — nested campaign object `{ [projectType]: [{ startDate, endDate }] }`
- **New format** — flat campaign object with `startDate` and `endDate` directly

If a descendant date range is saved in session storage for the active boundary, it overrides the campaign-level dates.

---

#### Banner card — new sync-status control

A new `nonSync` option added to the banner card component. Set to `true` to hide the sync-status indicator.

---

#### Excel export added

An Excel library (`xlsx ^0.18.5`) has been added to support exporting report data from the Custom Reports flow.

---

### Bug Fixes

| Issue fixed | Details |
|---|---|
| Newly generated reports required navigating away and back to appear | The in-progress polling hook was reading pre-select query data, so its refetch interval never engaged. Reports now update live via 5-second polling while a report is in progress. |
| Dashboard inbox Search button and loader centering | Fixed during final audit pass |

---

### How Access and Permissions Work

| Access type | How it works |
|---|---|
| Dashboard card visibility | The DSS dashboard card only appears if the logged-in user has the required privilege |
| Data scope | All dashboard data is automatically filtered to the geographic boundaries the user is assigned to |

---

### Localisation

Translation keys are centralised in `src/utils/i18nKeyConstants.js`. The previous per-component `UserActivityTracking/localizationKeys.js` file has been removed — its keys were moved into the shared constants file.

New keys added for User Activity Tracking labels, Custom Reports screens, and report pipeline stage labels (`HCM_REPORT_STATUS_*`).

---

### API Integrations

| Endpoint | Method | Hook / Service | Purpose | Status |
|---|---|---|---|---|
| `/dashboard-analytics/dashboard/getChartV2` | POST | `useGetChartV2`, `useUserActivityData` | Dashboard KPI charts, trend data, user activity metrics | Existing (new viz codes in v2.1) |
| `/health-project/v1/_search` | POST | `ProjectService`, `useProjectSearch` | Search campaigns / projects | Existing |
| `/project-factory/v1/project-type/search` | POST | `useSearchCampaign` | Campaign search (moved to `Digit.Hooks.DSS.useSearchCampaign`) | Existing |
| `{origin}/{kibanaPath}?path=%2F{index}%2F_search&method=POST` | POST | `useSimpleElasticsearch`, `useUserTrackingData` | Elasticsearch queries via Kibana proxy | **New** |
| `/airflow-trigger-api/api/reports-in-progress` | POST | `useReportsInProgress` | Poll status of in-progress custom reports (5s interval while active) | **New** |
| `/airflow-trigger-api/api/reports-check-existing` | POST | `checkExistingCustomReport` | Pre-flight duplicate-run check before triggering a report | **New** |

**Kibana config keys** (from `window.globalConfigs.getConfig("KIBANA")`):
- `kibanaPath` — Kibana console proxy path (default: `kibana/api/console/proxy`)
- `userSyncIndex` — ES user sync index (default: `user-sync-index-v1`)
- `projectStaffIndex` — ES project staff index (default: `project-staff-index-v1`)
- `username` / `password` / `token` — Kibana authentication

---

## Health Payments

### Overview

The Health Payments module manages the complete payment cycle for health campaign field workers — from recording attendance in the field through to final bank-side payment approval. The workflow is role-based: each user sees only the screens and actions their role allows.

| Role | Who it's for |
|---|---|
| `PROXIMITY_SUPERVISOR` | Field supervisors who record and edit attendance in their assigned boundary registers |
| `CAMPAIGN_SUPERVISOR` | Supervisors who access the bill inbox and generate bills from recorded attendance |
| `CAMPAIGN_MANAGER` | Managers who configure payment setup (billing config, worker rates, delivery targets) |

The module works from a single MDMS configuration block (`HCM.paymentsConfig`) that defines payment rules, bill periods, and which actions are allowed at each stage. **If this config is missing, the module will not load at all.**

In HCM v2.1, this module has been **fully rebuilt** — migrated from React 17 to React 19 — and now ships as part of the new `payments-ui` deployment variant. The entire bill management lifecycle UI is new in this release.

---

### What's New

All of the following screens and features are new in HCM v2.1.

#### Attendance registers inbox (`PROXIMITY_SUPERVISOR`)

Proximity supervisors select their project, then view attendance registers filtered by boundary and period. From here they can edit registers, search and assign attendees, record/edit attendance, upload supporting documents, and approve/submit attendance with comments. Approved records show comment logs.

---

#### Bill inbox and bill generation (`CAMPAIGN_SUPERVISOR`)

Campaign supervisors select a project and aggregation level, then view attendance registers grouped by boundary. They can view attendance (read-only), generate bills from approved attendance, and access "My Bills" to view bill payment details and download bills.

---

#### Bill detail view

A drill-down view showing the full details of a bill — individual attendees, amounts, and the current status of each record. Accessible from My Bills (`CAMPAIGN_SUPERVISOR`).

---

#### Map view toggle for attendance (config-driven)

The attendance view screen can now show a map of attendance locations, gated behind the `HCM.ATTENDANCE_CONFIG` MDMS master. The map button and popup only render when `enableMapView` is explicitly set to `true`.

---

#### Illustrated empty state for search results

Search screens with no results now show an illustrated empty state (`UndrawPeopleSearch`) instead of a plain message.

---

### What Changed in Existing Features

#### React 19 migration

The entire module has been rebuilt on React 19 with Webpack 5. End users will not notice a difference — this is an internal platform change.

---

#### New deployment variant — `payments-ui`

The module is now bundled and deployed as part of `payments-ui`, independently served at `/payments-ui/`. It shares this build with HRMS and PGR.

---

#### Screen headers and footers standardised

All bill and attendance screens have been updated to use a consistent header and footer layout.

---

#### Hierarchy type no longer read from global config

Boundary hierarchy type is no longer hardcoded from `window.globalConfigs` and `paymentsConfig` MDMS. It is now derived from `project.additionalDetails`, and the lowest boundary level is fetched from the boundary hierarchy definition API. Both values are passed down via a React Context (`ProviderContext`).

---

### Bug Fixes

| Issue fixed | Details |
|---|---|
| Approve button not working | The approve action in the attendance view was not correctly wired after migration |
| Post-migration rendering issues | Bill inbox, manage bills, fetch bills, bill detail, Excel editing, and attendance screens all had React 19 compatibility issues |
| UI/UX polish across bill and attendance screens | Table styling, date range picker, empty states, and button sizing fixed across bill inbox, manage bills, verify & generate payments, and attendance screens |

---

### How the Bill Lifecycle Works

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
  → View Attendance (read-only, from bill context)
  → Generate Bill (from approved attendance)
  → My Bills → View Bill Details
  → Download Bills

Payment Setup                                       [CAMPAIGN_MANAGER]
  → Select Campaign
  → Select Billing Cycle (Weekly/Biweekly/Monthly/Custom)
  → Configure Role-Based Wages
  → Submit Billing Configuration
```

---

### How Access and Permissions Work

| Role | Root Screen | What they can do |
|---|---|---|
| `PROXIMITY_SUPERVISOR` | Attendance Registers Inbox | Select project, view registers (Pending/Approved tabs), edit register, search & assign attendees, view/record/edit attendance, upload supporting documents, approve/submit attendance with comments, view comment logs |
| `CAMPAIGN_SUPERVISOR` | Bill Inbox | Select project + aggregation level, view registers (Approved/Pending tabs), view attendance (read-only), generate bills, access My Bills, view bill payment details, download bills |
| `CAMPAIGN_MANAGER` | Payment Setup | Select campaign, select billing cycle, configure role-based wages, submit billing configuration |

---

### Localisation

Translation keys are centralised in `src/utils/i18nKeyConstants.js`.

| Key prefix | Where it is used |
|---|---|
| `HCM_AM_*` | All bill management screens |
| `HCM_AM_MANAGE_BILLS` | Manage Bills tab labels |
| `HCM_AM_VERIFY_BILLS` | Verify Bills tab labels |
| `HCM_AM_REVIEW_BILLS` | Review Bills tab labels |
| `HCM_AM_NOT_VERIFIED` | Status label for unverified bills |

---

### API Integrations

| Endpoint | Method | Service | Purpose |
|---|---|---|---|
| `/{ATTENDANCE_CONTEXT_PATH}/v1/_search` | POST | `AttendanceService` | Search attendance registers |
| `/{ATTENDANCE_CONTEXT_PATH}/attendee/v1/_create` | POST | `AttendeeService` | Enroll attendee in register |
| `/{ATTENDANCE_CONTEXT_PATH}/attendee/v1/_delete` | POST | `AttendeeService` | De-enroll attendee from register |
| `/{INDIVIDUAL_CONTEXT_PATH}/v1/_search` | POST | `AttendeeService` | Search individuals (health workers) |
| `/{HRMS_CONTEXT_PATH}/employees/_search` | POST | `HRMSService` | Search employees |
| `/{PROJECT_CONTEXT_PATH}/v1/_search` | POST | `ProjectService` | Search projects |
| `/{PROJECT_CONTEXT_PATH}/staff/v1/_search` | POST | `ProjectService` | Search project staff |
| `/boundary-service/boundary-relationships/_search` | POST | `AttendanceService` | Boundary-scoped register search |
| `/boundary-service/boundary-hierarchy-definition/_search` | POST | `ProviderContext` | Fetch lowest boundary level for hierarchy |
| `/{EXPENSE_CONTEXT_PATH}/bill/v1/_search` | POST | Expense service | Search bills |
| `/{EXPENSE_CONTEXT_PATH}/bill/v1/_update` | POST | Expense service | Update bill header |
| `/{EXPENSE_CONTEXT_PATH}/bill/v1/_bulkupdatestatus` | POST | Expense service | Bulk update bill status |
| `/{EXPENSE_CONTEXT_PATH}/bill/v1/billdetails/_update` | POST | Expense service | Update bill line items |
| `/{EXPENSE_CONTEXT_PATH}/bill/v1/billdetails/_generateTemplate` | POST | Expense service | Download bill as Excel template |
| `/{EXPENSE_CONTEXT_PATH}/bill/v1/billdetails/_uploadTemplate` | POST | Expense service | Upload edited Excel bill template |
| `/{EXPENSE_CONTEXT_PATH}/v1/bill/_verify` | POST | Expense service | Verify bill |
| `/{EXPENSE_CONTEXT_PATH}/v1/payment/_transfer` | POST | Expense service | Initiate payment transfer to bank |
| `/{EXPENSE_CONTEXT_PATH}/v1/task/_status` | POST | Expense service | Poll async task status (verify / payment) |
| `/health-expense-calculator/billing-config/v1/_create` | POST | `AttendeeService` | Create billing config (payment setup) |
| `/health-expense-calculator/billing-config/v1/_update` | POST | `AttendeeService` | Update billing config |
| `/health-expense-calculator/billing-config/v1/_search` | POST | `PaymentSetupServices` | Search billing config by project |
| `/egov-workflow-v2/egov-wf/businessservice/_search` | POST | `WorkflowService` | Workflow business service config |
| `/egov-workflow-v2/egov-wf/process/_search` | POST | `WorkflowService` | Workflow process instances |
| `/works-inbox-service/v2/_search` | POST | Inbox hook | Bill and attendance inbox search |
| `/filestore/v1/files` | POST | FileStore | Upload supporting documents |
| `/filestore/v1/files/url` | GET | FileStore | Fetch file download URL |
| `/project-factory/v1/project-type/search` | POST | `useSearchCampaign` | Search campaigns (project selection screen) |

**Context path config keys** (from `window.globalConfigs.getConfig()`):
- `HRMS_CONTEXT_PATH` → HRMS service base (default: `health-hrms`)
- `ATTENDANCE_CONTEXT_PATH` → Attendance service base (default: `health-attendance`)
- `INDIVIDUAL_CONTEXT_PATH` → Individual service base (default: `health-individual`)
- `PROJECT_CONTEXT_PATH` → Project search and staff lookup (default: `health-project`)
- `PROJECT_SERVICE_PATH` → Project search used in `urls.js` (default: `health-project`; functionally same as `PROJECT_CONTEXT_PATH`)
- `EXPENSE_CONTEXT_PATH` → Bill search, update, verify, payment transfer, reporting (default: `health-expense`)
- `EXPENSE_CALCULATOR_CONTEXT_PATH` → Billing config CRUD (default: `health-expense-calculator`)
- `MUSTER_ROLL_CONTEXT_PATH` → Muster roll search (default: `health-muster-roll`)
- `MDMS_CONTEXT_PATH` → General MDMS v2 queries (default: `mdms-v2`)

---

## Health HRMS

### Overview

Health HRMS provides the web interface for managing health campaign field workers. Program administrators use it to create employee accounts, assign them to geographic boundaries, link them to supervisors, and connect them to campaigns. Everything in the module is scoped by boundary.

**In HCM v2.1, this is a platform migration release.** The module has been moved from React 17 to React 19 and is now deployed under the `payments-ui` build variant. Three bug fixes were also applied during migration.

This release does not add new screens or features.

---

### What Changed

#### React 19 migration and new `payments-ui` deployment

The full module has been ported from React 17 + microbundle-crl to React 19 + Webpack 5. HRMS is no longer served from the old React 17 standalone shell — it now ships as part of `payments-ui` at `/payments-ui/`.

---

### Bug Fixes

#### Mobile number validation — shown as a toast instead of a blocking popup

**Before:** When a user entered an invalid mobile number while creating an employee, a blocking modal appeared — stopping all interaction until dismissed.

**After:** The validation message now appears as a small toast notification at the bottom of the screen. The form stays accessible and the user can correct the number without being blocked.

---

#### Deactivate employee popup — form fields not rendering correctly

**Before:** When opening the deactivate employee popup, the form fields inside it were not rendering correctly (React 17 → React 19 compatibility issue).

**After:** Fixed. The popup now correctly displays all form fields, including the deactivation reason dropdown.

---

#### Action popup — content not appearing inside the popup

**Before:** When opening the action popup, the content inside was blank or not rendering (React 17 → React 19 compatibility issue).

**After:** Fixed. The popup now renders its content correctly.

---

### How the Module Works

**Employee management flow:**
```text
Hierarchy selection (required every session)
  → Employee inbox (search by name, role, or boundary)
  → Create employee / View employee details
  → Assign jurisdiction / Link supervisor
  → Activate or deactivate employee
  → Confirmation screen
```

**Campaign assignment flow:**
```text
Employee details screen
  → Click "Edit campaigns"
  → Campaign assignment inbox (campaigns scoped to employee jurisdictions)
  → Assign or remove employee from campaign
  → Confirmation screen
```

> **Note on hierarchy selection:** Every session starts with a hierarchy selection screen before accessing employee data — it is required to scope the session to the correct boundary.

> **Note on supervisor linking:** Assigning a supervisor creates a real backend reporting relationship — it is not just a UI label.

---

### How Access and Permissions Work

| Access type | How it works |
|---|---|
| Module-level access | Only users with HRMS access can see the module |
| Boundary-scoped data | Employees visible to a user are limited to those within their assigned boundary hierarchy |
| Supervisor assignment | Requires permission to modify employee reporting relationships |

---

### Localisation

Translation keys are centralised in `src/utils/i18nKeyConstants.js`.

| Key prefix | Where it is used |
|---|---|
| `HCM_` | All HRMS screen labels |
| `HR_*` | Employee-specific labels (mobile number field, deactivation reason, remarks) |

---

### API Integrations

| Endpoint | Method | Service | Purpose |
|---|---|---|---|
| `/{HRMS_CONTEXT_PATH}/employees/_search` | POST | `HRMSService` | Search employees by boundary / role |
| `/{HRMS_CONTEXT_PATH}/employees/_create` | POST | `HRMSService` | Create employee |
| `/{HRMS_CONTEXT_PATH}/employees/_update` | POST | `HRMSService` | Update employee (including activate/deactivate) |
| `/{HRMS_CONTEXT_PATH}/employees/_count` | POST | `HRMSService` | Count employees (pagination) |
| `/{PROJECT_SERVICE_PATH}/staff/v1/_search` | POST | `StaffService` | Search project staff assignments |
| `/{PROJECT_SERVICE_PATH}/staff/v1/_create` | POST | `StaffService` | Create project staff assignment |
| `/{PROJECT_SERVICE_PATH}/staff/v1/_delete` | POST | `StaffService` | Remove project staff assignment |
| `/{PROJECT_SERVICE_PATH}/v1/_search` | POST | `StaffService` | Search projects |
| `/boundary-service/boundary-relationships/_search` | POST | `BoundarySearch` | Boundary-scoped employee data filtering |
| `/boundary-service/boundary-hierarchy-definition/_search` | POST | `useFetchAllBoundaryHierarchies` | Fetch all boundary hierarchy definitions |
| `/egov-workflow-v2/egov-wf/businessservice/_search` | POST | `WorkflowService` | Workflow business service config |
| `/egov-workflow-v2/egov-wf/process/_search` | POST | `WorkflowService` | Workflow process instances |
| `/filestore/v1/files` | POST | FileStore | File upload |
| `/filestore/v1/files/url` | GET | FileStore | Fetch file download URL |

**Context path config keys** (from `window.globalConfigs.getConfig()`):
- `HRMS_CONTEXT_PATH` → HRMS service base (default: `health-hrms`)
- `PROJECT_SERVICE_PATH` → Project service base (default: `health-project`)

---

## Complaints Management (PGR)

### Overview

The Complaints Management (PGR) module provides the grievance management interface for health campaigns. Field staff and supervisors can file complaints, track them through a resolution workflow, and take action — all scoped to the geographic boundary the user is assigned to.

| Stage | Who acts |
|---|---|
| File a complaint | Any authenticated field staff or supervisor |
| Review in inbox | Filter by status, category, boundary, or date |
| Take action | Assigned supervisors — Assign, Resolve, Reject, or Reassign |
| Track progress | Anyone can view the complaint timeline |

**In HCM v2.1, this is a platform migration release.** The module has been moved from React 17 to React 19 and now ships as part of the `payments-ui` build variant. Three bug fixes were also applied during migration.

This release does not add new screens or features.

---

### What Changed

#### React 19 migration and new `payments-ui` deployment

The full module has been ported from React 17 to React 19 (including React Router v5 → v6). PGR is no longer served from the old React 17 standalone shell — it now ships as part of `payments-ui` at `/payments-ui/`.

---

#### PGR hierarchy source changed

The boundary hierarchy type is no longer read from global config. It is now fetched at runtime from MDMS (`PGR.HierarchySelectedForPGR`) and stored in session storage for the duration of the session.

---

### Bug Fixes

#### Action modal not rendering on complaint details screen

**Before:** When a user tried to take an action (Assign, Resolve, etc.) from the complaint details screen, the action modal failed to appear.

**After:** Fixed. The action modal now opens correctly, allowing supervisors to take workflow actions on complaints.

---

#### Complaint timeline — crash when role data was missing

**Before:** The complaint timeline would crash if the roles associated with a timeline entry were null or missing.

**After:** Fixed. The timeline now handles missing role data safely and displays without crashing.

---

#### Date picker — styling fix

**Before:** The date input field in the complaint filter had inconsistent corners compared to other form fields.

**After:** Fixed. The date picker now has consistent rounded corners matching the rest of the UI.

---

### How the Module Works

**Complaint lifecycle flow:**
```text
Create complaint
  (Boundary selection → Category → Description → File attachment)
  → Complaint inbox  (filter by status, category, boundary, date)
  → Complaint details
  → Take action  (Assign / Resolve / Reject / Reassign)
  → Timeline updated
```

> **Note on inbox filters:** Filters applied in the complaint inbox are cleared when `PGRModule` mounts (`Digit.SessionStorage.del("filtersForInbox")` is called in a `useEffect` with an empty dependency array). Users re-apply filters each time they navigate to the PGR module — this is intentional.

> **Note on boundary scoping:** On startup, the module reads the boundary hierarchy from MDMS (`PGR.HierarchySelectedForPGR`) and stores the matching hierarchy object in `SessionStorage["HIERARCHY_TYPE_SELECTED"]`.

---

### How Access and Permissions Work

| Role / Access | What they can do |
|---|---|
| All authenticated employees | File a complaint, view the complaint inbox, view complaint details |
| Assigned supervisors | Take workflow actions (Assign, Resolve, Reject, Reassign) within their boundary scope |

---

### Localisation

Translation keys are centralised in `src/utils/i18nKeyConstants.js`.

| Key prefix | Where it is used |
|---|---|
| `HCM_PGR_*` | All Complaints Management screen labels |
| `HCM_*` | Shared HCM labels used across modules |
| `ACCESSCONTROL_ROLES_ROLES_*` | Role display names shown in the complaint timeline |

---

### API Integrations

| Endpoint | Method | Service | Purpose |
|---|---|---|---|
| `/{PGR_SERVICE_PATH}/v2/request/_search` | POST | `PGRService` | Search grievance requests |
| `/{PGR_SERVICE_PATH}/v2/request/_create` | POST | `PGRService` | Create grievance request |
| `/{PGR_SERVICE_PATH}/v2/request/_update` | POST | `PGRService` | Update grievance request (workflow action) |
| `/{PROJECT_SERVICE_PATH}/staff/v1/_search` | POST | `ProjectService` | Search project staff (for boundary scoping) |
| `/{PROJECT_SERVICE_PATH}/v1/_search` | POST | `ProjectService` | Search projects |
| `/boundary-service/boundary-relationships/_search` | POST | `BoundaryService` | Boundary-scoped complaint filtering |
| `/boundary-service/boundary-hierarchy-definition/_search` | POST | `useFetchAllHierarchies` | Fetch boundary hierarchy definitions |
| `/egov-workflow-v2/egov-wf/businessservice/_search` | POST | `Workflow` | Workflow business service config |
| `/egov-workflow-v2/egov-wf/process/_search` | POST | `Workflow` | Workflow process instances (complaint timeline) |

**Context path config keys** (from `window.globalConfigs.getConfig()`):
- `PGR_SERVICE_PATH` → PGR service base (default: `health-pgr-services`)
- `PROJECT_SERVICE_PATH` → Project service base (default: `health-project`)

---

## Security Changes

| Change | Detail |
|---|---|
| Removed `@cyntler/react-doc-viewer` | Known vulnerability — dependency removed from Campaign Manager |
| Added `SECURITY.md` | Vulnerability reporting guidelines added to repository |
| OpenSSF Scorecard workflow | Supply-chain security scanning added to CI |
| Fuzz testing workflow | Added to GitHub Actions |

---

## Related Documents

- [HCM-TECHNICAL-OVERVIEW.md](./HCM-TECHNICAL-OVERVIEW.md) — architecture and operational reference for HCM-v2.1
- [HCM-v2.1-RELEASE-NOTES.md](./HCM-v2.1-RELEASE-NOTES.md) — release overview (at-a-glance format)
- [Campaign Manager RELEASE-NOTES.md](./health/micro-ui-react19/web/packages/modules/campaign-manager/RELEASE-NOTES.md)
- [Health Payments RELEASE-NOTES.md](./health/micro-ui-react19/web/packages/modules/health-payments/RELEASE-NOTES.md)
- [Health HRMS RELEASE-NOTES.md](./health/micro-ui-react19/web/packages/modules/health-hrms/RELEASE-NOTES.md)
- [PGR RELEASE-NOTES.md](./health/micro-ui-react19/web/packages/modules/pgr/RELEASE-NOTES.md)
- [Health DSS RELEASE-NOTES.md](./health/micro-ui-react19/web/packages/modules/health-dss/RELEASE-NOTES.md)
- [HCM-v2.0 Release](https://github.com/egovernments/DIGIT-Frontend/releases/tag/HCM-v2.0) — previous release reference