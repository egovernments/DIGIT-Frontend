# Health HRMS — HCM v2.2 Technical Documentation

**Module:** `@egovernments/digit-ui-module-health-hrms`
**Release:** HCM v2.2
**Previous release:** [HCM v2.1](../v2.1/TECHNICAL-DOC.md)
**Stack:** React 19, Webpack 5
**Deployed under:** `payments-ui` build variant at `/payments-ui/`
**Repository:** [egovernments/DIGIT-Frontend](https://github.com/egovernments/DIGIT-Frontend)

---

## Overview

Health HRMS provides the web interface for managing health campaign field workers. All data is scoped by boundary — users only see employees within the geographic area they are assigned to at login.

**HCM v2.2 is a small-change release for this module.** Architecture, screens, routes, hooks, API integrations and configuration are unchanged from v2.1 — see the [v2.1 technical documentation](../v2.1/TECHNICAL-DOC.md) for that material.

Three source files changed. Nothing else in the module was touched.

---

## What Changed in v2.2

### Searchable dropdowns on create employee and boundary selection

**Ticket:** HCMPRE-4628
**PR:** [#4629](https://github.com/egovernments/DIGIT-Frontend/pull/4629)

Four dropdowns opted in to the search behaviour provided by `digit-ui-components`. This is an explicit per-field change in HRMS source — it is not inherited automatically from the dependency upgrade.

`src/components/config/createEmployeeConfig.js` — `isSearchable: true` added to three MDMS-backed dropdowns:

| Field | MDMS master |
|---|---|
| Employee Type | `EmployeeType` |
| Department | `Department` |
| Designation | `Designation` |

`src/components/pageComponents/SelectEmployeeBoundary.js` — `isSearchable={true}` added to the `BoundaryDropdown` component:

```jsx
<Dropdown
  selected={selected}
  t={t}
  select={onChange}
  isSearchable={true}
/>
```

No option data, query or validation changed — only the dropdown's input affordance.

---

### `alignFieldPairVerically` misspelling in the deactivate popup

**Ticket:** HCMPRE-4702
**PR:** [#4701](https://github.com/egovernments/DIGIT-Frontend/pull/4701)
**File:** `src/components/pageComponents/DeactivatePopUp.js`

Four `FieldV1` instances passed their populator as:

```js
populators={{ alignFieldPairVerically: true }}
```

`FieldV1` reads `alignFieldPairVertically`. The misspelled key was simply never read, so the request was silently dropped and the fields rendered with the default layout. There was no error or warning — the property was ignored.

All four occurrences are now spelled `alignFieldPairVertically`, covering the comment field, the effective date picker, the document upload field and the remarks field.

> This is a behaviour change on screen: the fields now render vertically where they previously rendered side by side. That is the layout originally intended by the code.

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

| PR | What changed in health-hrms |
|---|---|
| [#4514](https://github.com/egovernments/DIGIT-Frontend/pull/4514) | `package.json` version bump only. No source changes in health-hrms. |
| [#4544](https://github.com/egovernments/DIGIT-Frontend/pull/4544) | `package.json` version bump only. No source changes in health-hrms. |
| [#4549](https://github.com/egovernments/DIGIT-Frontend/pull/4549) | `package.json` version bump only. No source changes in health-hrms. |
| [#4569](https://github.com/egovernments/DIGIT-Frontend/pull/4569) | `package.json` version bump only. No source changes in health-hrms. |
| [#4629](https://github.com/egovernments/DIGIT-Frontend/pull/4629) | `isSearchable` added to three create-employee dropdowns and the boundary dropdown. |
| [#4701](https://github.com/egovernments/DIGIT-Frontend/pull/4701) | `alignFieldPairVerically` corrected to `alignFieldPairVertically` in four places. `package.json` version bump. |

---

## Testing Checklist

- [ ] Create employee — type into Employee Type, Department and Designation; options filter correctly
- [ ] Employee boundary screen — boundary dropdown accepts typed search
- [ ] Deactivate employee popup — comment, effective date, upload and remarks render vertically aligned
- [ ] Deactivation still submits correctly with the corrected layout
