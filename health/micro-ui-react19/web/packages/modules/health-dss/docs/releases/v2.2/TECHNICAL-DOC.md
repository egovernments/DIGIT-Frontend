# Health DSS (Analytics Dashboard) — HCM v2.2 Technical Documentation

**Module:** `@egovernments/digit-ui-module-health-dss`
**Release:** HCM v2.2
**Previous release:** [HCM v2.1](../v2.1/TECHNICAL-DOC.md)
**Stack:** React 19, Webpack 5
**Repository:** [egovernments/DIGIT-Frontend](https://github.com/egovernments/DIGIT-Frontend)

---

## Overview

Health DSS is the analytics and reporting dashboard for health campaign program managers — KPI cards on the L1 dashboard, drill-down trend and geospatial views on L2.

**HCM v2.2 is a bug-fix-only release for this module.** Architecture, screens, hooks, API integrations and configuration are unchanged from v2.1 — see the [v2.1 technical documentation](../v2.1/TECHNICAL-DOC.md) for that material.

Two source files changed. Nothing else in the module was touched.

---

## What Changed in v2.2

### Bar chart top-segment detection rejected decimal values

**Ticket:** HCMPRE-4597
**PR:** [#4598](https://github.com/egovernments/DIGIT-Frontend/pull/4598)
**File:** `src/components/CustomHorizontalBarChart.js`

`CustomHorizontalBarChart` applies a border radius to the last non-zero segment of each stacked bar. The loop that locates that segment guarded on `Number.isInteger`:

```js
if (Number.isInteger(chartData[index][properties])) {
```

When the chart renders in percentage mode the plotted values are one-decimal floats (`12.5`, `7.3`). `Number.isInteger` returns `false` for every one of them, so `topIndex` was never advanced past its initial `0` and the radius was applied to the bottom segment.

The guard now accepts any numeric value:

```js
if (typeof chartData[index][properties] === "number") {
```

Count mode is unaffected — integers satisfy both the old and the new condition. Only percentage mode changes behaviour.

---

### `rainmaker-hcm-dss` removed from the localisation module list

**Ticket:** HCMPRE-4542
**PR:** [#4544](https://github.com/egovernments/DIGIT-Frontend/pull/4544)
**File:** `src/Module.js`

The `moduleCode` array passed to `Digit.Services.useStore` requested four localisation modules:

```js
const moduleCode = ["hcm-campaignmanager", "hcm-dss", `hcm-boundary-${hierarchyType}`, "rainmaker-hcm-dss"];
```

`rainmaker-hcm-dss` has been removed, leaving three:

```js
const moduleCode = ["hcm-campaignmanager", "hcm-dss", `hcm-boundary-${hierarchyType}`];
```

> **Deployment note:** any label served only from `rainmaker-hcm-dss` will no longer resolve. Confirm dashboard labels exist under `hcm-dss`.

---

## Package and Dependency Updates

| Package | v2.1 | v2.2 |
|---|---|---|
| `@egovernments/digit-ui-react-components` | 2.0.0-dev-18 | 2.0.0-dev-21 |
| `@egovernments/digit-ui-svg-components` | 2.0.0-dev-08 | 2.0.0-dev-11 |
| `@egovernments/digit-ui-components` | 2.0.0-dev-64 | 2.0.0-dev-78 |

---

## Complete Change History (v2.2)

Range: `HCM-v2.1`..`HCM-v2.2`

| PR | What changed in health-dss |
|---|---|
| [#4514](https://github.com/egovernments/DIGIT-Frontend/pull/4514) | `package.json` version bump only. No source changes in health-dss. |
| [#4544](https://github.com/egovernments/DIGIT-Frontend/pull/4544) | `rainmaker-hcm-dss` removed from `moduleCode` in `src/Module.js`. `package.json` version bump. |
| [#4549](https://github.com/egovernments/DIGIT-Frontend/pull/4549) | `package.json` version bump only. No source changes in health-dss. |
| [#4569](https://github.com/egovernments/DIGIT-Frontend/pull/4569) | `package.json` version bump only. No source changes in health-dss. |
| [#4598](https://github.com/egovernments/DIGIT-Frontend/pull/4598) | Bar chart top-segment detection fixed in `src/components/CustomHorizontalBarChart.js`. |
| [#4701](https://github.com/egovernments/DIGIT-Frontend/pull/4701) | `package.json` version bump only. No source changes in health-dss. |

---

## Testing Checklist

- [ ] L2 horizontal bar chart in **count** mode — rounded corner on the top segment
- [ ] Same chart in **percentage** mode — rounded corner on the top segment, not the bottom
- [ ] Dashboard labels still resolve after the `rainmaker-hcm-dss` removal
