# Health Payments — HCM v2.2 Technical Documentation

**Module:** `@egovernments/digit-ui-module-health-payments`
**Release:** HCM v2.2
**Previous release:** [HCM v2.1](../v2.1/TECHNICAL-DOC.md)
**Stack:** React 19, Webpack 5
**Deployed under:** `payments-ui` build variant at `/payments-ui/`
**Repository:** [egovernments/DIGIT-Frontend](https://github.com/egovernments/DIGIT-Frontend)

---

## Overview

Health Payments manages the payment cycle for health campaign field workers, from attendance capture through bill generation to payment approval. The module is driven by the `HCM.paymentsConfig` MDMS block and will not load without it.

**HCM v2.2 is a bug-fix-only release for this module.** Architecture, screens, routes, hooks, API integrations and configuration are unchanged from v2.1 — see the [v2.1 technical documentation](../v2.1/TECHNICAL-DOC.md) for that material.

One source file changed. Nothing else in the module was touched.

---

## What Changed in v2.2

### Session storage written during render, including the full `children` array

**Ticket:** HCMPRE-4702
**PR:** [#4701](https://github.com/egovernments/DIGIT-Frontend/pull/4701)
**File:** `src/components/BoundaryComponent.js`

`BoundaryDropdown` wrote the current selection to session storage as a statement in the component body:

```js
const BoundaryDropdown = ({ label, data, onChange, selected, ... }) => {
  const { t } = useTranslation();
  Digit.SessionStorage.set("paymentInbox", selected);
```

Two problems:

1. **Side effect during render.** The write executed on every render of the component, not only when `selected` changed. Writing to external state from the render path is unsafe under React 19's concurrent rendering, where a render may be started and discarded.
2. **Oversized payload.** `selected` is a boundary node carrying its full `children` array. The whole subtree below the selected boundary was serialised into session storage on each write.

The write moved into an effect keyed on the selection, with `children` stripped before storing:

```js
useEffect(() => {
  if (!selected) return;
  const { children: _children, ...slim } = selected;
  Digit.SessionStorage.set("paymentInbox", slim);
}, [selected]);
```

**Behaviour notes:**
- The early return means no write occurs while the selection is empty. Previously a falsy `selected` was written through.
- Consumers of the `paymentInbox` session key now receive an object without `children`. Any code that read `paymentInbox.children` would need updating — no such reader exists in the module.

`useEffect` was already imported in this file; no import change was required.

---

## Package and Dependency Updates

| Package | v2.1 | v2.2 |
|---|---|---|
| `@egovernments/digit-ui-components` | 2.0.0-dev-64 | 2.0.0-dev-78 |

`@egovernments/digit-ui-react-components` is pinned to `*` and did not change. This module declares no `digit-ui-svg-components` dependency.

---

## Complete Change History (v2.2)

Range: `HCM-v2.1`..`HCM-v2.2`

| PR | What changed in health-payments |
|---|---|
| [#4514](https://github.com/egovernments/DIGIT-Frontend/pull/4514) | `package.json` version bump only. No source changes in health-payments. |
| [#4544](https://github.com/egovernments/DIGIT-Frontend/pull/4544) | `package.json` version bump only. No source changes in health-payments. |
| [#4549](https://github.com/egovernments/DIGIT-Frontend/pull/4549) | `package.json` version bump only. No source changes in health-payments. |
| [#4569](https://github.com/egovernments/DIGIT-Frontend/pull/4569) | `package.json` version bump only. No source changes in health-payments. |
| [#4701](https://github.com/egovernments/DIGIT-Frontend/pull/4701) | `paymentInbox` session storage write moved into `useEffect` and `children` stripped. `package.json` version bump. |

---

## Testing Checklist

- [ ] Select a boundary in the payment inbox — selection persists across navigation as before
- [ ] Session storage `paymentInbox` entry contains the boundary fields but no `children` array
- [ ] Clear the selection — no stale write occurs
- [ ] Deep hierarchy selection — session storage entry stays small
