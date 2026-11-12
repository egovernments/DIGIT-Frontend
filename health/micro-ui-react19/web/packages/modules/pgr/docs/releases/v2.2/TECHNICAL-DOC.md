# Complaints Management (PGR) — HCM v2.2 Technical Documentation

**Module:** `@egovernments/digit-ui-module-health-pgr`
**Release:** HCM v2.2
**Previous release:** [HCM v2.1](../v2.1/TECHNICAL-DOC.md)
**Stack:** React 19, Webpack 5
**Deployed under:** `payments-ui` build variant at `/payments-ui/`
**Repository:** [egovernments/DIGIT-Frontend](https://github.com/egovernments/DIGIT-Frontend)

---

## Overview

Complaints Management is the grievance interface for health campaigns — filing complaints, tracking them through the resolution workflow, and acting on them within the user's assigned boundary.

**HCM v2.2 is a minor-change release for this module.** Architecture, screens, routes, hooks, workflow, API integrations and configuration are unchanged from v2.1 — see the [v2.1 technical documentation](../v2.1/TECHNICAL-DOC.md) for that material.

Two source files changed. Nothing else in the module was touched.

---

## What Changed in v2.2

### Searchable dropdowns on complaint creation and boundary selection

**Ticket:** HCMPRE-4628
**PR:** [#4629](https://github.com/egovernments/DIGIT-Frontend/pull/4629)

Two dropdowns opted in to the search behaviour provided by `digit-ui-components`. This is an explicit per-field change in PGR source — it is not inherited automatically from the dependency upgrade.

`src/configs/CreateComplaintConfig.js` — `isSearchable: true` added to the complaint type dropdown:

```js
{
  name: "SelectComplaintType",
  optionsKey: "i18nKey",
  error: "CORE_COMMON_REQUIRED_ERRMSG",
  isSearchable: true,
}
```

`src/components/BoundaryComponentWithCard.js` — `isSearchable={true}` added to the `BoundaryDropdown` component:

```jsx
<Dropdown
  style={{ marginBottom: "1.5rem" }}
  selected={selected}
  t={t}
  option={data}
  optionKey={"code"}
  select={(value) => onChange(value)}
  isSearchable={true}
/>
```

No option data, query, validation or workflow behaviour changed — only the dropdown's input affordance.

---

## Package and Dependency Updates

| Package | v2.1 | v2.2 |
|---|---|---|
| `@egovernments/digit-ui-react-components` | 2.0.0-dev-18 | 2.0.0-dev-21 |
| `@egovernments/digit-ui-svg-components` | 2.0.0-dev-08 | 2.0.0-dev-11 |
| `@egovernments/digit-ui-components` | 2.0.0-dev-64 | 2.0.0-dev-79 |

---

## Complete Change History (v2.2)

Range: `HCM-v2.1`..`HCM-v2.2`

| PR | What changed in pgr |
|---|---|
| [#4514](https://github.com/egovernments/DIGIT-Frontend/pull/4514) | `package.json` version bump only. No source changes in pgr. |
| [#4544](https://github.com/egovernments/DIGIT-Frontend/pull/4544) | `package.json` version bump only. No source changes in pgr. |
| [#4549](https://github.com/egovernments/DIGIT-Frontend/pull/4549) | `package.json` version bump only. No source changes in pgr. |
| [#4569](https://github.com/egovernments/DIGIT-Frontend/pull/4569) | `package.json` version bump only. No source changes in pgr. |
| [#4629](https://github.com/egovernments/DIGIT-Frontend/pull/4629) | `isSearchable` added to the complaint type dropdown and the boundary dropdown. |
| [#4701](https://github.com/egovernments/DIGIT-Frontend/pull/4701) | `package.json` version bump only. No source changes in pgr. |

---

## Testing Checklist

- [ ] File complaint — type into the complaint type dropdown; options filter correctly
- [ ] Boundary selection card — dropdown accepts typed search
- [ ] Complaint submits correctly with a searched-and-selected type
- [ ] Existing complaint inbox filters and workflow actions unaffected
