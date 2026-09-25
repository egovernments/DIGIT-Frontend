# Health DSS (Analytics Dashboard) — HCM v2.1 Technical Documentation

**Module:** `@egovernments/digit-ui-module-health-dss`
**Release:** HCM v2.1
**Stack:** React 19, Webpack 5 (migrated from React 17 + microbundle-crl)
**Repository:** [egovernments/DIGIT-Frontend](https://github.com/egovernments/DIGIT-Frontend)

---

## Overview

The Health DSS module provides the analytics and reporting dashboard for health campaign program managers. It gives teams a single place to monitor campaign KPIs, explore data by geography and date range, and drill into field-level activity.

The dashboard has two levels:

- **L1 dashboard** — top-level campaign overview with KPI cards
- **L2 dashboard** — deeper drill-down with trend charts, geospatial views, and boundary-level filtering

**In HCM v2.1, this module gains two major new capabilities and has been migrated from React 17 to React 19:**

1. **User Activity Tracking** — field worker metrics backed by Elasticsearch
2. **Custom Reports** — MDMS-configured reports scoped to each campaign, with live status tracking
3. **React 19 migration** — ported from React 17 + microbundle-crl to React 19 + Webpack 5

---

## Migration from React 17 to React 19

**PR:** [#4111](https://github.com/egovernments/DIGIT-Frontend/pull/4111)

The module has been ported from the React 17 legacy stack to React 19 with Webpack 5. End users will not notice a difference — all existing screens and features work as before.

**What changed internally:**
- React Query v3 → TanStack Query v5
- React Router v5 → React Router v6
- Build output: `dist/index.js` (CJS, microbundle-crl) → `dist/main.js` (ESM, Webpack 5)
- Web Worker for Elasticsearch queries now compiled via Webpack worker loader

---

## What's New in v2.1

### 1. User Activity Tracking

**Ticket:** HCMPRE-4085
**PRs:** [#4090](https://github.com/egovernments/DIGIT-Frontend/pull/4090), [#4103](https://github.com/egovernments/DIGIT-Frontend/pull/4103)

A new section has been added to the L2 dashboard showing field worker activity data pulled live from Elasticsearch.

| Component | What it shows |
|---|---|
| Activity metrics cards | Summary indicators for overall field worker activity across the campaign |
| Per-user activity table | Each field worker listed with their individual activity data |
| User profile popup | Click any row to open a detailed activity view for that worker |

**Flow:**
```text
L2 Dashboard → User Activity Section → Metrics cards + Table → Click a user → Profile popup
```

> `useSimpleElasticsearch` and `useUserTrackingData` query Elasticsearch directly via Kibana proxy. `useUserActivityData` fetches activity metrics through `Digit.Hooks.DSS.useGetChartV2` (the dashboard analytics endpoint), not ES directly. There is no fallback if Elasticsearch is unavailable — the section silently fails to load.

**New hooks:**
- `useSimpleElasticsearch` — `Digit.Hooks.DSS.useSimpleElasticsearch`
- `useUserActivityData` — `Digit.Hooks.DSS.useUserActivityData`
- `useUserTrackingData` — `Digit.Hooks.DSS.useUserTrackingData`

**Elasticsearch indices used:**
- `user-sync-index-v1` — user sync data
- `project-staff-index-v1` — project staff data

**Configuration required:** Elasticsearch must be deployed and indexed before enabling this section. See "Configuration Required" below.

---

### 2. Custom Reports

**Ticket:** HCMPRE-4161, HCMPRE-4207
**PRs:** [#4186](https://github.com/egovernments/DIGIT-Frontend/pull/4186), [#4208](https://github.com/egovernments/DIGIT-Frontend/pull/4208),[#4216](https://github.com/egovernments/DIGIT-Frontend/pull/4216), [#4220](https://github.com/egovernments/DIGIT-Frontend/pull/4220)

Users can now access campaign-scoped reports directly from the dashboard.

| Page | What it does |
|---|---|
| Reports list page | Click "View Reports" on a campaign row to see the reports configured for that campaign |
| Report detail page | Select a report to open the full report for that campaign |

**Flow:**

```text
Campaign row → "View Reports" link → Reports list page → Select a report → Report detail page
```

> Available report definitions are populated from MDMS based on the campaign's project type. The reports list then shows only the reports that were actively configured for that specific campaign (via the Configure Reports step during campaign creation) — not every report defined for the project type.

**New component added to campaign row card:** A "View Reports" link now appears on each campaign row.

---

### 3. Live Report Status Tracking

**Ticket:** HCMPRE-4161
**PR:** [#4186](https://github.com/egovernments/DIGIT-Frontend/pull/4186)

While a custom report is generating, the Report Detail page shows in-progress runs as cards with a live progress bar and percentage. Once a run completes, it automatically disappears from the in-progress list and the completed-report list refreshes without a page reload.

**In-progress card shows:**
- The date range or date the report covers
- A progress bar with percentage (`progressPercent` from the API)
- A generic "In Progress" tag

**Completed report card shows:**
- The triggered time rendered in the viewer's **local time** (`reporttriggeredtimems` field)
- File size (formatted in B / KB / MB)

**Progress polling:**
- `useReportsInProgress` polls `/airflow-trigger-api/api/reports-in-progress` every 5 seconds while any run is active, and stops automatically when no runs remain (`refetchInterval` returns `false` when the response is empty).
- When a dagRunId drops out of the in-progress list (run completed or failed), the completed-reports list refreshes immediately.

**Pre-flight check before triggering a custom report:**
`checkExistingCustomReport` calls `/airflow-trigger-api/api/reports-check-existing` before triggering. Four outcomes:

| Pre-flight result | What happens |
|---|---|
| No existing run | Report triggers immediately |
| Failed run | Popup shown with error message; user can retry |
| In-progress run | Popup shown with current progress; no duplicate trigger allowed |
| Completed run (terminal) | Popup offers download of the existing report; a live countdown shows when a retry becomes available (`retryAvailableInSeconds`) |

**Status label definitions (`src/utils/reportStatus.js`):**
`IN_PROGRESS_STAGE_LABELS` maps internal pipeline status keys to i18n label keys (e.g. `TRIGGERED_ON_UI → "HCM_REPORT_STATUS_QUEUED"`). `getStageLabelKey(status)` is available for use by any component displaying per-stage labels. The default in-progress card shows a progress percentage rather than a named stage.

**New hook:** `useReportsInProgress` (`src/hooks/useReportsInProgress.js`) — polls report progress at a 5-second interval while runs are active.

**New utility:** `checkExistingCustomReport` (`src/utils/reportsApi.js`) — pre-flight duplicate check before triggering a custom report.

---

### 4. New Hook — `useSearchCampaign` (DSS-Owned)

**Ticket:** HCMPRE-2222
**PR:** [#3907](https://github.com/egovernments/DIGIT-Frontend/pull/3907)

A DSS-owned version of the campaign search hook is now available as `Digit.Hooks.DSS.useSearchCampaign`. It queries the project factory search API and is used internally by the Custom Reports flow.

**Breaking change for implementors:** If your code calls `Digit.Hooks.campaign.useSearchCampaign`, rename it to `Digit.Hooks.DSS.useSearchCampaign`. The hook's namespace has changed. Note: the DSS version only sets `gcTime: 0` — the previous campaign version also set `staleTime: 0` and `refetchOnMount: "always"`. If your code relies on those options, pass them explicitly via the `config` parameter.

---

## Changes to Existing Features

### Dashboard Date Range — Now Supports Both Old and New Formats

**Ticket:** HCMPRE-4085
**PR:** [#4090](https://github.com/egovernments/DIGIT-Frontend/pull/4090)

The L2 dashboard date range logic now handles two campaign date formats:

- **Old format:** nested campaign object `{ [projectType]: [{ startDate, endDate }] }`
- **New format:** flat campaign object with `startDate` and `endDate` directly

If a descendant date range is saved in session storage for the active boundary, it overrides the campaign-level dates — giving finer control when drilling down by boundary.

---

### Banner Card — New Sync-Status Control

**Ticket:** HCMPRE-4085
**PR:** [#4090](https://github.com/egovernments/DIGIT-Frontend/pull/4090)

A new option (`nonSync`) has been added to the banner card component. Set `nonSync: true` to hide the sync-status indicator. Defaults to `false` (sync status shown as before).

---

### Charts and Layout Improvements

**Ticket:** HCMPRE-4096, HCMPRE-4093
**PRs:** [#4103](https://github.com/egovernments/DIGIT-Frontend/pull/4103), [#4102](https://github.com/egovernments/DIGIT-Frontend/pull/4102)

Updated for better rendering:
- Pie chart
- Horizontal bar chart
- Data table
- Dashboard layout (filter, generic chart, layout structure)

---

### Excel Export Added

An Excel library (`xlsx ^0.18.5`) has been added to support exporting report data from the Custom Reports flow.

---

## Bug Fixes

| Issue | PR |
|---|---|
| Dashboard inbox filter button relabelled to "Search" with primary variation; loader centered on `Inbox`, `ViewDashboard`, `ReportDetailPage`, and `ReportsListPage` | [#4223](https://github.com/egovernments/DIGIT-Frontend/pull/4223) |
| `ReportDetailPage.js` — custom report end date now uses end-of-day timestamp (`23:59:59+0530`) via `formatEndDateForPayload`; `InProgressCard` now handles SKIPPED/FAILED as terminal states with appropriate tags (no progress bar shown for terminal states); package version bump | [#4244](https://github.com/egovernments/DIGIT-Frontend/pull/4244) |
| Final audit and bug bash fixes across dashboard screens | [#4220](https://github.com/egovernments/DIGIT-Frontend/pull/4220) |
| Newly generated custom reports required navigating away and back to appear — in-progress polling hook was reading pre-select query data so its refetch interval never engaged | [#4186](https://github.com/egovernments/DIGIT-Frontend/pull/4186) |
| Dashboard build failure — removed campaign-manager module dependency from health-dss; added missing `axios` package; added Terser dependency | [#3842](https://github.com/egovernments/DIGIT-Frontend/pull/3842) |
| Dashboard UI/UX issues and other rendering problems | [#4103](https://github.com/egovernments/DIGIT-Frontend/pull/4103) |
| Fixed dates error issue in campaign date handling | [#4125](https://github.com/egovernments/DIGIT-Frontend/pull/4125) |
| Custom reports CSS fixes, localization keys moved to constants | [#4124](https://github.com/egovernments/DIGIT-Frontend/pull/4124) |
| Moved all remaining localization keys to the shared `i18nKeyConstants.js` constant file | [#4136](https://github.com/egovernments/DIGIT-Frontend/pull/4136) |
| Attendance fixes and SVG library version change | [#4151](https://github.com/egovernments/DIGIT-Frontend/pull/4151) |
| Final audit fixes for attendance, reports, and hierarchy screens | [#4158](https://github.com/egovernments/DIGIT-Frontend/pull/4158) |
| Vulnerability fixes (dependency upgrades) | [#4173](https://github.com/egovernments/DIGIT-Frontend/pull/4173) |
| Custom reports UI/UX updates per new Figma designs | [#4208](https://github.com/egovernments/DIGIT-Frontend/pull/4208) |
| Attendance OFC localization, sheet errors fix, custom reports UI/UX updates | [#4216](https://github.com/egovernments/DIGIT-Frontend/pull/4216) |
| Fixed payments issues and UI/UX, ship commodity URL issue (legacy path) | [#4099](https://github.com/egovernments/DIGIT-Frontend/pull/4099) |
| Security fix: removed unused `@cyntler/react-doc-viewer` dependency (legacy path) | [#3847](https://github.com/egovernments/DIGIT-Frontend/pull/3847) |
| Security fix: removed `@cyntler/react-doc-viewer` vulnerability (legacy path) | [#3897](https://github.com/egovernments/DIGIT-Frontend/pull/3897) |
| Build issue with version changes (legacy path) | [#3898](https://github.com/egovernments/DIGIT-Frontend/pull/3898) |

---

## Configuration Required Before Deploying

### 1. Set up Elasticsearch Before Upgrading

The User Activity Tracking section pulls all data from Elasticsearch. If the Elasticsearch index is not set up and indexed before upgrading, the User Activity section will silently fail to load — no error message appears.

> Deploy and configure Elasticsearch with indices `user-sync-index-v1` and `project-staff-index-v1` before enabling this section.

### 2. Update the Campaign Search Hook Reference

If your code calls `Digit.Hooks.campaign.useSearchCampaign`, rename it to `Digit.Hooks.DSS.useSearchCampaign`. The hook works the same — only the namespace has changed.

### 3. Configure Kibana Access

Set the following keys in the `KIBANA` object returned by `window.globalConfigs.getConfig("KIBANA")`:

| Key | Purpose |
|---|---|
| `kibanaPath` | Kibana console proxy path (default: `kibana/api/console/proxy`) |
| `userSyncIndex` | ES user sync index (default: `user-sync-index-v1`) |
| `projectStaffIndex` | ES project staff index (default: `project-staff-index-v1`) |
| `username` / `password` / `token` | Kibana authentication credentials |

These keys are read by `getKibanaDetails(key)` in `src/utils/getProjectServiceUrls.js`.

---

## Roles and Permissions

| Access type | How it works |
|---|---|
| Dashboard card visibility | DSS dashboard card only appears if the logged-in user has the required DSS privilege |
| Data scope | All dashboard data is automatically filtered to the geographic boundaries the user is assigned to |

---

## API Integrations

| Endpoint | Method | Hook / Service | Purpose | Status |
|---|---|---|---|---|
| `/dashboard-analytics/dashboard/getChartV2` | POST | `useGetChartV2`, `useUserActivityData` | Dashboard KPI charts, trend data, user activity metrics | Existing (new viz codes: `overallUsersMetrics`, `usersSummaryTable`, `individualUsersMetrics`, `usersRecordsSummaryTable`) |
| `/health-project/v1/_search` | POST | `ProjectService` | Search campaigns / projects | Existing |
| `/health-project/staff/v1/_search` | POST | `ProjectService` | Search project staff | Existing |
| `/project-factory/v1/project-type/search` | POST | `useSearchCampaign` | Campaign search (moved to `Digit.Hooks.DSS.useSearchCampaign`) | Existing |
| `{origin}/{kibanaPath}?path=%2F{index}%2F_search&method=POST` | POST | `useSimpleElasticsearch`, `useUserTrackingData` | Elasticsearch queries via Kibana proxy | **New** |
| `/airflow-trigger-api/api/reports-in-progress` | POST | `useReportsInProgress` | Poll status/stage of in-progress custom reports (5s interval) | **New** |
| `/airflow-trigger-api/api/reports-check-existing` | POST | `checkExistingCustomReport` | Pre-flight check before triggering a report | **New** |

---

## Summary of New Components and Hooks

| Component / Hook | Location | What it does |
|---|---|---|
| User Activity (container) | `src/components/UserActivityTracking/UserActivity.js` | Orchestrates the full User Activity Tracking section on L2 |
| User Activity Metrics | `src/components/UserActivityTracking/UserActivityMetrics.js` | Activity summary cards |
| User Activity Summary Table | `src/components/UserActivityTracking/UserActivitySummaryTable.js` | Per-user activity table |
| User Profile Popup | `src/components/UserActivityTracking/UserProfilePopup.js` | Individual worker detail popup |
| Reports List Page | `src/pages/employee/ReportsListPage.js` | Lists available reports for a campaign |
| Report Detail Page | `src/pages/employee/ReportDetailPage.js` | Opens a specific report |
| `useSimpleElasticsearch` | `Digit.Hooks.DSS.useSimpleElasticsearch` | Generic Elasticsearch query hook (uses a Web Worker) |
| `useUserActivityData` | `Digit.Hooks.DSS.useUserActivityData` | User activity metrics data via getChartV2 |
| `useUserTrackingData` | `Digit.Hooks.DSS.useUserTrackingData` | Individual user tracking data via Elasticsearch |
| `useSearchCampaign` | `Digit.Hooks.DSS.useSearchCampaign` | Campaign search (moved from campaign namespace) |
| `useReportsInProgress` | `src/hooks/useReportsInProgress.js` | Polls report progress while active |
| `checkExistingCustomReport` | `src/utils/reportsApi.js` | Pre-flight duplicate-run check |
| `reportStatus.js` | `src/utils/reportStatus.js` | Stage labels, duration/file-size/row-count formatting |

---

## Localisation

Translation keys are centralised in `src/utils/i18nKeyConstants.js`. The previous per-component `UserActivityTracking/localizationKeys.js` file has been removed — its keys were moved into the shared constants file.

New key prefixes added in v2.1:

| Key prefix | Where it is used |
|---|---|
| `HCM_REPORT_STATUS_*` | Report in-progress stage labels (queued, scheduled, triggered, starting, generating, packaging, uploading) — defined in `src/utils/reportStatus.js` |
| `HCM_*` | User Activity Tracking labels and Custom Reports screens (grouped under `USER_ACTIVITY` and `PAGES` sections in `i18nKeyConstants.js`) |
| `USER_ACTIVITY_*` | User activity table column and action labels |

New keys were added for all User Activity Tracking labels and Custom Reports screens.
