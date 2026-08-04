# Complaints Management (PGR) — HCM v2.1 Technical Documentation

**Module:** `@egovernments/digit-ui-module-health-pgr`
**Release:** HCM v2.1
**Stack:** React 19, Webpack 5 (migrated from React 17)
**Deployed under:** `payments-ui` build variant at `/payments-ui/`
**Repository:** [egovernments/DIGIT-Frontend](https://github.com/egovernments/DIGIT-Frontend)

---

## Overview

The Complaints Management (PGR) module provides the grievance management interface for health campaigns. It allows field staff and supervisors to file complaints, track them through a resolution workflow, and take action — all scoped to the geographic boundary the user is assigned to.

**Complaint lifecycle:**

| Stage | Who acts |
|---|---|
| File a complaint | Any authenticated field staff or supervisor |
| Review in inbox | Filter by status, category, boundary, or date |
| Take action | Assigned supervisors — Assign, Resolve, Reject, or Reassign |
| Track progress | Anyone can view the complaint timeline |

**In HCM v2.1, this is a platform migration release.** The module has been moved from React 17 to React 19, and now ships under the new `payments-ui` deployment variant. Bug fixes and a localization refactor were also applied during and after migration.

---

## Commit Log

All commits that touched `health/micro-ui-react19/web/packages/modules/pgr/` on `master`:

| Commit | Ticket | PR | Summary |
|---|---|---|---|
| `3a15ec2f` | HCMPRE-3987 | [#3990](https://github.com/egovernments/DIGIT-Frontend/pull/3990) | React 19 migration — full module ported from React 17 |
| `90cad3b1` | HCMPRE-9876 | [#4037](https://github.com/egovernments/DIGIT-Frontend/pull/4037) | Date picker border-radius styling fix |
| `fc6ae91a` | HCMPRE-7656 | [#4039](https://github.com/egovernments/DIGIT-Frontend/pull/4039) | PGRDetails: action modal rendering fix + timeline crash fix |
| `ec1c990e` | HCMPRE-4093 | [#4102](https://github.com/egovernments/DIGIT-Frontend/pull/4102) | Added RELEASE-NOTES.md (documentation only) |
| `f9e58620` | HCMPRE-4120 | [#4124](https://github.com/egovernments/DIGIT-Frontend/pull/4124) | Package CSS version bump |
| `a8308ea8` | HCMPRE-4120 | [#4136](https://github.com/egovernments/DIGIT-Frontend/pull/4136) | All localization keys centralized to `i18nKeyConstants.js` |
| `7c007c97` | HCMPRE-4150 | [#4151](https://github.com/egovernments/DIGIT-Frontend/pull/4151) | Package version bump |
| `431094ab` | HCMPRE-8346 | [#4173](https://github.com/egovernments/DIGIT-Frontend/pull/4173) | Dependency vulnerability fixes (package.json) |
| `2864ce4d` | HCMPRE-4193 | [#4194](https://github.com/egovernments/DIGIT-Frontend/pull/4194) | Updated RELEASE-NOTES.md documentation |

---

## Migration from React 17 to React 19

**Ticket:** HCMPRE-3987
**PR:** [#3990](https://github.com/egovernments/DIGIT-Frontend/pull/3990)

The full module has been ported from the React 17 legacy stack to React 19 with Webpack 5. End users will not see any difference — all screens and features work exactly as before.

**What changed internally:**
- React Query v3 → TanStack Query v5
- React Router v5 → React Router v6
- Build output: `dist/index.js` (CJS, microbundle) → `dist/main.js` (Webpack 5)
- Module is now bundled and deployed as part of `payments-ui` alongside Health Payments and HRMS

**No new screens or features were added in this release.**

---

## What Changed in v2.1

### New Deployment Variant — `payments-ui`

Complaints Management is no longer served from the old React 17 standalone shell. It is now bundled and deployed as part of `payments-ui`, independently served at `/payments-ui/`.

---

### Hierarchy Source Changed — Now from MDMS

The module now reads the boundary hierarchy type from MDMS v2 instead of global config. On startup, `Module.js` calls `Digit.Hooks.useCustomMDMS` with module `PGR` and master `HierarchySelectedForPGR` (schema code: `PGR.HierarchySelectedForPGR`). It extracts `hierarchyTypeCode` from the first element of the result, then uses that value to filter `useFetchAllBoundaryHierarchies` and store the matching hierarchy object in `Digit.SessionStorage` under the key `HIERARCHY_TYPE_SELECTED`. This makes the hierarchy configurable per implementation without requiring a deployment change.

**Configuration required:** Ensure `PGR.HierarchySelectedForPGR` is present in MDMS with a valid `hierarchyTypeCode` field before deployment. If this master is missing, the module cannot resolve the boundary hierarchy and will not render (it blocks on the loader).

---

## Bug Fixes

### Date Picker — Styling Fix

**PR:** [#4037](https://github.com/egovernments/DIGIT-Frontend/pull/4037)

**Before:** The date input field in the complaint filter had sharp, inconsistent corners compared to other form fields.

**After:** Fixed. `borderRadius: "0.375rem"` was added to the inline style of the date picker wrapper in `DatePickerComponent.js`, giving it rounded corners consistent with the rest of the UI.

---

### Complaint Details — Action Modal Not Rendering + Timeline Crash

**PR:** [#4039](https://github.com/egovernments/DIGIT-Frontend/pull/4039)

This PR fixed two separate issues in `PGRDetails.js`-related components:

**Issue 1 — Action modal not rendering (`PGRWorkflowModal.js`):**
Before the fix, `FormComposerV2` was passed as an element inside the `children` prop array of the `PopUp` component (`children={[<div key="..."><FormComposerV2 .../></div>]}`). The `PopUp` component in the React 19 design system expects actual JSX children — not a `children` prop — so the form never rendered and the modal appeared empty. The fix moved `FormComposerV2` to be a real JSX child between `<PopUp>` and `</PopUp>` tags.

**Issue 2 — Timeline crash when role data was missing (`TimeLineWrapper.js`):**
The timeline crashed when a workflow instance's `roles` array was `null` or `undefined`, because `.map(...).join(", ")` was called on the result of `.map()` without optional chaining. The fix changed `.join(", ")` to `?.join(", ")` at both the `assignes` and `assigner` role display sites, so that a null `roles` array safely falls through to the `|| t("NA")` fallback.

---

## Localization Refactor

### Centralized i18n Key Constants

**Ticket:** HCMPRE-4120
**PR:** [#4136](https://github.com/egovernments/DIGIT-Frontend/pull/4136)

All localization key string literals that were previously scattered across component and page files have been moved into a single constants file at `src/utils/i18nKeyConstants.js`, exported as the `I18N_KEYS` object. Components and pages now import from this file rather than using inline string literals.

---

## Maintenance Commits

The following commits made no functional changes to the module's UI or behaviour:

| PR | Change |
|---|---|
| [#4102](https://github.com/egovernments/DIGIT-Frontend/pull/4102) | Added `RELEASE-NOTES.md` to the module directory |
| [#4124](https://github.com/egovernments/DIGIT-Frontend/pull/4124) | Bumped CSS package version in `package.json` |
| [#4151](https://github.com/egovernments/DIGIT-Frontend/pull/4151) | Bumped package version in `package.json` |
| [#4173](https://github.com/egovernments/DIGIT-Frontend/pull/4173) | Updated dependency versions in `package.json` for vulnerability fixes |
| [#4194](https://github.com/egovernments/DIGIT-Frontend/pull/4194) | Updated `RELEASE-NOTES.md` documentation content |

---

## Configuration Required Before Deploying

### 1. Deploy the `payments-ui` Variant

Complaints Management is no longer served from the old React 17 standalone shell. Deploy the new `payments-ui` Docker image and configure the nginx route at `/payments-ui/`.

> Health Payments and HRMS are also bundled in the same `payments-ui` image.

### 2. Configure `PGR.HierarchySelectedForPGR` in MDMS

The module reads the boundary hierarchy type from this MDMS v2 master. Without it, the module cannot determine which hierarchy to use for scoping complaints and will block on the loading state.

**Required MDMS record shape:**
```json
{
  "hierarchyTypeCode": "<your-hierarchy-type>"
}
```

---

## How the Module Works

### Screens and Routes

The module registers a React Router v6 sub-router under the employee path. Routes defined in `src/pages/employee/index.js`:

| Route (relative) | Component registered as | Description |
|---|---|---|
| `create-complaint` | `PGRCreateComplaint` | Multi-step complaint creation form |
| `complaint-success` | `PGRResponse` | Success confirmation screen after filing |
| `complaint-failed` | `PGRResponse` | Failure screen after a failed create attempt |
| `complaint-details/:id` | `PGRComplaintDetails` | Complaint details + workflow action panel |
| `inbox-v2` | `PGRSearchInbox` | Filterable complaint inbox |

### Complaint Lifecycle Flow

```
Create complaint
  (Boundary selection → Category → Description → File attachment)
  → Complaint inbox  (filter by status, category, boundary, date)
  → Complaint details
  → Take action  (Assign / Resolve / Reject / Reassign)
  → Timeline updated
```

**Note on inbox filters:** Filters applied in the complaint inbox are automatically cleared at the start of every new session (`Digit.SessionStorage.del("filtersForInbox")` is called in `PGRModule` on mount). Users re-apply filters each time they log in — this is intentional.

**Note on boundary scoping:** On startup, the module reads the boundary hierarchy from MDMS (`PGR.HierarchySelectedForPGR`) and stores the matching hierarchy object in `SessionStorage["HIERARCHY_TYPE_SELECTED"]`. All complaint data shown to a user is automatically filtered to their assigned boundary.

### Action Configurations

Workflow action modal forms (Assign, Reject, Resolve) are defined as static `ACTION_CONFIGS` in `PGRDetails.js`. Each config specifies the form fields rendered inside `PGRWorkflowModal`. A TODO in the source notes these configs should eventually be moved to MDMS.

---

## Roles and Permissions

| Role / Access | What they can do |
|---|---|
| All authenticated employees | File a complaint, view the complaint inbox, view complaint details |
| Assigned supervisors | Take workflow actions (Assign, Resolve, Reject, Reassign) within their boundary scope |

---

## API Integrations

| Endpoint | Method | Service | Purpose |
|---|---|---|---|
| `/{pgrContextPath}/v2/request/_search` | POST | `PGRService` | Search grievance requests |
| `/{pgrContextPath}/v2/request/_create` | POST | `PGRService` | Create grievance request |
| `/{pgrContextPath}/v2/request/_update` | POST | `PGRService` | Update grievance request (workflow action) |
| `/{projectContextPath}/staff/v1/_search` | POST | `ProjectService` | Search project staff (boundary scoping) |
| `/{projectContextPath}/v1/_search` | POST | `ProjectService` | Search projects |
| `/boundary-service/boundary-relationships/_search` | POST | `BoundaryService` | Boundary-scoped complaint filtering |
| `/boundary-service/boundary-hierarchy-definition/_search` | POST | `useFetchAllBoundaryHierarchies` | Fetch boundary hierarchy definitions |
| `/egov-workflow-v2/egov-wf/businessservice/_search` | POST | `Workflow` | Workflow business service config |
| `/egov-workflow-v2/egov-wf/process/_search` | POST | `Workflow` | Workflow process instances (complaint timeline) |

**Context path config keys** (`window.globalConfigs.getConfig()`):
- `PGR_SERVICE_PATH` → PGR service base (default: `health-pgr-services`)
- `PROJECT_SERVICE_PATH` → Project service base (default: `health-project`)

---

## Localisation

Translation keys are centralised in `src/utils/i18nKeyConstants.js` and exported as the `I18N_KEYS` object. All components and pages import from this file.

| Key prefix | Where it is used |
|---|---|
| `CS_*` | Complaint screen labels (details, status, area, timeline, actions) |
| `HCM_*` | Shared HCM labels used across modules (pagination, hierarchy labels) |
| `CORE_*` | Core form validation messages |
| `ACTION_TEST_*` | Breadcrumb navigation labels |
| `PGR_*` | PGR-specific labels (inbox heading, create another complaint, etc.) |
| `WF_*` | Workflow status display labels |
| `ES_*` | Common employee labels (contact details, take action) |
| `ACCESSCONTROL_ROLES_ROLES_*` | Role display names shown in the complaint timeline |
