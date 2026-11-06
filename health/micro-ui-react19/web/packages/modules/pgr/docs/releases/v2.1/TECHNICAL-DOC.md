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
| `c1ae9e29` | — | [#4228](https://github.com/egovernments/DIGIT-Frontend/pull/4228) | Added TECHNICAL_DOC.md documentation |
| `ff2c862182` | HCMPRE-3684 | [#4281](https://github.com/egovernments/DIGIT-Frontend/pull/4281) | Hierarchy selection screen added; `Module.js` fetches all hierarchies and clears session on mount; `index.js` redirects to `select-hierarchy` if none selected; PGRSearchInboxConfig accepts `hierarchyType` param; new i18n keys; boundary localizations fetched per selected hierarchy |
| `ec9d53b55c` | HCMPRE-4247 | [#4251](https://github.com/egovernments/DIGIT-Frontend/pull/4251) | Complaints date picker fix in `DatePickerComponent.js` |
| `4e0e7fd3a2` | HCMPRE-4286 | [#4298](https://github.com/egovernments/DIGIT-Frontend/pull/4298) | `PGRSearchInboxConfig` updated to accept `hierarchyType` parameter; filter defaultValues includes `hierarchyType` |
| `5bdd948140` | HCMPRE-4296 | [#4304](https://github.com/egovernments/DIGIT-Frontend/pull/4304) | PGR inbox hierarchyType fix — `PGRInbox.js` derives hierarchy from React state (immune to Module.js session clear); `UIcustomizations.js` preProcess now includes `hierarchyType` in built `moduleSearchCriteria` |
| `2376f890ac` | HCMPRE-0964 | [#4309](https://github.com/egovernments/DIGIT-Frontend/pull/4309) | `BoundaryComponentWithCard.js` boundary labels fix; CSS version update |

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

### Hierarchy Selection Screen

**Ticket:** HCMPRE-3684
**PR:** [#4281](https://github.com/egovernments/DIGIT-Frontend/pull/4281)

The module now shows a dedicated hierarchy selection screen at the start of each session instead of automatically resolving the hierarchy from MDMS. The selection is cleared on every module mount and the user must pick a hierarchy before reaching the complaint inbox.

**How it works:**

1. `Module.js` mounts → calls `Digit.SessionStorage.del("HIERARCHY_TYPE_SELECTED")` and fetches all available boundary hierarchies via `useFetchAllBoundaryHierarchies`.
2. `index.js` checks `Digit.SessionStorage.get("HIERARCHY_TYPE_SELECTED")` — if null (or just cleared), the router redirects to `/employee/pgr/select-hierarchy`.
3. `HierarchySelection.js` renders the available hierarchies as selectable cards. The user picks one and submits.
4. The selected hierarchy is stored as `{ hierarchyType: "<type>" }` in `Digit.SessionStorage` under `HIERARCHY_TYPE_SELECTED`.
5. The router redirects to the complaint inbox (`inbox-v2`).
6. `PGRInbox.js` reads the stored value into React state (`useState(Digit.SessionStorage.get("HIERARCHY_TYPE_SELECTED"))`) on first render, and derives `hierarchyType` from that state — not from a session storage read on every render, so it is immune to the Module.js session clear.
7. Boundary localizations for the selected hierarchy are fetched in `PGRInbox.js` via `Digit.Services.useStore` with `moduleCode = [boundary-{hierarchyType}]`.

**New file:** `src/pages/employee/HierarchySelection.js` — full-page hierarchy picker.

**No MDMS configuration required** for the selection screen itself. All available hierarchies are fetched from the Boundary Management API (`/boundary-service/boundary-hierarchy-definition/_search`).

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

### PGR Inbox — `hierarchyType` Missing from Search Payload

**Ticket:** HCMPRE-4296
**PRs:** [#4298](https://github.com/egovernments/DIGIT-Frontend/pull/4298), [#4304](https://github.com/egovernments/DIGIT-Frontend/pull/4304)

**Before:** The `/inbox/v2/_search` API call always sent `moduleSearchCriteria: {}` — `hierarchyType` never appeared in the payload even though the config and filter form contained it.

**Root cause:** `UIcustomizations.js` `preProcess` completely replaces `data.body` with a fresh object it builds from scratch. The static `requestBody` in `PGRSearchInboxConfig.js` is irrelevant — if `preProcess` does not explicitly add a field, it is lost from the final API request. `hierarchyType` was missing from the `preProcess` build logic.

**Additionally:** `PGRSearchInboxConfig()` was called with no argument at initial render (before hierarchy was resolved from session storage). `Module.js` clears `HIERARCHY_TYPE_SELECTED` from session storage on mount, so any read of session storage at static config creation time would also return null. This meant even filter `defaultValues` contained a null `hierarchyType`.

**Fix (three-part):**

1. **`PGRInbox.js`** — reads `HIERARCHY_TYPE_SELECTED` from session storage into React `useState` once on first render. State is immune to Module.js clearing the session key after mount. `hierarchyType` is derived from this state, and `PGRSearchInboxConfig(hierarchyType)` is called inside `useMemo([hierarchyType])`.

2. **`PGRSearchInboxConfig.js`** — accepts `hierarchyType = null` parameter. Sets `hierarchyType` in both the static `requestBody.inbox.moduleSearchCriteria` and the filter `defaultValues`. This makes `hierarchyType` available to `preProcess` via `filterForm.hierarchyType`.

3. **`UIcustomizations.js` `preProcess`** — now explicitly reads `hierarchyType` from `filterForm.hierarchyType` (populated via filter `defaultValues`) with a session storage fallback, and sets `moduleSearchCriteria.hierarchyType` when non-null.

---

### Boundary Component Labels Fix

**PR:** [#4309](https://github.com/egovernments/DIGIT-Frontend/pull/4309)

**Before:** `BoundaryComponentWithCard.js` was displaying boundary codes instead of translated boundary labels in the PGR filter.

**After:** Fixed. Boundary labels are now resolved through the localization system.

---

### Date Picker Fix

**PR:** [#4251](https://github.com/egovernments/DIGIT-Frontend/pull/4251)

**Before:** The date input field in `DatePickerComponent.js` used in the complaints filter and creation form had an inconsistent appearance on some screen sizes.

**After:** Fixed. `DatePickerComponent.js` styling corrected for consistent rendering.

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

### 2. Boundary Hierarchy Setup

The `HierarchySelection` screen fetches all available hierarchies directly from the Boundary Management API (`/boundary-service/boundary-hierarchy-definition/_search`). No MDMS master is required for hierarchy selection — the old `PGR.HierarchySelectedForPGR` MDMS entry is no longer used and can be ignored.

Ensure boundary hierarchy definitions are configured in the Boundary Management service before deployment. If no hierarchies are returned by the API, the selection screen will show no options.

---

## How the Module Works

### Screens and Routes

The module registers a React Router v6 sub-router under the employee path. Routes defined in `src/pages/employee/index.js`:

| Route (relative) | Component registered as | Description |
|---|---|---|
| `select-hierarchy` | `HierarchySelection` | Hierarchy picker — shown first; redirected here if `HIERARCHY_TYPE_SELECTED` is null in session storage |
| `create-complaint` | `PGRCreateComplaint` | Multi-step complaint creation form |
| `complaint-success` | `PGRResponse` | Success confirmation screen after filing |
| `complaint-failed` | `PGRResponse` | Failure screen after a failed create attempt |
| `complaint-details/:id` | `PGRComplaintDetails` | Complaint details + workflow action panel |
| `inbox-v2` | `PGRSearchInbox` | Filterable complaint inbox |

### Complaint Lifecycle Flow

```text
Create complaint
  (Boundary selection → Category → Description → File attachment)
  → Complaint inbox  (filter by status, category, boundary, date)
  → Complaint details
  → Take action  (Assign / Resolve / Reject / Reassign)
  → Timeline updated
```

**Note on inbox filters:** Filters applied in the complaint inbox are automatically cleared when `PGRModule` mounts (`Digit.SessionStorage.del("filtersForInbox")` is called in a `useEffect` with an empty dependency array). Users re-apply filters each time they navigate to the PGR module — this is intentional.

**Note on boundary scoping:** On startup, `Module.js` clears `HIERARCHY_TYPE_SELECTED` from session storage. `index.js` redirects to `select-hierarchy` if no hierarchy is in session storage. After the user picks a hierarchy on `HierarchySelection.js`, it is stored as `HIERARCHY_TYPE_SELECTED` and boundary localizations for that hierarchy are loaded. All complaint data shown in the inbox is automatically filtered to the selected hierarchy and the user's assigned boundary.

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
