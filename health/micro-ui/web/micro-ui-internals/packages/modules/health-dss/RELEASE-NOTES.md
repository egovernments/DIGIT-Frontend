# Health DSS 



## Overview

The Health DSS module provides the analytics and reporting dashboard for health campaign program managers. It gives teams a single place to monitor campaign KPIs, explore data by geography and date range, and drill into field-level activity.

The dashboard is built on a layered structure:

- **L1 dashboard** — top-level campaign overview with KPI cards
- **L2 dashboard** — deeper drill-down with trend charts, geospatial views, and boundary-level filtering

Data flows in from multiple sources:

| Data source | What it powers |
|---|---|
| Campaign / project factory API | Campaign search and date ranges |
| Boundary Management API | Geographic drill-down filters |
| Elasticsearch | User activity tracking (new in HCM v2.1) |
| MDMS (master data) | Report type lists for Custom Reports (new in HCM v2.1) |

In hcm hcm v2.1, the dashboard gains two new capabilities: **User Activity Tracking** (field worker metrics backed by Elasticsearch) and **Custom Reports** (MDMS-configured reports scoped to each campaign).

---

## What is this release about?

This release adds two major new areas to the analytics dashboard used by health campaign program managers:

1. **User Activity Tracking** — see what field workers are doing, how active they are, and drill into individual worker profiles.
2. **Custom Reports** — view and open campaign-specific reports directly from the campaign row.

It also moves a hook to a new location and improves date range handling on the dashboard.

---

## ⚠️ Action Required Before Upgrading

Do these two things **before** upgrading — skipping either will cause issues.

### 1. Set up Elasticsearch first

The new User Activity Tracking section pulls all its data from Elasticsearch. If the Elasticsearch index is not set up and indexed before you upgrade, the User Activity section will **silently fail to load** — no error message will appear, it just won't show up.

> Make sure Elasticsearch is deployed and its index is configured before enabling this section.

### 2. Update the campaign search hook reference

If any of your code calls:

```
Digit.Hooks.campaign.useSearchCampaign
```

Rename it to:

```
Digit.Hooks.DSS.useSearchCampaign
```

The hook works exactly the same — only the location (namespace) has changed. No other code changes are needed for this.

---

## What's New

### User Activity Tracking

A new section has been added to the main L2 dashboard. It shows field worker activity data pulled live from Elasticsearch.

| Component | What it does |
|---|---|
| Activity metrics cards | Summary indicators showing overall field worker activity across the campaign |
| Per-user activity table | Lists each field worker with their individual activity data |
| User profile popup | Click any row in the table to open a detailed activity view for that worker |

**How the flow works:**

```
L2 Dashboard → User Activity Section → Metrics cards + Table → Click a user → Profile popup
```

> All three new data hooks (`useSimpleElasticSearch`, `useUserActivityData`, `useUserTrackingData`) query Elasticsearch directly. There is no fallback if Elasticsearch is unavailable.

---

### Custom Reports

Program managers can now access campaign-scoped reports directly from the dashboard.

| Page | What it does |
|---|---|
| Reports list page | Click "View Reports" on a campaign row to see all reports available for that campaign, filtered by project type |
| Report detail page | Select a report from the list to open the full report for that campaign |

**How the flow works:**

```
Campaign row → "View Reports" link → Reports list page → Select a report → Report detail page
```

> The reports list is populated from MDMS (master data) based on the campaign's project type.

---

### New Hook: `useSearchCampaign`

A new DSS-owned version of the campaign search hook is now available as `Digit.Hooks.DSS.useSearchCampaign`. It queries the project factory search API and is used internally by the Custom Reports flow.

---

## What Changed in Existing Features

### "View Reports" link added to the campaign row card

The campaign row card now has a "View Reports" link. Clicking it opens the reports list for that campaign.

---

### Dashboard date range — now supports both old and new formats

The L2 dashboard date range logic now handles two campaign date formats:

- **Old format** — nested campaign object `{ [projectType]: [{ startDate, endDate }] }`
- **New format** — flat campaign object with `startDate` and `endDate` directly

Additionally, if a **descendant date range** is saved in session storage for the currently active boundary, it will override the campaign-level dates. This gives finer control when drilling down by boundary.

---

### Banner card — new sync-status control

A new option (`nonSync`) has been added to the banner card component. Set it to `true` to hide the sync-status indicator. It defaults to `false` (sync status shown as before).

---

### Charts and layout improvements

The following components have been updated for better rendering:

- Pie chart
- Horizontal bar chart
- Data table
- Dashboard layout (filter, generic chart, layout structure)

---

### Excel export added

An Excel library (`xlsx 0.17.5`) has been added to support exporting report data from the Custom Reports flow.

---

## How Access and Permissions Work

| Access type | How it works |
|---|---|
| Dashboard card visibility | The DSS dashboard card only appears if the logged-in user has the required privilege |
| Data scope | All dashboard data is automatically filtered to the geographic boundaries the user is assigned to — users only see data for their area |

---

## Summary of New Components

| Component / Hook | Where to find it |
|---|---|
| User Activity Metrics | `src/components/UserActivityTracking/UserActivityMetrics.js` |
| User Activity Summary Table | `src/components/UserActivityTracking/UserActivitySummaryTable.js` |
| User Profile Popup | `src/components/UserActivityTracking/UserProfilePopup.js` |
| Reports List Page | `src/components/ReportsListPage.js` |
| Report Detail Page | `src/components/ReportDetailPage.js` |
| `useSimpleElasticSearch` | `Digit.Hooks.DSS.useSimpleElasticSearch` |
| `useUserActivityData` | `Digit.Hooks.DSS.useUserActivityData` |
| `useUserTrackingData` | `Digit.Hooks.DSS.useUserTrackingData` |
| `useSearchCampaign` | `Digit.Hooks.DSS.useSearchCampaign` |

---

## Localisation

New translation/label keys have been added for:

- All User Activity Tracking labels (defined in `src/components/UserActivityTracking/localizationKeys.js`)
- Custom Reports screens

Existing dashboard label prefixes (`HCM_L1_*`, `HCM_L2_*`) remain unchanged.

---

## API Integrations

| Endpoint | Method | Hook / Service | Purpose | Status |
|---|---|---|---|---|
| `/dashboard-analytics/dashboard/getChartV2` | POST | `useGetChartV2`, `useUserActivityData` | Dashboard KPI charts, trend data, user activity metrics (new viz codes: `overallUsersMetrics`, `usersSummaryTable`, `individualUsersMetrics`, `usersRecordsSummaryTable`) | Existing (new viz codes in v2.1) |
| `/health-project/v1/_search` | POST | `ProjectService`, `useProjectSearch` | Search campaigns / projects | Existing |
| `/health-project/staff/v1/_search` | POST | `ProjectService` | Search project staff | Existing |
| `/project-factory/v1/project-type/search` | POST | `useSearchCampaign` | Campaign search (moved to `Digit.Hooks.DSS.useSearchCampaign` in v2.1) | Existing |
| `{origin}/{kibanaPath}?path=%2F{index}%2F_search&method=POST` | POST | `useSimpleElasticsearch`, `useUserTrackingData` | Elasticsearch queries via Kibana proxy — indices: `user-sync-index-v1`, `project-staff-index-v1` | **New** |

**Kibana config keys** (from `window.globalConfigs.getConfig("KIBANA")`):
- `kibanaPath` — Kibana console proxy path (default: `kibana/api/console/proxy`)
- `userSyncIndex` — ES user sync index (default: `user-sync-index-v1`)
- `projectStaffIndex` — ES project staff index (default: `project-staff-index-v1`)
- `username` / `password` / `token` — Kibana authentication