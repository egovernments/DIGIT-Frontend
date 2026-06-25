# Complaints Management - UI


## Overview

The Complaints Management module provides the grievance management interface for health campaigns. It allows field staff and supervisors to file complaints, track them through a resolution workflow, and take action — all scoped to the geographic boundary the user is assigned to.

The complaint lifecycle is straightforward:

| Stage | Who acts |
|---|---|
| File a complaint | Any authenticated field staff or supervisor |
| Review in inbox | Filter by status, category, boundary, or date |
| Take action | Assigned supervisors — Assign, Resolve, Reject, or Reassign |
| Track progress | Anyone can view the complaint timeline |

The module works from a single MDMS configuration (`PGR.HierarchySelectedForPGR`) that determines which boundary hierarchy is used to scope all complaints. Inbox filters are always reset at the start of a new session — they do not carry over.

In HCM v2.1, this is a **platform migration release** — the module has been moved from React 17 to React 19 and now ships as part of the `payments-ui` build variant. Two bug fixes were also applied during migration.

---

## What is this release about?

This release does not add new features. It focuses on:

1. **Platform migration** — the module has been ported from the older React 17 stack to React 19.
2. **New deployment method** — Complaints Management   is now shipped as part of the `payments-ui` build and served from a new URL path.
3. **Three bug fixes** — a broken action modal, a crash in the complaint timeline, and a date picker styling issue.

---

## ⚠️ Action Required Before Upgrading

### Deploy the new `payments-ui` variant

Complaints Management is no longer served from the old React 17 standalone shell. Deploy the new `payments-ui` Docker image and configure its route.

> Set up the nginx route at `/payments-ui/` when deploying the new Docker image. The old deployment path will no longer serve Complaints Management. Note: HRMS and Health Payments are also bundled in the same `payments-ui` variant.

---

## What Changed

### React 19 migration

The entire module has been ported from React 17 to React 19, including an upgrade of the routing library from an older to a newer version. This is an internal platform change — all screens and features work the same way for end users.

---

### New deployment variant — `payments-ui`

Complaints Management is now bundled and deployed as part of `payments-ui`, independently served at `/payments-ui/`. It shares this build with HRMS and Health Payments.

---

## Bug Fixes

### Complaints Managementt details — action modal not rendering

**Before:** When a user opened the Complaints Management's complaint details screen and tried to take an action (such as Assign or Resolve), the action modal failed to appear — nothing happened.

**After:** Fixed. The action modal now opens correctly, allowing supervisors to take workflow actions on complaints.

---

### Complaint timeline — crash when role data was missing

**Before:** The complaint timeline would crash and show an error if the roles associated with a timeline entry were null or missing — a situation that could occur with certain complaint records.

**After:** Fixed. The timeline now handles missing role data safely and displays without crashing.

---

### Date picker — styling fix

**Before:** The date input field in the complaint filter had sharp, inconsistent corners compared to other form fields.

**After:** Fixed. The date picker now has consistent rounded corners matching the rest of the UI.

---

## How the Module Works

### Complaint lifecycle flow

```
Create complaint
  (Boundary selection → Category → Description → File attachment)
  → Complaint inbox  (filter by status, category, boundary, date)
  → Complaint details
  → Take action  (Assign / Resolve / Reject / Reassign)
  → Timeline updated
```

> **Note on inbox filters:** Filters applied in the complaint inbox are automatically cleared at the start of every new session. Users will need to re-apply filters each time they log in — this is intentional behaviour.

> **Note on boundary scoping:** On startup, the module looks up the correct boundary hierarchy from MDMS and stores it for the session. All complaint data shown to a user is automatically filtered to their assigned boundary.

---

## How Access and Permissions Work

| Role / Access | What they can do |
|---|---|
| All authenticated employees | File a complaint, view the complaint inbox, view complaint details |
| Assigned supervisors | Take workflow actions (Assign, Resolve, Reject, Reassign) within their boundary scope |

---

## Localisation

| Key prefix | Where it is used |
|---|---|
| `HCM_PGR_*` | All Complaints Management screen labels |
| `HCM_*` | Shared HCM labels used across modules |
| `ACCESSCONTROL_ROLES_ROLES_*` | Role display names shown in the complaint timeline |

---

## API Integrations

| Endpoint | Method | Service / Hook | Purpose |
|---|---|---|---|
| `/{pgrContextPath}/v2/request/_search` | POST | `PGRService` | Search grievance requests |
| `/{pgrContextPath}/v2/request/_create` | POST | `PGRService` | Create grievance request |
| `/{pgrContextPath}/v2/request/_update` | POST | `PGRService` | Update grievance request (workflow action) |
| `/{projectContextPath}/staff/v1/_search` | POST | `ProjectService` | Search project staff (for boundary scoping) |
| `/{projectContextPath}/v1/_search` | POST | `ProjectService` | Search projects |
| `/boundary-service/boundary-relationships/_search` | POST | `BoundaryService` | Boundary-scoped complaint filtering |
| `/boundary-service/boundary-hierarchy-definition/_search` | POST | `useFetchAllHierarchies` | Fetch boundary hierarchy definitions |
| `/egov-workflow-v2/egov-wf/businessservice/_search` | POST | `Workflow` | Workflow business service config |
| `/egov-workflow-v2/egov-wf/process/_search` | POST | `Workflow` | Workflow process instances (complaint timeline) |

**Context path config keys** (from `window.globalConfigs.getConfig()`):
- `PGR_SERVICE_PATH` → PGR service base (default: `health-pgr-services`)
- `PROJECT_SERVICE_PATH` → Project service base (default: `health-project`)

---
