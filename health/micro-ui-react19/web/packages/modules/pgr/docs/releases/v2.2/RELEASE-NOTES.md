# Complaints Management - UI

**Release:** HCM v2.2
**Previous release:** [HCM v2.1](../v2.1/RELEASE-NOTES.md)
**Module:** `@egovernments/digit-ui-module-health-pgr`

---

## Overview

The Complaints Management module provides the grievance management interface for health campaigns. Field staff and supervisors file complaints, track them through a resolution workflow, and take action — all scoped to the geographic boundary the user is assigned to.

Screens, the complaint lifecycle, roles, workflows and API integrations are **unchanged in this release**. For that material see the [v2.1 release notes](../v2.1/RELEASE-NOTES.md).

---

## What is this release about?

This release contains **one usability improvement**. There are no bug fixes in this module for v2.2.

- No new features
- No new screens
- No new API endpoints
- No MDMS or configuration changes
- No action required before upgrading

---

## What Changed

### Complaint type and boundary dropdowns are now searchable

**Before:** The complaint type dropdown on the file complaint screen, and the boundary dropdown used on the boundary selection card, could only be browsed by scrolling. On deployments with long complaint type lists this made selection slow.

**After:** Both dropdowns accept typed text and filter their options as you type. Scrolling still works as before — nothing is removed, searching is simply available in addition.

Files changed:
- `src/configs/CreateComplaintConfig.js` — complaint type dropdown
- `src/components/BoundaryComponentWithCard.js` — boundary dropdown

---

## Package and Dependency Updates

| Package | v2.1 | v2.2 |
|---|---|---|
| `@egovernments/digit-ui-react-components` | 2.0.0-dev-18 | 2.0.0-dev-21 |
| `@egovernments/digit-ui-svg-components` | 2.0.0-dev-08 | 2.0.0-dev-11 |
| `@egovernments/digit-ui-components` | 2.0.0-dev-64 | 2.0.0-dev-78 |

The module's own package version is unchanged at `0.0.2`.

---

## What did not change

| Area | Status |
|---|---|
| Screens and navigation | Unchanged |
| Complaint workflow and statuses | Unchanged |
| API integrations | Unchanged |
| Roles and permissions | Unchanged |
| MDMS configuration | Unchanged |
| Localisation keys | Unchanged |
| Deployment (`payments-ui` variant at `/payments-ui/`) | Unchanged |
