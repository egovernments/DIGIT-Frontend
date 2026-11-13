# Health DSS

**Release:** HCM v2.2
**Previous release:** [HCM v2.1](../v2.1/RELEASE-NOTES.md)
**Module:** `@egovernments/digit-ui-module-health-dss`

---

## Overview

The Health DSS module provides the analytics and reporting dashboard for health campaign program managers. It gives teams a single place to monitor campaign KPIs, explore data by geography and date range, and drill into field-level activity.

The dashboard structure (L1 overview, L2 drill-down), data sources, roles and API integrations are **unchanged in this release**. For that material see the [v2.1 release notes](../v2.1/RELEASE-NOTES.md).

---

## What is this release about?

This release contains **two bug fixes only**.

- No new features
- No new screens
- No new API endpoints
- No MDMS or configuration changes
- No action required before upgrading

---

## Bug Fixes

### Percentage bar charts — rounded corner drawn on the wrong segment

**Before:** In the horizontal bar chart, the code that finds the last non-zero segment — so the rounded corner can be applied to it — tested each value with `Number.isInteger`. In percentage mode the chart plots one-decimal values such as `12.5`, which `Number.isInteger` rejects. No segment was ever recorded, so the index stayed at `0` and the rounded corner was drawn on the **bottom** segment instead of the top.

**After:** The test now accepts any numeric value, whole or decimal. The rounded corner is drawn on the correct segment in both count and percentage modes.

Count mode was never affected — whole numbers passed the old test.

File changed: `src/components/CustomHorizontalBarChart.js`

---

### Localisation request included a module that is no longer used

**Before:** The dashboard requested four localisation modules when it loaded, one of which was `rainmaker-hcm-dss`.

**After:** `rainmaker-hcm-dss` has been removed. The dashboard now requests `hcm-campaignmanager`, `hcm-dss` and `hcm-boundary-{hierarchyType}` only.

File changed: `src/Module.js`

> **Check before upgrading:** if any dashboard label is served only from the `rainmaker-hcm-dss` localisation module, it will no longer resolve. Confirm dashboard labels are present under `hcm-dss`.

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
