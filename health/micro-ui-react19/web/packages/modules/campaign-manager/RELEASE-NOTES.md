# Campaign Manager


## Overview

Campaign Manager provides the full campaign lifecycle in one place — from creating a campaign and configuring the mobile app, to uploading boundary and beneficiary data, managing cycles and delivery rules, and setting up attendance registers.

In HCM v2.1, it gains two major new capabilities:

- **Commodity Management** — track warehouse stock, create shipments, and upload bulk stock transactions across campaigns.
- **Attendance Register Setup** — a post-creation flow to configure attendance registers directly within the campaign workflow.

It also introduces **multi-hierarchy boundary selection** at the start of campaign creation, giving program managers more control over how boundaries are structured for each campaign.

The module works across these data sources:

| Data source | What it powers |
|---|---|
| Campaign / project factory API | Campaign creation, update, and search |
| Boundary Management API | Hierarchy types and boundary data |
| MDMS (master data) | Campaign types, disease lists, app config templates, commodity config |
| Kibana / Elasticsearch | Stock and commodity data in Commodity Management |

---

## What is this release about?

This release adds three major areas to the Campaign Manager:

1. **Multi-hierarchy boundary selection** — users now pick a boundary hierarchy type at the start of campaign creation. Once set, it cannot be changed.
2. **Attendance Register Setup** — a step-by-step flow after campaign creation to configure registers, upload attendance, and map users.
3. **Commodity Management** — a new module for tracking stock across warehouses, creating shipments, and uploading bulk stock data.

It also removes the Excel upload feature toggle (multi-sheet is now always on) and fixes several campaign update reliability issues.

---

## ⚠️ Action Required Before Upgrading

### 1. Hierarchy is now chosen during campaign creation — and locked after

When creating a campaign, users will now see a new first step: **Select Hierarchy Type**. Once the campaign is created, this selection cannot be changed — not even during updates.

> Make sure your team understands this before going live. Picking the wrong hierarchy requires creating a new campaign.

### 2. Set up Commodity Management MDMS masters first

The Commodity Management screens read their campaign and stock configuration from MDMS at runtime. If the required MDMS masters are not configured before you enable the commodity screens, those screens will not work correctly.

> Configure the commodity and stock config masters in MDMS before enabling the Commodity Management module.

---

## What's New

### Multi-hierarchy selection step

A new **first step** has been added to the campaign creation wizard. Users select the boundary hierarchy type (e.g., administrative vs. health facility hierarchy) before filling in any other campaign details.

- Available hierarchy types are pulled from the Boundary Management API.
- The selection is saved to session storage and used by all subsequent steps in the wizard.
- During campaign updates, this step is shown as **read-only** — the hierarchy cannot be changed.

---

### Attendance Register Setup

After a campaign is created, users can now set up attendance registers without leaving the campaign workflow. The flow has seven steps:

| Step | What happens |
|---|---|
| 1. Setup Attendance | Entry screen — initiates the register setup process |
| 2. Create Registers | Define the registers for the campaign |
| 3. Attendance Upload | Upload attendance data via Excel |
| 4. Map Attendees | Map attendees to registers |
| 5. Map Users to Registers | Assign users to specific registers |
| 6. Register Details | Review register configuration |
| 7. Reports Configuration | Set up attendance reporting |

Each step reads and writes directly to the campaign API — they do not share state with each other. Navigation between steps uses campaign name, campaign number, and tenant ID as query parameters.

---

### Commodity Management

A new module for tracking campaign stock and warehouse transactions. It is accessible from the campaign home screen via a new dashboard card (shown only for commodity campaigns).

**Dashboard tabs:**

| Tab | What it shows |
|---|---|
| Stock Summary | Current stock levels across warehouses for the selected campaign |
| Pending Transactions | Stock transactions that are awaiting processing |
| Transaction Summary | Historical summary of all stock transactions |

**Additional screens:**

| Screen | What it does |
|---|---|
| Bulk stock upload | Upload multiple stock transactions at once via a file |
| Create shipment popup | Create a new shipment scoped to a warehouse |
| Edit shipment popup | Edit an existing shipment |

**How the flow works:**

```
Campaign home → Commodity card → Select campaign → Commodity dashboard
  → Stock Summary / Pending Transactions / Transaction Summary (tabs)
  → Create shipment or Bulk upload stock → Edit shipment
```

> Stock data is pulled from Kibana / Elasticsearch. All commodity operations are scoped to the selected campaign and boundary.

---

## What Changed in Existing Features

### Unified campaign Excel sheet — always on

The toggle that enabled multi-sheet Excel uploads during campaign setup has been **removed**. Multi-sheet upload is now the default for all campaigns — no configuration needed.

---

### Clone campaign — hierarchy now carried over correctly

When cloning an existing campaign, the source campaign's hierarchy type is now correctly copied to both the UI state and the API call. Previously, the cloned campaign could end up with the wrong hierarchy.

---

## Bug Fixes

| Issue fixed | Details |
|---|---|
| Stale campaign data on update screen | Old data was shown instead of the latest campaign state |
| Template polling timeout | Polling interval was too short, causing premature timeouts |
| Stale data when switching hierarchy | Hierarchy, name, boundary, loader, and cycle display all refreshed incorrectly |
| Clone campaign sent wrong hierarchy to API | Now correctly passes the source hierarchy |
| Multi-hierarchy API call and boundary propagation bugs | Fixed propagation of selected hierarchy through the boundary data flow |
| Delivery Rules not applied on final submit | Rules were being dropped at the last step |
| Tab overflow in campaign setup layout | Layout tabs overflowed on smaller screens |
| Delivery summary not shown correctly on preview | Summary rendered incorrectly on the review screen |
| "Show Category" missing in flow search panel | Filter option was not appearing |
| Blank upload screen | Caused by a missing `customProps.type` value |
| Step navigation skipping steps incorrectly | Custom logic in MDMS was incorrectly filtering step navigation |
| Various display fixes | Across campaign setup and delivery rule screens |

---

## How Access and Permissions Work

| Role | What they can do |
|---|---|
| All authenticated employees | View campaign list and campaign details |
| System administrator | Retry a failed campaign creation |
| Campaign-scoped users | Create or update campaigns within their assigned boundary scope |

> Role-based access for campaign actions is configured via MDMS — not hardcoded. Changes to role criteria are made in MDMS configuration.

---

## Summary of New Components

| Component / Hook | What it is |
|---|---|
| `SelectHierarchy.js` | Hierarchy type picker — first step of campaign creation wizard |
| `CommodityCampaigns.js` | Main commodity dashboard page |
| `StockSummaryTab.js` | Stock summary tab |
| `PendingTransactionsTab.js` | Pending transactions tab |
| `TransactionSummaryTab.js` | Transaction summary tab |
| `BulkStockUpload.js` | Bulk stock upload screen |
| `NewShipmentPopup.js` | Create shipment popup |
| `CommodityShipmentPopup.js` | Edit shipment popup |
| `HCMCommodityRowCard` | Campaign home card for commodity campaigns |
| `useKibanaStockSearch` | Queries Kibana/Elasticsearch for stock data |
| `useStockData` | Fetches stock data for dashboard tabs |
| `useStockSearch` | Stock search hook |
| `useBatchStockCreation` | Handles bulk stock record creation |
| `useCommodityProjectSearch` | Campaign search scoped to commodity projects |
| `useWarehouseManagerSync` | Syncs warehouse state with the backend |

All commodity components are in `src/components/CommodityManagement/`.
All attendance register setup screens are in `src/pages/employee/NewCampaignCreate/`.

---

## Localisation

All translation keys are centralised in `src/utils/i18nKeyConstants.js` under the `I18N_KEYS` constant, organised by category:

| Category | Key namespace | Example key |
|---|---|---|
| Common | `I18N_KEYS.COMMON` | `HCM_CAMPAIGN_DATE_MISSING` |
| Campaign creation | `I18N_KEYS.CAMPAIGN_CREATE` | `HCM_CHECKLIST_CREATE` |
| Commodity Management | `I18N_KEYS.COMMODITY_MANAGEMENT` | *(all commodity screen labels)* |
| App Configuration | `I18N_KEYS.APP_CONFIGURATION` | *(app config screen labels)* |

New keys were added in HCM v2.1 for Commodity Management, Hierarchy Selection, and Attendance Register Setup.

---

## API Integrations

| Endpoint | Method | Hook / Service | Purpose | Status |
|---|---|---|---|---|
| `/project-factory/v1/project-type/search` | POST | `useSearchCampaign` | Search campaigns by tenant, type, status | Existing |
| `/project-factory/v1/project-type/create` | POST | `createCampaignService` | Create new campaign | Existing |
| `/project-factory/v1/project-type/update` | POST | `updateCampaignService` | Update campaign | Existing |
| `/project-factory/v1/data/_search` | POST | `useProcessData` | Poll campaign data processing status | Existing |
| `/boundary-service/boundary-relationships/_search` | GET | `useBoundaryRelationshipSearch` | Fetch boundary relationships by hierarchy | Existing |
| `/dashboard-analytics/dashboard/getChartV2` | POST | `useKibanaStockSearch`, `useWarehouseManagerSync` | Commodity stock balance and warehouse sync analytics (Kibana-backed) | **New** |
| `/stock/v1/_search` | POST | `useStockSearch`, `useBatchStockCreation` | Search stock records; verify bulk stock creation | **New** |
| `/stock/v1/bulk/_create` | POST | `useBatchStockCreation` | Batch-create stock transaction records | **New** |
| `/excel-ingestion/v1/data/process/_validation` | POST | `useProcessData` | Validate uploaded attendance register Excel before ingestion | **New** |
| `/excel-ingestion/v1/data/process/_search` | POST | `useProcessData` | Poll Excel ingestion processing status | **New** |
| `/project-factory/v2/data/_process` | POST | `useProcessData` | Trigger campaign data processing (v2 endpoint) | **New** |

**Context path config keys** (from `window.globalConfigs.getConfig()`):
- `MDMS_V2_CONTEXT_PATH` → MDMS v2 base path (default: `mdms-v2`)
- `PROJECT_SERVICE_PATH` → project-factory base (default: `health-project`)