# Commodity Management — Complete Data Flow & Component Reference

## Component Tree

```
CommodityDashboard.js                    <-- Entry point (route: /commodity-dashboard)
  |-- DateRangePicker.js                 <-- Date range selector (react-date-range)
  |-- TransactionSummaryTab.js           <-- Tab 1: Transaction list view
  |     |-- DataSyncCard.js              <-- Sync stats bar (total managers, synced, rate)
  |     |-- SummaryCard.js               <-- Summary card (total/completed/pending/rejected)
  |     |-- GenericChart.js              <-- Wrapper with header, search, download/share menu
  |     |     +-- ReusableTableWrapper.js <-- DataTable with pagination, sorting, Excel export
  |     +-- UserDetails.js               <-- Clickable UUID that shows user tooltip on click
  |
  +-- StockSummaryTab.js                 <-- Tab 2: Stock/warehouse view
        |-- DataSyncCard.js              <-- Sync stats bar (total warehouses, synced, rate)
        |-- SummaryCard.js               <-- One card PER unique product variant
        |-- GenericChart.js              <-- Wrapper with header, search, download/share menu
        |     +-- ReusableTableWrapper.js
        +-- NewShipmentPopup.js          <-- Popup for creating stock shipments
              +-- BulkUpload.js          <-- File upload component (from parent folder)

BulkStockUpload.js                       <-- Separate page (route: /bulk-stock-upload)
  |-- StockComponent.js                  <-- Raw stock data table (debug/admin view)
  |     |-- ReusableTableWrapper.js
  |     +-- UserDetails.js
  +-- BulkUpload.js                      <-- File upload for bulk stock creation
```

---

## 1. CommodityDashboard.js

**Route:** `/{contextPath}/employee/campaign/commodity-dashboard?campaignNumber=X&campaignId=Y&tenantId=Z`

**Purpose:** Entry point container. Reads URL params + navigation state, manages tab switching and date range state.

**URL Params Read:**
| Param | Usage |
|-------|-------|
| `campaignId` | Passed to child tabs |
| `campaignNumber` | Passed to StockSummaryTab (for NewShipmentPopup) |

**Navigation State (from `location.state`, passed by HCMMyCampaignRowCard):**
| Key | Type | Usage |
|-----|------|-------|
| `projectId` | `string` | Passed to child tabs as `referenceId` for stock search filtering |
| `campaignStartDate` | `number` (epoch ms) | Used as start date for "Cumulative" preset and default for "Custom" range |

**State:**
| State | Default | Purpose |
|-------|---------|---------|
| `activeTab` | `"transaction"` | Which tab is shown |
| `dateRange` | `{ startDate: null, endDate: now, preset: "cumulative" }` | Raw date range state (internal) |

**Derived State:**
| Variable | Purpose |
|----------|---------|
| `campaignStartDate` | `new Date(campaignStartEpoch)` from navigation state |
| `effectiveDateRange` | Resolved date range passed to DateRangePicker and child tabs. For "cumulative" preset, resolves `startDate` to `campaignStartDate` and `endDate` to today. For other presets, fills in `startDate` fallback from `campaignStartDate` |

**Date Presets:**
- **Custom** — User picks start/end dates via DateRangePicker. Defaults to campaign start date → today when switching
- **Today** — Sets range to midnight-to-midnight of current day
- **Cumulative** — Campaign start date → today (fetches all data from campaign start to now)

**Props passed to tabs:**
```
TransactionSummaryTab: { dateRange: effectiveDateRange, tenantId, campaignId, projectId }
StockSummaryTab:       { dateRange: effectiveDateRange, tenantId, campaignId, campaignNumber, projectId }
```

---

## 2. useStockSearch.js (Shared Hook)

**Used by:** TransactionSummaryTab, StockSummaryTab

**API:** `POST /stock/v1/_search`

**Request:**
```json
{
  "params": { "tenantId": "...", "offset": 0, "limit": 1000 },
  "body": { "Stock": { "fromDate": "<epoch_ms>", "toDate": "<epoch_ms>", "referenceId": "<projectId>" } }
}
```

**Date filtering:** `fromDate`/`toDate` are included when the date range has non-null values. Since `effectiveDateRange` always resolves dates (Cumulative = campaign start → today), date filters are always sent in practice.

**useMemo dependency array:** `[tenantId, dateRange, transformFn, referenceId]` — ensures the query recalculates when any of these change.

**Response path:** `data.Stock[]` — array of stock transaction records.

**Each stock record contains:**
```
{
  id, clientReferenceId,
  productVariantId,              // -> used to resolve commodity name
  quantity,                      // -> the transaction quantity
  transactionType,               // RECEIVED | DISPATCHED | ISSUE | RETURNED | DAMAGED | LOST
  transactionReason,
  senderId, senderType,          // -> facility ID + type (WAREHOUSE/STAFF)
  receiverId, receiverType,      // -> facility ID + type
  referenceId,                   // -> projectId
  wayBillNumber,
  auditDetails: {
    createdBy,                   // -> user UUID
    lastModifiedBy,
    createdTime,                 // -> epoch ms, used for creation date
    lastModifiedTime
  },
  additionalFields: {
    fields: [                    // -> key-value pairs for extra data
      { key: "productName", value: "..." },
      { key: "quantitySent", value: "..." },
      { key: "quantityReceived", value: "..." },
      ...
    ]
  }
}
```

---

## 3. TransactionSummaryTab.js

**Purpose:** Shows all individual stock transactions as a flat list table.

### API Call Chain

```
/stock/v1/_search (referenceId: projectId)
       |
       |--- Extract unique facilityIds (senderId + receiverId from all stocks)
       |         |
       |         +---> /facility/v1/_search  { Facility: { id: facilityIds } }
       |                    |
       |                    +---> facilityNameMap: facility.id -> facility.name
       |                          (duplicate names get short ID suffix appended)
       |
       +--- Extract unique productVariantIds
                 |
                 +---> /product/variant/v1/_search  { ProductVariant: { id: productVariantIds } }
                            |
                            +---> Extract productIds from variant.productId
                                      |
                                      +---> /product/v1/_search  { Product: { id: productIds } }
                                                 |
                                                 +---> productNameMap: variant.id -> "product.name - variant.variation"
```

### Data Sync Card (DataSyncCard)

| Metric | Calculation |
|--------|-------------|
| **HCM_TOTAL_WAREHOUSE_MANAGERS** | Count of unique facility names across all sentFrom + sentTo values (excluding "N/A") |
| **HCM_TOTAL_WH_MANAGERS_SYNCED** | Same as total (currently assumes all are synced) |
| **HCM_SYNC_RATE** | Hardcoded `75%` if any managers exist, else `0%` |

### Transaction Summary Card (SummaryCard)

Single card showing aggregate transaction counts from `fallbackData`:

| Metric | Calculation |
|--------|-------------|
| **HCM_TOTAL_TRANSACTIONS** | `fallbackData.length` — total number of stock records |
| **HCM_TOTAL_COMPLETED** | Count where `status === "Completed"` or `"Complete"` |
| **HCM_TOTAL_PENDING** | Count where `status === "In-Transit"` or `"In-transit"` |
| **HCM_TOTAL_REJECTED** | Count where `status === "Rejected"` or `"Cancelled"` |

### Table Columns (HCM_TRANSACTION_LIST)

| Column | Key | Value | Source |
|--------|-----|-------|--------|
| **HCM_TRN** | `trn` | 5-char uppercase ID (e.g. "42E46") | `(stock.clientReferenceId \|\| stock.id).substring(0, 5).toUpperCase()` |
| **HCM_CREATION_DATE** | `creationDate` | Formatted date (e.g. "May 30, 2024 at 05:20:33 PM") | `stock.auditDetails.createdTime` → `new Date().toLocaleString("en-US", ...)` |
| **HCM_SENT_FROM** | `sentFrom` | Facility name (e.g. "Community Medical Store") | `facilityNameMap[stock.senderId]` from `/facility/v1/_search` → `Facilities[].name`. Falls back to raw `stock.senderId`. Duplicate names get suffix like "(001261)" |
| **HCM_SENT_TO** | `sentTo` | Facility name | `facilityNameMap[stock.receiverId]` (same as above) |
| **HCM_CREATED_BY** | `createdBy` | Masked UUID with info icon | `stock.auditDetails.createdBy` → rendered via `UserDetails` component. Clicking shows tooltip with user name, mobile, email, roles |
| **HCM_STATUS** | `status` | Status badge | `stock.transactionType` mapped: RECEIVED→"Completed", DISPATCHED→"In-Transit", RETURNED→"Complete", DAMAGED→"Rejected", LOST→"Cancelled" |
| **HCM_COMMODITY** | `commodity` | Product + variation (e.g. "SP - 500mg") | `productNameMap[stock.productVariantId]` built from chained calls. Fallback: `stock.additionalFields.fields[key="productName"].value` |
| **HCM_TRANSACTION_TYPE** | `transactionType` | "Logistics" or "Reverse - Logistics" | `stock.transactionType === "RETURNED"` → "Reverse - Logistics", else "Logistics" |

### Search & Filtering

Uses `applyGenericFilters(fallbackData, { searchText })` from `genericFilterUtils.js` to filter across all text fields.

---

## 4. StockSummaryTab.js

**Purpose:** Shows per-warehouse stock levels and per-commodity summaries. Allows creating new shipments.

### API Call Chain

Same as TransactionSummaryTab, plus the facility search also extracts boundary:

```
/facility/v1/_search  { Facility: { id: facilityIds } }
       |
       |---> facilityNameMap:     facility.id -> facility.name (+ duplicate suffix)
       +---> facilityBoundaryMap: facility.id -> facility.address.locality.code
```

### Data Sync Card (DataSyncCard)

| Metric | Calculation |
|--------|-------------|
| **HCM_TOTAL_WAREHOUSES** | Count of unique facility IDs across all senderId + receiverId in stock data |
| **HCM_TOTAL_WH_MANAGERS_SYNCED** | Same as total (assumes all synced) |
| **HCM_SYNC_RATE** | Hardcoded `75%` if any warehouses exist, else `0%` |

### Summary Cards (one SummaryCard per unique product variant)

Stock records are grouped by resolved product name (from `productNameMap`). Each unique product gets its own card. Each card aggregates quantities across ALL facilities.

| Metric | Calculation | Example |
|--------|-------------|---------|
| **HCM_TOTAL_RECEIVED** | `SUM(stock.quantity)` where `transactionType === "RECEIVED"` | 17,418 |
| **HCM_TOTAL_ISSUED** | `SUM(stock.quantity)` where `transactionType === "DISPATCHED"` or `"ISSUE"` | 3,261 |
| **HCM_TOTAL_RETURNED** | `SUM(stock.quantity)` where `transactionType === "RETURNED"` | 0 |
| **HCM_BALANCE** | `totalReceived - totalIssued + totalReturned` | 14,157 |

### Table Columns (HCM_TRANSACTION_LIST)

Table rows are grouped by `facilityId + productName` key. Multiple stock records for the same facility+product are aggregated into one row.

**How facilityId is determined per stock record:**
- If `transactionType === "RECEIVED"` → `facilityId = stock.receiverId` (the facility that received)
- Otherwise → `facilityId = stock.senderId` (the facility that sent)

| Column | Key | Value | Source |
|--------|-----|-------|--------|
| **HCM_WAREHOUSE_NAME** | `warehouseName` | Facility name (e.g. "CANHONGO") | `facilityNameMap[facilityId]` from `/facility/v1/_search` → `Facilities[].name`. Falls back to raw facilityId. Duplicate names get suffix |
| **HCM_TYPE** | `type` | "Warehouse" or "Facility" | If `stock.senderType === "WAREHOUSE"` or `stock.receiverType === "WAREHOUSE"` → "Warehouse", else "Facility" |
| **HCM_BOUNDARY** | `boundary` | Translated boundary name | `facilityBoundaryMap[facilityId]` → raw code from `Facilities[].address.locality.code` → passed through `t()` for i18n translation |
| **HCM_COMMODITY** | `commodity` | Product + variation | Same as Transaction tab: `productNameMap[stock.productVariantId]` |
| **HCM_CURRENT_STOCK** | `currentStock` | Net stock number for this facility+product | See calculation below |
| **HCM_ACTION** | `action` | "+" button | Static button (placeholder for future action) |

### HCM_CURRENT_STOCK — Detailed Calculation

Unlike summary card totals (across ALL facilities), `currentStock` is **per facility per commodity**.

```
currentStock starts at 0

For each stock record matching this facilityId + productName:
  + stock.quantity  when transactionType === "RECEIVED"
  - stock.quantity  when transactionType === "DISPATCHED" or "ISSUE"
  + stock.quantity  when transactionType === "RETURNED"
```

**Example:** Warehouse "CANHONGO" with commodity "SP - 500mg":
```
Received 500  -> currentStock = 500
Dispatched 100 -> currentStock = 400
Received 200  -> currentStock = 600
Returned 50   -> currentStock = 650
Final display: 650
```

### Summary Card Balance vs Table CurrentStock

| | Summary Card (HCM_BALANCE) | Table (HCM_CURRENT_STOCK) |
|---|---|---|
| **Scope** | ALL facilities combined | Single facility only |
| **Grouped by** | Product name only | Facility + Product |
| **Represents** | Total net stock for that commodity across the entire campaign | Stock level at one specific warehouse for one commodity |

---

## 5. NewShipmentPopup.js

**Purpose:** Popup within StockSummaryTab for creating individual stock shipments. Provides hierarchy-based facility selection and Excel template download.

**Props:** `{ campaignNumber, campaignId, tenantId, onClose, onSuccess }`

**View States:** `"form"` → `"success"` → `"error"`

### API Chain

```
1. MDMS: HierarchySchema
   |  Digit.Hooks.useCustomMDMS -> HCM-ADMIN-CONSOLE.HierarchySchema[type==moduleName].hierarchy
   |  Returns: BOUNDARY_HIERARCHY_TYPE (e.g. "ADMIN")
   |
2. /boundary-service/boundary-hierarchy-definition/_search
   |  Body: { BoundaryTypeHierarchySearchCriteria: { hierarchyType } }
   |  Returns: BoundaryHierarchy[].boundaryHierarchy[] (sorted parent->child chain)
   |
3. /boundary-service/boundary-relationships/_search
   |  Params: { hierarchyType, includeChildren: true }
   |  Returns: TenantBoundary[].boundary[] (full tree, used to build ancestor path map)
   |
4. /project-factory/v1/project-type/search
   |  Body: { CampaignDetails: { campaignNumber } }
   |  Returns: CampaignDetails[0] -> projectId, deliveryRules (with product variants)
   |
5. /health-project/v1/_search (includeDescendants: true)
   |  Body: { Projects: [{ id: projectId }] }
   |  Returns: All project IDs + their boundary mappings (projectId -> { boundary, boundaryType })
   |
6. /health-project/facility/v1/_search (x3: all, from-filtered, to-filtered)
   |  Body: { ProjectFacility: { projectId: [...] } }
   |  Returns: ProjectFacilities[] -> { facilityId, projectId }
   |  NOTE: facility name = facilityId (not resolved to actual name from /facility/v1/_search)
   |
7. /stock/v1/_create (on submit)
      Body: { Stock: { senderId, receiverId, productVariantId, quantity, ... } }
```

### Hierarchy Filtering Logic

1. User selects **"From" boundary level** (cascading dropdowns: Country → State → LGA → Ward)
2. Project IDs are filtered to those matching the selected boundary level
3. ProjectFacility search returns facilities for those projects
4. User selects a **"From" facility** (radio button, single select)
5. **"To" hierarchy** shows ONLY levels BELOW the "From" level
6. User selects "To" boundary filters and checks destination facilities (checkboxes, multi-select)

### Product Variants

Extracted from `campaignData.deliveryRules[].resources[]` — each resource has `productVariantId` and `name`.

### Excel Template Download

Generates Excel with:
- Sheet 1: "Stock Data" — Headers: boundary columns + Project Id, From/To Facility Code/Name, Product Variant Id/Name, Quantity
- Sheet 2: "ReadMe" — Instructions
- Pre-fills rows for each selected To-facility x product-variant combination

### Stock Creation (Submit)

Parses uploaded Excel, creates one `/stock/v1/_create` call PER row sequentially. Each stock record:
```json
{
  "transactionType": "RECEIVED",
  "senderType": "WAREHOUSE",
  "receiverType": "WAREHOUSE",
  "referenceIdType": "PROJECT"
}
```

---

## 6. BulkStockUpload.js

**Route:** `/{contextPath}/employee/campaign/bulk-stock-upload?campaignNumber=X&campaignName=Y&campaignId=Z&projectType=T`

**Purpose:** Standalone page for bulk stock upload. Nearly identical hierarchy filtering logic as NewShipmentPopup, plus a StockComponent table showing existing stock.

**Key difference from NewShipmentPopup:** This is a full page (not a popup), and it embeds `StockComponent` to show existing raw stock data.

### API Chain

Same as NewShipmentPopup (MDMS → boundary hierarchy → boundary relationships → campaign search → project search → project facility search). Plus uses `StockComponent` for viewing existing stock.

---

## 7. StockComponent.js

**Purpose:** Raw stock data table for admin/debug view. Shows ALL stock fields with minimal transformation. Used inside BulkStockUpload.

**API:** Same `/stock/v1/_search` but filters client-side by `allProjectIds` set:
```js
stocks.filter(stock => allProjectIdSet.has(stock.referenceId))
```

**Columns displayed:** id, productVariantId, productName, variation, materialNoteNumber, batchNumber, quantitySent, quantityReceived, quantity, transactionType, transactionReason, wayBillNumber, senderType, receiverType, createdBy (with UserDetails tooltip), expireDate, transactionDate, distributorName.

**Data source:** All from `stock.additionalFields.fields[]` key-value pairs + direct stock properties.

---

## 8. Shared UI Components

### DataSyncCard.js

**Props:** `{ items: [{ label, value }] }`

Renders a horizontal metrics bar with a sync icon (SVG.Restore). Each item shows `t(label)` above the value. Used in both tabs.

### SummaryCard.js

**Props:** `{ title, subtitle, items: [{ label, value }] }`

Renders a card with optional title/subtitle header and horizontal metric items. Numbers are formatted with `toLocaleString()`. Used for transaction stats and per-commodity stock summaries.

### GenericChart.js

**Props:** `{ header, subHeader, className, showSearch, showDownload, onChange, children, ... }`

Wrapper component from DSS (Decision Support System) pattern. Provides:
- Header with tooltip
- Search input field (when `showSearch=true`)
- Ellipsis menu with download/share options (Image, PDF via `Digit.Download` / `Digit.ShareFiles`)
- Renders `children` (usually ReusableTableWrapper)

### ReusableTableWrapper.js

**Props:** `{ data, columns, isLoading, customCellRenderer, pagination, manualPagination, enableExcelDownload, ... }`

Wraps `react-data-table-component` (DataTable). Features:
- Manual client-side pagination (slices data by page)
- Column sorting
- Custom cell renderers per column key
- Excel download via XLSX library
- Configurable rows per page

### DateRangePicker.js

**Props:** `{ t, formData, onSelect, props }`

Wraps `react-date-range` DateRange component. Shows a clickable input displaying "dd/MM/yyyy - dd/MM/yyyy" that opens a two-month calendar picker.

### UserDetails.js

**Props:** `{ uuid, tenantId, tooltipPosition, ... }`

Displays a masked UUID (e.g. "0a2d...0b17") with an info icon. On click:
1. Checks localStorage cache first
2. If not cached, calls `POST /user/_search` with `{ uuid: [uuid] }`
3. Shows tooltip with user name, mobile, email, roles
4. Auto-hides tooltip after 3 seconds
5. Caches user data in localStorage under `"user-details-cache"` key

---

## API Reference Summary

| API Endpoint | Used By | Body Filter | Response Path |
|-------------|---------|-------------|---------------|
| `POST /stock/v1/_search` | useStockSearch, StockComponent | `{ Stock: { referenceId } }` | `data.Stock[]` |
| `POST /facility/v1/_search` | TransactionSummaryTab, StockSummaryTab | `{ Facility: { id: [...] } }` | `data.Facilities[]` |
| `POST /product/variant/v1/_search` | TransactionSummaryTab, StockSummaryTab | `{ ProductVariant: { id: [...] } }` | `data.ProductVariant[]` |
| `POST /product/v1/_search` | TransactionSummaryTab, StockSummaryTab | `{ Product: { id: [...] } }` | `data.Product[]` |
| `POST /health-project/facility/v1/_search` | NewShipmentPopup, BulkStockUpload | `{ ProjectFacility: { projectId: [...] } }` | `data.ProjectFacilities[]` |
| `POST /health-project/v1/_search` | NewShipmentPopup, BulkStockUpload | `{ Projects: [{ id, tenantId }] }` | `data.Project[]` |
| `POST /project-factory/v1/project-type/search` | NewShipmentPopup, BulkStockUpload | `{ CampaignDetails: { campaignNumber } }` | `data.CampaignDetails[0]` |
| `POST /boundary-service/boundary-hierarchy-definition/_search` | NewShipmentPopup, BulkStockUpload | `{ BoundaryTypeHierarchySearchCriteria: { hierarchyType } }` | `data.BoundaryHierarchy[]` |
| `POST /boundary-service/boundary-relationships/_search` | NewShipmentPopup, BulkStockUpload | `{}` (params: hierarchyType, includeChildren) | `data.TenantBoundary[].boundary[]` |
| `POST /stock/v1/_create` | NewShipmentPopup, BulkStockUpload | `{ Stock: { senderId, receiverId, productVariantId, quantity, ... } }` | Created stock record |
| `POST /user/_search` | UserDetails | `{ uuid: [uuid] }` | `data.user[0]` |
| MDMS: HierarchySchema | NewShipmentPopup, BulkStockUpload | via `Digit.Hooks.useCustomMDMS` | `HCM-ADMIN-CONSOLE.HierarchySchema[].hierarchy` |

---

## Duplicate Facility Name Handling

Both TransactionSummaryTab and StockSummaryTab detect when multiple facility IDs resolve to the same name (e.g., two different "IRS Facilities"). When duplicates are found, a short ID suffix is appended:

```
Before: "IRS Facilities" (F-2024-12-04-101227) and "IRS Facilities" (F-2024-12-04-101256)
After:  "IRS Facilities (101227)" and "IRS Facilities (101256)"
```

The suffix is the last segment of the facility ID after the final hyphen.
