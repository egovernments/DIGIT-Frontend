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

At the start of each session, users select their boundary hierarchy from a dedicated selection screen. Inbox filters are always reset at the start of a new session — they do not carry over.

In HCM v2.1, this is a **platform migration release** — the module has been moved from React 17 to React 19 and now ships as part of the `payments-ui` build variant. Bug fixes were applied during and after migration.

---

## What is this release about?

The v2.1 release focused on:

1. **Platform migration** — the module has been ported from the older React 17 stack to React 19.
2. **New deployment method** — Complaints Management is now shipped as part of the `payments-ui` build and served from a new URL path.
3. **Three bug fixes** — a broken action modal, a crash in the complaint timeline, and a date picker styling issue.

After v2.1, additional capabilities and fixes were added:

4. **Hierarchy selection screen** — users now pick their boundary hierarchy at the start of each session from a dedicated screen, replacing the automatic MDMS-driven resolution.
5. **PGR inbox hierarchyType fix** — `hierarchyType` is now correctly included in the `/inbox/v2/_search` request payload.
6. **Boundary component labels fix** — boundary labels in the PGR filter now show translated names.
7. **Date picker fix** — `DatePickerComponent.js` rendering corrected.

---

## ⚠️ Action Required Before Upgrading

### Deploy the new `payments-ui` variant

Complaints Management is no longer served from the old React 17 standalone shell. Deploy the new `payments-ui` Docker image and configure its route.

> Set up the nginx route at `/payments-ui/` when deploying the new Docker image. The old deployment path will no longer serve Complaints Management. Note: HRMS and Health Payments are also bundled in the same `payments-ui` variant.

---

## What Changed

### Hierarchy selection screen

At the start of each session, users now see a dedicated **Select Hierarchy** screen before reaching the complaint inbox. They pick the boundary hierarchy to use for that session, and the inbox is scoped to the selected hierarchy.

- Available hierarchies are fetched from the Boundary Management API — no MDMS configuration needed for the selection itself.
- The `PGR.HierarchySelectedForPGR` MDMS master is no longer used.
- Module.js clears the previously stored hierarchy on mount, so users always select fresh at the start of each session.
- Boundary localizations for the selected hierarchy are loaded automatically before the inbox appears.

---

### PGR inbox hierarchyType fix

**Before:** The complaint inbox search always sent `moduleSearchCriteria: {}` to the API — the selected `hierarchyType` was never included in the search payload, causing "Mandatory fields missing" errors from the backend.

**After:** Fixed. `hierarchyType` is now correctly included in the search payload. The fix involves three files: `PGRInbox.js` (reads hierarchy into React state, immune to session storage clearing), `PGRSearchInboxConfig.js` (accepts hierarchyType parameter and includes it in filter defaults), and `UIcustomizations.js` preProcess (explicitly adds `hierarchyType` to the built `moduleSearchCriteria`).

---

### Boundary component labels fix 

Boundary labels in the PGR filter (`BoundaryComponentWithCard.js`) now show translated names instead of raw boundary codes.

---

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

### PGR inbox hierarchyType missing from search payload 

**Before:** The complaint inbox search call always sent `moduleSearchCriteria: {}`. The selected hierarchy was never included, causing "Mandatory fields missing" errors from the backend.

**After:** Fixed. `hierarchyType` is now correctly sent in `moduleSearchCriteria`.

---

### Boundary labels not translated in PGR filter 

**Before:** `BoundaryComponentWithCard.js` displayed raw boundary codes instead of translated boundary names.

**After:** Fixed. Boundary labels are now resolved through the localization system.

---

### Date picker rendering fix (post-v2.1)

`DatePickerComponent.js` styling corrected for consistent rendering across screen sizes.

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

> **Note on boundary scoping:** On startup, `Module.js` clears any previously stored hierarchy. The user selects a hierarchy from the `select-hierarchy` screen. After selection, boundary localizations for that hierarchy are loaded and the inbox is scoped to the selected hierarchy and the user's assigned boundary.

---

## How Access and Permissions Work

| Role / Access | What they can do |
|---|---|
| All authenticated employees | File a complaint, view the complaint inbox, view complaint details |
| Assigned supervisors | Take workflow actions (Assign, Resolve, Reject, Reassign) within their boundary scope |

---

## Localisation

Translation keys are now centralised in `src/utils/i18nKeyConstants.js`, replacing string literals that were previously scattered across components and pages.

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
