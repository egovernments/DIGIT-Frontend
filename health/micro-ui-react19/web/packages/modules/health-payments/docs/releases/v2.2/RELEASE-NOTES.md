# Health Payments UI

**Release:** HCM v2.2
**Previous release:** [HCM v2.1](../v2.1/RELEASE-NOTES.md)
**Module:** `@egovernments/digit-ui-module-health-payments`

---

## Overview

The Health Payments module manages the complete payment cycle for health campaign field workers — from recording attendance in the field through to final bank-side payment approval.

Screens, roles, the `HCM.paymentsConfig` MDMS block, workflows and API integrations are **unchanged in this release**. For that material see the [v2.1 release notes](../v2.1/RELEASE-NOTES.md).

---

## What is this release about?

This release contains **one bug fix**.

- No new features
- No new screens
- No new API endpoints
- No MDMS or configuration changes
- No action required before upgrading

---

## Bug Fixes

### Boundary selection written to session storage on every render

**Before:** The boundary dropdown wrote the selected boundary to session storage directly in the component body, which means the write ran on every single render rather than only when the selection actually changed. The stored object also carried the selected boundary's entire `children` array, so the session storage entry grew with the size of the hierarchy below the selected node.

**After:** The write now runs only when the selection changes, and the `children` array is removed before storing. The stored entry keeps the boundary's own fields only.

This removes a side effect from the render path and keeps the session storage payload small on deep hierarchies.

File changed: `src/components/BoundaryComponent.js`

---

## Package and Dependency Updates

| Package | v2.1 | v2.2 |
|---|---|---|
| `@egovernments/digit-ui-components` | 2.0.0-dev-64 | 2.0.0-dev-79 |

`@egovernments/digit-ui-react-components` remains pinned to `*`. The module's own package version is unchanged at `1.0.0`.

---

## What did not change

| Area | Status |
|---|---|
| Screens and navigation | Unchanged |
| API integrations | Unchanged |
| Roles and permissions | Unchanged |
| `HCM.paymentsConfig` MDMS block | Unchanged |
| Localisation keys | Unchanged |
| Deployment (`payments-ui` variant at `/payments-ui/`) | Unchanged |
