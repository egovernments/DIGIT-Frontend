# Campaign Manager — HCM v2.1 Technical Documentation

**Module:** `@egovernments/digit-ui-module-campaign-manager`
**Release:** HCM v2.1
**Stack:** React 19, Webpack 5
**Repository:** [egovernments/DIGIT-Frontend](https://github.com/egovernments/DIGIT-Frontend)

---

## Overview

The Campaign Manager module handles the complete campaign lifecycle — from creating a campaign and selecting boundaries, to configuring the mobile app, managing delivery cycles, and setting up attendance registers.

In HCM v2.1, three major capabilities were added:

1. **Multi-hierarchy boundary selection** — the campaign creation wizard now has a dedicated hierarchy selection step (step 4 of the initial 4-step setup), and the chosen hierarchy is locked once the campaign is created.
2. **Attendance Register Setup** — a post-creation flow to configure attendance registers, upload attendance data, and map users, all within the campaign workflow.
3. **Commodity Management** — a new module for tracking stock across warehouses, creating shipments, and bulk uploading stock transactions.

---

## What's New in v2.1

### 1. Multi-Hierarchy Boundary Selection

**Tickets:** HCMPRE-4042, HCMPRE-4059
**PRs:** [#4045](https://github.com/egovernments/DIGIT-Frontend/pull/4045), [#4060](https://github.com/egovernments/DIGIT-Frontend/pull/4060), [#4065](https://github.com/egovernments/DIGIT-Frontend/pull/4065), [#4071](https://github.com/egovernments/DIGIT-Frontend/pull/4071), [#4077](https://github.com/egovernments/DIGIT-Frontend/pull/4077), [#4080](https://github.com/egovernments/DIGIT-Frontend/pull/4080)

The initial campaign setup wizard has 4 steps. **Select Hierarchy** is the new addition — it was inserted as **step 4 (the final step)** of this initial phase:

| Step | Screen | What the user does |
|---|---|---|
| 1 | Campaign Type | Choose campaign type and delivery cycle |
| 2 | Campaign Name | Enter campaign name |
| 3 | Campaign Dates | Set start and end dates |
| **4** | **Select Hierarchy** | **Choose the boundary hierarchy type — campaign draft is saved on submit** |

After step 4, the campaign draft is created and the user moves to the full setup wizard (`SetupCampaign`) where they select boundaries using the hierarchy chosen in step 4, configure delivery cycles, and upload data. **The hierarchy value selected in step 4 is passed as the `hierarchyData` prop to the boundary selection screen (step 2 of the full wizard), so the boundary tree is filtered to show only boundaries belonging to that hierarchy.**

**Key behaviour:**
- All available hierarchy types are fetched from the Boundary Management API (`/boundary-service/boundary-hierarchy-definition/_search`) and shown as selectable cards.
- Each card shows the hierarchy name and its boundary levels (L1, L2, L3...). Cards with no boundary levels are disabled.
- A search bar filters visible hierarchy cards by name.
- Each card shows a real-time status tag — "Boundary Data Active" (green) if boundary data exists for that hierarchy, "Boundary Data Inactive" (red) if none exists — populated by parallel batched calls to `/boundary-service/boundary-relationships/_search` (batch size 5 to avoid API flooding).
- If a hierarchy has more than 5 levels, a "View All Levels" button appears.
- Hierarchy **can be changed** after the campaign draft is saved. The Campaign Details screen has an "Edit" button that opens step 4 directly (`create-campaign?key=4&editName=true&id=...`).
- Submitting a different hierarchy in edit mode is only blocked if the new hierarchy has no boundary data. If it is the same hierarchy as the original, submission proceeds even without boundary data (to allow re-saving without changes).
- If a user switches to a different hierarchy after boundary data or uploaded files already exist, a confirmation popup warns them that dependent data will be cleared before proceeding.
- Cloning a campaign now correctly carries the source campaign's hierarchy to the cloned campaign.

**Configuration required:**
- Boundary hierarchy types must be configured in the Boundary Management service before users can create campaigns.
- No MDMS configuration needed for hierarchy selection itself — data is fetched from the API directly.

**New component:** `SelectHierarchy.js` (`src/components/CreateCampaignComponents/`)

---

### 2. Full Campaign Setup Wizard

The full setup wizard (`SetupCampaign`, powered by `CampaignConfig.js`) is entered after the 4-step `CreateCampaign` initial wizard completes and a campaign draft is created. It has **5 steps**, each containing one or more sub-screens:

| Step | Sub-screens | What happens |
|---|---|---|
| **1 — Campaign Details** | Campaign Type, Campaign Name, Campaign Dates, Campaign Details Summary | Reviews and confirms the campaign type, name, and dates. Summary screen validates details before proceeding. |
| **2 — Boundary Selection** | Boundary Selection, Boundary Summary | User selects the specific administrative boundaries for the campaign. The boundary tree is pre-filtered to the hierarchy chosen in the initial wizard. Boundary Summary is a submit step that persists selections. |
| **3 — Cycle & Delivery Config** | Cycle Configuration, Delivery Rules, Delivery Details Summary | User configures campaign cycles and delivery rules. Delivery rules are rendered via `@rjsf/core` (JSON Schema form) backed by MDMS. Delivery Details Summary is a submit step. |
| **4 — Data Upload** | Upload Facility Data, Upload User Data, Upload Boundary Data, Data Upload Summary | User uploads three Excel files — facility list, user list, and boundary assignments. Data Upload Summary reviews all three uploads before proceeding. |
| **5 — Campaign Summary** | Campaign Summary | Final review of all campaign data. Submitting this step creates or updates the campaign in the backend. |

Step 2 sub-screens use `SelectingBoundariesDuplicate` for the map/tree-based boundary picker. Step 3 delivery rules use the MDMS-backed RJSF form driven by the campaign type.

---

### 3. Attendance Register Setup (Post-Campaign Flow)

**Ticket:** HCMPRE-4085, HCMPRE-4139
**PRs:** [#4090](https://github.com/egovernments/DIGIT-Frontend/pull/4090), [#4158](https://github.com/egovernments/DIGIT-Frontend/pull/4158), [#4151](https://github.com/egovernments/DIGIT-Frontend/pull/4151)

After a campaign is created, program managers can configure attendance registers without leaving the campaign workflow. The entry point is `SetupAttendanceScreen`, which is a **hub screen** (not step 1 of a linear flow) displaying two action cards:

| Card | Destination screen | What it does |
|---|---|---|
| Create New Registers | `CreateRegistersScreen` | Multi-step flow to define and create attendance registers for the campaign |
| Map Users to Registers | `MapUsersToRegistersScreen` | Assign users to specific registers |

Additional screens in the same flow (accessible via separate navigation paths):

| Screen | File | Purpose |
|---|---|---|
| Attendance Upload | `AttendanceUploadScreen.js` | Upload attendance data via Excel |
| Map Attendees | `MapAttendeesScreen.js` | Map attendees to registers |
| Register Details | `RegisterDetailsScreen.js` | Review register configuration |
| Reports Configuration | `ReportsConfiguration.js` | Configure automated report generation (report type + frequency) |

Each screen reads and writes directly to the campaign API. Navigation uses `campaignName`, `campaignNumber`, and `tenantId` as query parameters throughout.

**All screens are located in:** `src/pages/employee/NewCampaignCreate/`

---

### 4. Commodity Management

**Ticket:** HCMPRE-4050
**PRs:** [#4077](https://github.com/egovernments/DIGIT-Frontend/pull/4077), [#4087](https://github.com/egovernments/DIGIT-Frontend/pull/4087)

A new module for tracking campaign stock across warehouses. Accessible from the campaign home screen via a dashboard card (visible only for commodity-type campaigns).

**Dashboard tabs:**

| Tab | What it shows |
|---|---|
| Stock Summary | Current stock levels per warehouse for the selected campaign |
| Pending Transactions | Stock transactions awaiting processing |
| Transaction Summary | Historical summary of all stock transactions |

**Additional screens:**

| Screen | What it does |
|---|---|
| Bulk stock upload | Upload multiple stock transactions via Excel file |
| Create shipment popup | Create a new shipment scoped to a warehouse |
| Edit shipment popup | Edit an existing shipment |

**Data source:** Stock data is fetched from Kibana/Elasticsearch via the `/dashboard-analytics/dashboard/getChartV2` endpoint.

**Configuration required:**
- Commodity management MDMS masters must be configured before enabling these screens.
- Hierarchy type for Commodity Management is derived from the campaign directly — no separate MDMS hierarchy configuration needed (changed in this release, see [#4166](https://github.com/egovernments/DIGIT-Frontend/pull/4166)).

**All components located in:** `src/components/CommodityManagement/`
**Route page:** `src/pages/employee/CommodityCampaigns.js`

**New hooks:**
- `useKibanaStockSearch` — queries Kibana for stock data
- `useStockData` — fetches stock data for dashboard tabs
- `useStockSearch` — stock search
- `useBatchStockCreation` — handles bulk stock record creation
- `useCommodityProjectSearch` — campaign search for commodity projects
- `useWarehouseManagerSync` — syncs warehouse state

---

## Changes to Existing Features

### Unified Campaign Excel Sheet — Always On

**PR:** [#4057](https://github.com/egovernments/DIGIT-Frontend/pull/4057)

The toggle that previously enabled multi-sheet Excel uploads has been removed. Unified-sheet upload is now the default for all campaigns — no configuration or toggle needed.

---

### Campaign State Consolidation & Boundary Selection Performance

**Ticket:** HCMPRE-4169
**PRs:** [#4170](https://github.com/egovernments/DIGIT-Frontend/pull/4170), [#4212](https://github.com/egovernments/DIGIT-Frontend/pull/4212), [#4215](https://github.com/egovernments/DIGIT-Frontend/pull/4215)

Campaign wizard state management was significantly consolidated:

- Reduced from 16 IndexedDB keys and 7 Redux slices to 1 IndexedDB key (`CAMPAIGN_APP_STATE`) and 4 slices (`campaign`, `attendance`, `hydration`, `ui`).
- Three duplicate keys (`HCM_CAMPAIGN_MANAGER_FORM_DATA`, `HCM_ADMIN_CONSOLE_SET_UP`, `HCM_ADMIN_CONSOLE_UPLOAD_DATA`) merged into a single `campaign.formData` slice field.
- Single debounced write-back to IndexedDB (500 ms delay) via the new `CAMPAIGN_APP_STATE` key.
- `useCampaignStore` bypasses the React component tree's Redux `<Provider>` by reading directly from the module-level `campaignStore` singleton via `useSyncExternalStore`, fixing crashes caused by nested Redux Provider trees (e.g. inside `DeliverySetup`).

Boundary selection was optimised for large hierarchies (50k+ boundaries):

- O(n²) tree walks replaced with `Map`/`Set`-based indexes.
- Filtered option lists are now memoized instead of being recomputed on every render.
- A loader overlay (via `useTransition`) shows during heavy operations like "Select All".

**New hook:** `useCampaignStore` — singleton campaign state store, synced via `useSyncExternalStore`.

---

### App Configuration — Preview During Live Campaigns, Form Elements Sidepanel, Category for Flows

**Ticket:** HCMPRE-3828

Several significant additions to the App Configuration screens:

- **Preview during live campaigns** — Form configs can now be previewed even after a campaign has started or is ongoing. Previously this was restricted to draft campaigns only.
- **Form elements sidepanel** — A new sidepanel lists all available form elements. Clicking an item opens the "Add Field" popup directly, making field addition faster.
- **Category for flows** — Flows can now be assigned a category, enabling the flow list to be split and filtered by category in the panel.
- **View Delivery Details on campaign creation** — Several rendering fixes for the delivery details view screen during campaign creation.
- **Campaign Summary Screen** — Breadcrumb navigation fixed to return to Campaign Home correctly; mobile country code property fixes applied.
- **Delivery Strategy page** — Scrolling-down issue fixed.

---

### Persistent Validation Status on File Upload

**Ticket:** HCMPRE-4139, HCMPRE-4206
**PRs:** [#4158](https://github.com/egovernments/DIGIT-Frontend/pull/4158), [#4216](https://github.com/egovernments/DIGIT-Frontend/pull/4216)

The upload screen now shows a persistent `AlertCard` summarising validation results (success / warning / error). It stays visible until a new file is uploaded, the file is removed, or validation restarts. The error code from the API response is shown directly on the card when validation fails.

---

### Shipment Excel Template — Styled

**PR:** [#4184](https://github.com/egovernments/DIGIT-Frontend/pull/4184)

The shipment bulk upload Excel template now has locked headers, a green background header row, and a larger font for better readability.

---

## Bug Fixes

| Issue | PR |
|---|---|
| Stale campaign data pre-fills "create from scratch" form after SPA navigation (hydration guard added to `campaignStore`); MultiSelectDropdown scroll fix; removed delivery-rule tabs when only 1 cycle and 1 delivery exists | [#4223](https://github.com/egovernments/DIGIT-Frontend/pull/4223) |
| Campaign creation — hierarchy popup, delivery rules, and multiple UI issues from final bug bash | [#4221](https://github.com/egovernments/DIGIT-Frontend/pull/4221) |
| Attendance OFC localization, sheet errors fix, custom reports UI-UX updates | [#4216](https://github.com/egovernments/DIGIT-Frontend/pull/4216) |
| Boundary selection page performance, dropdown rendering, Select All reset | [#4215](https://github.com/egovernments/DIGIT-Frontend/pull/4215) |
| Campaign status polling, double-submit on final step, MultiSelect clear bug, step navigation | [#4212](https://github.com/egovernments/DIGIT-Frontend/pull/4212) |
| Boundary loading toast blocking UI, persistence polling edge cases | [#4199](https://github.com/egovernments/DIGIT-Frontend/pull/4199) |
| Boundary data status tag missing for hierarchies (SelectHierarchy card) | [#4203](https://github.com/egovernments/DIGIT-Frontend/pull/4203) |
| Vulnerability fix — removed unused `@cyntler/react-doc-viewer` dependency | [#4173](https://github.com/egovernments/DIGIT-Frontend/pull/4173) |
| Commodity Management MDMS hierarchy type dependency removed | [#4166](https://github.com/egovernments/DIGIT-Frontend/pull/4166) |
| Localization issues in commodity management screens | [#4156](https://github.com/egovernments/DIGIT-Frontend/pull/4156) |
| Final audit fixes — attendance, reports, hierarchy screens; persistent upload AlertCard introduced | [#4158](https://github.com/egovernments/DIGIT-Frontend/pull/4158) |
| Individual context path issue in commodity screens | [#4152](https://github.com/egovernments/DIGIT-Frontend/pull/4152) |
| Checklist search, View Boundary pagination, and action popup title issues | [#4144](https://github.com/egovernments/DIGIT-Frontend/pull/4144) |
| Polio type sheets updated for localization | [#4146](https://github.com/egovernments/DIGIT-Frontend/pull/4146) |
| Localization keys moved to constants file; custom reports CSS fixes | [#4136](https://github.com/egovernments/DIGIT-Frontend/pull/4136), [#4124](https://github.com/egovernments/DIGIT-Frontend/pull/4124) |
| HierarchySchema filtering bug in Module.js MDMS dependency | [#4132](https://github.com/egovernments/DIGIT-Frontend/pull/4132) |
| Dates error in campaign setup | [#4125](https://github.com/egovernments/DIGIT-Frontend/pull/4125) |
| RECEIPT/EXCESS/LESS transactions double-counted in stock calculations | [#4122](https://github.com/egovernments/DIGIT-Frontend/pull/4122) |
| Shipment popup used wrong project for users with multiple projects | [#4110](https://github.com/egovernments/DIGIT-Frontend/pull/4110) |
| Commodity facility filtering broke for multi-project users | [#4108](https://github.com/egovernments/DIGIT-Frontend/pull/4108) |
| Validation toast showed blank text when a translation key was missing | [#4109](https://github.com/egovernments/DIGIT-Frontend/pull/4109) |
| Field matching in App Configuration could update the wrong field | [#4109](https://github.com/egovernments/DIGIT-Frontend/pull/4109) |
| Error message incorrectly shown in App Configuration phone preview (TextInputTemplate, DropdownTemplate, RadioListTemplate) | [#4105](https://github.com/egovernments/DIGIT-Frontend/pull/4105) |
| Dashboard UI/UX fixes, user activity tracking, custom reports UI introduced, attendance screen changes | [#4090](https://github.com/egovernments/DIGIT-Frontend/pull/4090) |
| Stock summary tab update | [#4087](https://github.com/egovernments/DIGIT-Frontend/pull/4087) |
| Stale campaign data shown after updating a campaign | [#4083](https://github.com/egovernments/DIGIT-Frontend/pull/4083) |
| Template polling timeout too short on slow networks | [#4081](https://github.com/egovernments/DIGIT-Frontend/pull/4081) |
| Hierarchy, name, boundary, loader, and cycle display refreshed incorrectly when switching | [#4080](https://github.com/egovernments/DIGIT-Frontend/pull/4080) |
| Clone campaign sent wrong hierarchy type to API | [#4071](https://github.com/egovernments/DIGIT-Frontend/pull/4071) |
| Multi-hierarchy API call ordering and boundary propagation bugs | [#4065](https://github.com/egovernments/DIGIT-Frontend/pull/4065) |
| Crash in delivery setup caused by nested Redux Provider | [#4170](https://github.com/egovernments/DIGIT-Frontend/pull/4170) |
| Payments UI/UX, ship commodity URL fix | [#4099](https://github.com/egovernments/DIGIT-Frontend/pull/4099) |
| General UI/UX and CSS issues across multiple screens | [#4117](https://github.com/egovernments/DIGIT-Frontend/pull/4117), [#4102](https://github.com/egovernments/DIGIT-Frontend/pull/4102) |
| Delivery Rules dropped on final submit | [#3889](https://github.com/egovernments/DIGIT-Frontend/pull/3889) |
| Tab overflow in campaign setup layout | [#3885](https://github.com/egovernments/DIGIT-Frontend/pull/3885) |
| Delivery summary not shown correctly on review screen | [#3884](https://github.com/egovernments/DIGIT-Frontend/pull/3884) |
| Blank upload screen caused by missing `customProps.type` | [#3882](https://github.com/egovernments/DIGIT-Frontend/pull/3882) |
| Step navigation skipping steps incorrectly due to custom MDMS logic | [#3861](https://github.com/egovernments/DIGIT-Frontend/pull/3861) |
| Flow Config Panel not opening/closing correctly; translator missing in Display Logic | [#3841](https://github.com/egovernments/DIGIT-Frontend/pull/3841) |
| App Configuration CSS revamp — mobile frame aspect ratio, toast animation, button labels, page tabs CSS | [#3839](https://github.com/egovernments/DIGIT-Frontend/pull/3839) |
| Checklist options not getting updated on state change | [#3848](https://github.com/egovernments/DIGIT-Frontend/pull/3848) |
| Checklist issue fix (CreateChecklist state handling) | [#3846](https://github.com/egovernments/DIGIT-Frontend/pull/3846) |
| Security fix — removed unused `@cyntler/react-doc-viewer` dependency | [#3847](https://github.com/egovernments/DIGIT-Frontend/pull/3847) |
| LabelFieldPairTemplate rendering fix; App Configuration CSS | [#3862](https://github.com/egovernments/DIGIT-Frontend/pull/3862) |
| Various App Configuration component fixes — ExpandableTemplate, InfoCardTemplate, QRView, SearchBar, PopUpConfigEditor | [#3851](https://github.com/egovernments/DIGIT-Frontend/pull/3851) |
| Fixed Delivery Strategy Configuration based on Observation Strategy | [#3818](https://github.com/egovernments/DIGIT-Frontend/pull/3818) |
| Animation and CSS fix | [#3823](https://github.com/egovernments/DIGIT-Frontend/pull/3823) |
| Comments removed from Checklist | [#3819](https://github.com/egovernments/DIGIT-Frontend/pull/3819) |
| View Checklist Table localization fixes for role names | [#3831](https://github.com/egovernments/DIGIT-Frontend/pull/3831) |
| Display Logic — missing translators added for placeholders | [#3830](https://github.com/egovernments/DIGIT-Frontend/pull/3830) |
| Updated data table styles | [#3814](https://github.com/egovernments/DIGIT-Frontend/pull/3814) |
| All UI/UX fixes for console | [#3812](https://github.com/egovernments/DIGIT-Frontend/pull/3812) |
| Fixed all locale values | [#3800](https://github.com/egovernments/DIGIT-Frontend/pull/3800) |
| Resolve edit button navigation issue | [#3793](https://github.com/egovernments/DIGIT-Frontend/pull/3793) |

---

## Configuration Required Before Deploying

### 1. Add `HIERARCHY_TYPE` to `globalConfig.js`

All deployment variants must include the `HIERARCHY_TYPE` key in `globalConfig.js`.
- **Default value:** `"ADMIN"`
- This key is consumed by boundary-scoped components across modules that still resolve hierarchy from global config. In v2.1 the campaign creation wizard uses dynamic API-based hierarchy selection (`SelectHierarchy`), but `HIERARCHY_TYPE` remains required as a fallback for other boundary-scoped flows that have not yet migrated to dynamic selection.

### 2. Set up Commodity Management MDMS Masters

If Commodity Management screens are needed, configure the required commodity and stock MDMS masters before enabling the module. Screens will not load correctly without them.

### 3. Boundary Hierarchy Setup

Boundary hierarchy types must be configured in the Boundary Management service. The SelectHierarchy screen reads from the API (`/boundary-service/boundary-hierarchy-definition/_search`) — no MDMS entry is needed for the hierarchy type itself.

---

## Roles and Permissions

| Role | What they can do |
|---|---|
| All authenticated employees | View campaign list and campaign details |
| System administrator | Retry a failed campaign creation |
| Campaign-scoped users | Create or update campaigns within their assigned boundary scope |

Role-based access for campaign actions is configured via MDMS — not hardcoded.

---

## New API Endpoints (v2.1)

| Endpoint | Method | Purpose |
|---|---|---|
| `/boundary-service/boundary-hierarchy-definition/_search` | POST | Fetch all hierarchy types for SelectHierarchy screen |
| `/boundary-service/boundary-relationships/_search` | POST | Parallel per-hierarchy boundary data status check (batched) |
| `/dashboard-analytics/dashboard/getChartV2` | POST | Stock and commodity data (Kibana-backed) |
| `/stock/v1/_search` | POST | Search stock records |
| `/stock/v1/bulk/_create` | POST | Batch-create stock transaction records |
| `/excel-ingestion/v1/data/process/_validation` | POST | Validate attendance register Excel |
| `/excel-ingestion/v1/data/process/_search` | POST | Poll Excel ingestion status |
| `/project-factory/v2/data/_process` | POST | Trigger campaign data processing (v2 endpoint) |

---

## Localisation

All translation keys are centralised in `src/utils/i18nKeyConstants.js` under the `I18N_KEYS` constant. New key namespaces added in v2.1:

| Namespace | Used for |
|---|---|
| `I18N_KEYS.COMMON` | Shared labels across campaign screens |
| `I18N_KEYS.CAMPAIGN_CREATE` | Campaign creation wizard labels |
| `I18N_KEYS.COMMODITY_MANAGEMENT` | All Commodity Management screen labels |
| `I18N_KEYS.APP_CONFIGURATION` | App configuration screen labels |

New keys were added for: hierarchy selection, commodity management, attendance register setup, and reports configuration screens.

---

## Summary of New Components and Hooks

| Component / Hook | Location | What it does |
|---|---|---|
| `SelectHierarchy.js` | `src/components/CreateCampaignComponents/` | Hierarchy type picker — step 4 (final step) of the initial 4-step campaign creation wizard |
| `CommodityCampaigns.js` | `src/pages/employee/` | Route page for the commodity management campaign list |
| `CommodityDashboard.js` | `src/components/CommodityManagement/` | Main commodity dashboard component (tabs, charts) |
| `StockSummaryTab.js` | `src/components/CommodityManagement/` | Stock summary tab |
| `PendingTransactionsTab.js` | `src/components/CommodityManagement/` | Pending transactions tab |
| `TransactionSummaryTab.js` | `src/components/CommodityManagement/` | Transaction summary tab |
| `BulkStockUpload.js` | `src/components/CommodityManagement/` | Bulk stock upload screen |
| `NewShipmentPopup.js` | `src/components/CommodityManagement/` | Create shipment popup |
| `CommodityShipmentPopup.js` | `src/components/CommodityManagement/` | Edit shipment popup |
| `HCMCommodityRowCard` | `src/components/` | Campaign home card for commodity campaigns |
| `useCampaignStore` | `src/hooks/` | Consolidated campaign state store (replaces 7 Redux slices + 16 IndexedDB keys; uses `useSyncExternalStore` bound to module-level singleton) |
| `useKibanaStockSearch` | `src/hooks/` | Queries Kibana for stock balance data |
| `useStockData` | `src/hooks/` | Stock data for dashboard tabs |
| `useBatchStockCreation` | `src/hooks/` | Bulk stock record creation |
| `useCommodityProjectSearch` | `src/hooks/` | Campaign search scoped to commodity projects |
| `useWarehouseManagerSync` | `src/hooks/` | Warehouse state sync with backend |
