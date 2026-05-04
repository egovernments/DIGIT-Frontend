# Commodity Management — Complete Data Flow & Component Reference

## Component Tree

```
CommodityDashboard.js                    <-- Entry point (route: /commodity-dashboard)
  |-- DateRangePicker.js                 <-- Date range selector (react-date-range)
  |-- useStockData()                     <-- SINGLE centralized stock data fetch
  |-- computeStockSummary()              <-- Unified summary processor (ES aggs or client-side)
  |
  |-- TransactionSummaryTab.js           <-- Tab 1: Transaction list view (receives data as props)
  |     |-- DataSyncCard.js              <-- Sync stats bar (from stockSummary.dataSyncStats)
  |     |-- SummaryCard.js               <-- Summary card (from stockSummary.transactionSummary)
  |     |-- GenericChart.js              <-- Wrapper with header, search, download/share menu
  |     |     +-- ReusableTableWrapper.js <-- DataTable with pagination, sorting, Excel export
  |     +-- UserDetails.js               <-- Clickable UUID that shows user tooltip on click
  |
  +-- StockSummaryTab.js                 <-- Tab 2: Stock/warehouse view (receives data as props)
        |-- DataSyncCard.js              <-- Sync stats bar (from stockSummary.dataSyncStats)
        |-- SummaryCard.js               <-- One card PER commodity (from stockSummary.commoditySummaries)
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

## 1. CommodityDashboard.js (Centralized Data Owner)

**Route:** `/{contextPath}/employee/campaign/commodity-dashboard?campaignNumber=X&campaignId=Y&tenantId=Z`

**Purpose:** Entry point container. Reads URL params + navigation state, manages tab switching, date range state, AND centralized stock data fetching. Both tabs receive processed data as props — no duplicate API calls.

**URL Params Read:**
| Param | Usage |
|-------|-------|
| `campaignId` | Passed to child tabs |
| `campaignNumber` | Passed to StockSummaryTab (for NewShipmentPopup) |

**Navigation State (from `location.state`, passed by HCMMyCampaignRowCard):**
| Key | Type | Usage |
|-----|------|-------|
| `projectId` | `string` | Used as `referenceId` for stock search filtering |
| `campaignStartDate` | `number` (epoch ms) | Used as start date for "Cumulative" preset and default for "Custom" range |

**State:**
| State | Default | Purpose |
|-------|---------|---------|
| `activeTab` | `"transaction"` | Which tab is shown |
| `dateRange` | `{ startDate: null, endDate: now, preset: "cumulative" }` | Raw date range state (internal) |

**Centralized Data Fetching:**
```
useStockData({ tenantId, dateRange: effectiveDateRange, referenceId: projectId, useKibana })
    |
    +---> returns { data: rawStockData, isLoading: stockLoading, metadata, source }
              |
              +---> computeStockSummary({ source, metadata, data: rawStockData })
                        |
                        +---> stockSummary: { transactionSummary, commoditySummaries, dataSyncStats }
```

**Props passed to tabs:**
```
TransactionSummaryTab: { rawStockData, stockLoading, stockSummary, tenantId, campaignId, projectId }
StockSummaryTab:       { rawStockData, stockLoading, stockSummary, tenantId, campaignId, campaignNumber, projectId }
```

**Date Presets:**
- **Custom** — User picks start/end dates via DateRangePicker. Defaults to campaign start date -> today when switching
- **Today** — Sets range to midnight-to-midnight of current day
- **Cumulative** — Campaign start date -> today (fetches all data from campaign start to now)

**Configuration:**
| Config | Default | Purpose |
|--------|---------|---------|
| `useKibanaFlag` | `true` | When `true`, fetches stock data via Kibana/Elasticsearch first, falling back to `/stock/v1/_search` on error. When `false`, uses stock API directly. |

---

## 2. useStockData.js (Unified Hook — Kibana-first with Fallback)

**Used by:** CommodityDashboard (single call, shared by both tabs)

**Purpose:** Unified hook that tries Kibana/Elasticsearch first, then falls back to the stock REST API if Kibana fails. Both underlying hooks are always called (React hook rules) but only one is `enabled` at a time.

**Params:**
| Param | Type | Default | Purpose |
|-------|------|---------|---------|
| `tenantId` | `string` | — | Tenant ID |
| `dateRange` | `{ startDate, endDate }` | — | Date range (Date objects) |
| `referenceId` | `string` | — | Project ID for filtering |
| `useKibana` | `boolean` | `true` | Whether to try Kibana first |
| `transformFn` | `Function` | — | Optional transform (stock API fallback only) |

**Flow:**
1. If `useKibana=true` and no prior Kibana failure -> enables `useKibanaStockSearch`, disables `useStockSearch`
2. If Kibana errors -> sets `kibanaFailed=true`, disables Kibana, enables stock API
3. If `useKibana=false` -> stock API only

**Returns:** `{ data: Stock[], isLoading, error, metadata, source: "kibana" | "stockApi" }`

- `metadata` contains ES `aggregations` when source is "kibana", `null` when source is "stockApi"

---

## 2a. useKibanaStockSearch.js (Elasticsearch via Kibana Proxy)

**Purpose:** Queries the `stock-index-v1` Elasticsearch index via Kibana's console proxy. Returns both raw hits (normalized to stock API shape) AND aggregation results for summary stats.

**Index:** `stock-index-v1` (from `getKibanaDetails("projectStockIndex")`)

**Auth:** Basic auth from `getKibanaDetails("username")` / `getKibanaDetails("password")`, or `getKibanaDetails("token")` as fallback.

**ES Query Construction:**
```json
{
  "size": 10000,
  "_source": ["Data.*"],
  "query": {
    "bool": {
      "must": [
        { "term": { "Data.projectId.keyword": "<projectId>" } },
        { "range": { "Data.dateOfEntry": { "gte": "<fromDate>", "lte": "<toDate>" } } }
      ]
    }
  },
  "aggs": {
    "by_event_type": {
      "terms": { "field": "Data.eventType.keyword", "size": 20 },
      "aggs": { "total_quantity": { "sum": { "field": "Data.physicalCount" } } }
    },
    "by_product": {
      "terms": { "field": "Data.productName.keyword", "size": 100 },
      "aggs": {
        "by_event_type": {
          "terms": { "field": "Data.eventType.keyword", "size": 20 },
          "aggs": { "total_quantity": { "sum": { "field": "Data.physicalCount" } } }
        },
        "total_quantity": { "sum": { "field": "Data.physicalCount" } }
      }
    },
    "unique_facilities": { "cardinality": { "field": "Data.facilityId.keyword" } },
    "by_facility": {
      "terms": { "field": "Data.facilityId.keyword", "size": 500 },
      "aggs": {
        "facility_name": { "terms": { "field": "Data.facilityName.keyword", "size": 1 } },
        "by_event_type": {
          "terms": { "field": "Data.eventType.keyword", "size": 20 },
          "aggs": { "total_quantity": { "sum": { "field": "Data.physicalCount" } } }
        }
      }
    },
    "total_quantity": { "sum": { "field": "Data.physicalCount" } }
  }
}
```

**ES Field Mappings (ES -> normalized stock shape):**
| ES Field (`Data.*`) | Normalized Field |
|---------------------|-----------------|
| `id` | `id` |
| `clientReferenceId` | `clientReferenceId` |
| `productVariant` | `productVariantId` |
| `transactingFacilityId` | `senderId` |
| `facilityId` | `receiverId` |
| `transactingFacilityType` | `senderType` |
| `facilityType` | `receiverType` |
| `eventType` | `transactionType` |
| `physicalCount` | `quantity` |
| `projectId` | `referenceId` |
| `dateOfEntry` / `createdTime` | `auditDetails.createdTime` |
| `productName` | `additionalFields.fields[key="productName"]` |

**Architecture:** Uses `useSimpleElasticsearch` hook -> Web Worker (`simpleElasticsearchWorkerString.js`) -> Kibana proxy (`/{kibanaPath}/api/console/proxy`) -> Elasticsearch. Single `_search` call (no `_count` step).

**Returns:** `{ data: normalizedStock[], isLoading, error, progress, metadata: { aggregations, ... }, source: "kibana" }`

---

## 2b. useStockSearch.js (Stock REST API — Fallback)

**Used by:** useStockData (as fallback when Kibana is disabled or fails)

**API:** `POST /stock/v1/_search`

**Request:**
```json
{
  "params": { "tenantId": "...", "offset": 0, "limit": 1000 },
  "body": { "Stock": { "fromDate": "<epoch_ms>", "toDate": "<epoch_ms>", "referenceId": "<projectId>" } }
}
```

**Date filtering:** `fromDate`/`toDate` are included when the date range has non-null values. Since `effectiveDateRange` always resolves dates (Cumulative = campaign start -> today), date filters are always sent in practice.

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

## 3. stockDataProcessor.js (Unified Summary Computation)

**Purpose:** Pure utility that produces the same summary shape regardless of data source. Called in `CommodityDashboard` once, results shared with both tabs.

**Entry point:** `computeStockSummary({ source, metadata, data, productNameMap })`

**Strategy selection:**
- `source === "kibana"` AND `metadata.aggregations` exists -> reads pre-computed stats from ES aggregations (server-side, fast)
- Otherwise -> computes same stats client-side from raw hits (stock API fallback)

**Output shape (identical for both strategies):**
```js
{
  transactionSummary: {
    total: number,      // Total transaction count
    completed: number,  // RECEIVED + RETURNED
    pending: number,    // DISPATCHED
    rejected: number,   // DAMAGED + LOST
  },
  commoditySummaries: [
    {
      name: string,           // Product name (e.g. "IRS - Delt")
      totalReceived: number,  // SUM quantity for RECEIVED events
      totalIssued: number,    // SUM quantity for DISPATCHED/ISSUE events
      totalReturned: number,  // SUM quantity for RETURNED events
      balance: number,        // totalReceived - totalIssued + totalReturned
    }
  ],
  dataSyncStats: {
    totalFacilities: number,    // Unique facility count
    syncedFacilities: number,   // Same as total (placeholder)
    syncRate: number,           // Hardcoded 75% if any facilities exist
  }
}
```

**From ES aggregations (Kibana path):**
| Summary field | ES aggregation source |
|---------------|----------------------|
| `transactionSummary.total` | `SUM(by_event_type.buckets[].doc_count)` |
| `transactionSummary.completed` | `by_event_type.buckets` where key is RECEIVED or RETURNED |
| `transactionSummary.pending` | `by_event_type.buckets` where key is DISPATCHED |
| `transactionSummary.rejected` | `by_event_type.buckets` where key is DAMAGED or LOST |
| `commoditySummaries` | `by_product.buckets[]` with nested `by_event_type.buckets[].total_quantity.value` |
| `dataSyncStats.totalFacilities` | `unique_facilities.value` (cardinality aggregation) |

**From raw data (Stock API path):**
| Summary field | Client-side computation |
|---------------|------------------------|
| `transactionSummary.total` | `stockData.length` |
| `transactionSummary.completed` | Count where `transactionType` is RECEIVED or RETURNED |
| `commoditySummaries` | Group by product name, sum `quantity` per event type |
| `dataSyncStats.totalFacilities` | Count unique `senderId` + `receiverId` |

---

## 4. TransactionSummaryTab.js

**Purpose:** Shows all individual stock transactions as a flat list table.

**Props received from CommodityDashboard:**
| Prop | Type | Purpose |
|------|------|---------|
| `rawStockData` | `Stock[]` | Raw hits for table rows |
| `stockLoading` | `boolean` | Loading state |
| `stockSummary` | `object` | Pre-computed summary (see stockDataProcessor output shape) |
| `tenantId` | `string` | For facility/product API calls |

**Data flow:**
```
rawStockData (from props)
    |
    +--- Extract unique facilityIds + productVariantIds
    |         |
    |         +---> /facility/v1/_search  -> facilityNameMap
    |         +---> /product/variant/v1/_search -> /product/v1/_search -> productNameMap
    |
    +--- transformStock() -> tableData (for table rows)

stockSummary (from props, pre-computed in CommodityDashboard)
    |
    +--- stockSummary.transactionSummary -> SummaryCard (total/completed/pending/rejected)
    +--- stockSummary.dataSyncStats -> DataSyncCard (totalManagers/synced/syncRate)
```

### Data Sync Card (DataSyncCard)

| Metric | Source |
|--------|--------|
| **HCM_TOTAL_WAREHOUSE_MANAGERS** | `stockSummary.dataSyncStats.totalFacilities` |
| **HCM_TOTAL_WH_MANAGERS_SYNCED** | `stockSummary.dataSyncStats.syncedFacilities` |
| **HCM_SYNC_RATE** | `stockSummary.dataSyncStats.syncRate` (hardcoded 75%) |

### Transaction Summary Card (SummaryCard)

| Metric | Source |
|--------|--------|
| **HCM_TOTAL_TRANSACTIONS** | `stockSummary.transactionSummary.total` |
| **HCM_TOTAL_COMPLETED** | `stockSummary.transactionSummary.completed` |
| **HCM_TOTAL_PENDING** | `stockSummary.transactionSummary.pending` |
| **HCM_TOTAL_REJECTED** | `stockSummary.transactionSummary.rejected` |

### Table Columns (HCM_TRANSACTION_LIST)

| Column | Key | Value | Source |
|--------|-----|-------|--------|
| **HCM_TRN** | `trn` | 5-char uppercase ID (e.g. "42E46") | `(stock.clientReferenceId \|\| stock.id).substring(0, 5).toUpperCase()` |
| **HCM_CREATION_DATE** | `creationDate` | Formatted date | `stock.auditDetails.createdTime` -> `new Date().toLocaleString("en-US", ...)` |
| **HCM_SENT_FROM** | `sentFrom` | Facility name | `facilityNameMap[stock.senderId]` |
| **HCM_SENT_TO** | `sentTo` | Facility name | `facilityNameMap[stock.receiverId]` |
| **HCM_CREATED_BY** | `createdBy` | Masked UUID with info icon | `stock.auditDetails.createdBy` via `UserDetails` component |
| **HCM_STATUS** | `status` | Status badge | RECEIVED->"Completed", DISPATCHED->"In-Transit", RETURNED->"Complete", DAMAGED->"Rejected", LOST->"Cancelled" |
| **HCM_COMMODITY** | `commodity` | Product + variation | `productNameMap[stock.productVariantId]` |
| **HCM_TRANSACTION_TYPE** | `transactionType` | "Logistics" or "Reverse - Logistics" | RETURNED -> "Reverse - Logistics", else "Logistics" |

---

## 5. StockSummaryTab.js

**Purpose:** Shows per-warehouse stock levels and per-commodity summaries. Allows creating new shipments.

**Props received from CommodityDashboard:**
| Prop | Type | Purpose |
|------|------|---------|
| `rawStockData` | `Stock[]` | Raw hits for warehouse table |
| `stockLoading` | `boolean` | Loading state |
| `stockSummary` | `object` | Pre-computed summary |
| `tenantId` | `string` | For facility/product API calls |
| `campaignNumber` | `string` | For NewShipmentPopup |

**Data flow:**
```
rawStockData (from props)
    |
    +--- Extract unique facilityIds + productVariantIds
    |         |
    |         +---> /facility/v1/_search  -> facilityNameMap + facilityBoundaryMap
    |         +---> /product/variant/v1/_search -> /product/v1/_search -> productNameMap
    |
    +--- warehouseData (grouped by facilityId + productName -> currentStock)

stockSummary (from props, pre-computed in CommodityDashboard)
    |
    +--- stockSummary.commoditySummaries -> SummaryCard x N (one per product)
    +--- stockSummary.dataSyncStats -> DataSyncCard (total/synced/syncRate)
```

### Data Sync Card (DataSyncCard)

| Metric | Source |
|--------|--------|
| **HCM_TOTAL_WAREHOUSES** | `stockSummary.dataSyncStats.totalFacilities` |
| **HCM_TOTAL_WH_MANAGERS_SYNCED** | `stockSummary.dataSyncStats.syncedFacilities` |
| **HCM_SYNC_RATE** | `stockSummary.dataSyncStats.syncRate` |

### Summary Cards (one SummaryCard per commodity)

From `stockSummary.commoditySummaries[]`:

| Metric | Source |
|--------|--------|
| **HCM_TOTAL_RECEIVED** | `commodity.totalReceived` |
| **HCM_TOTAL_ISSUED** | `commodity.totalIssued` |
| **HCM_TOTAL_RETURNED** | `commodity.totalReturned` |
| **HCM_BALANCE** | `commodity.balance` (= received - issued + returned) |

### Table Columns (HCM_TRANSACTION_LIST)

Table rows are grouped by `facilityId + productName` key. Multiple stock records for the same facility+product are aggregated into one row. This is still computed from raw hits (not from aggregations) because it needs facility name resolution.

| Column | Key | Value | Source |
|--------|-----|-------|--------|
| **HCM_WAREHOUSE_NAME** | `warehouseName` | Facility name | `facilityNameMap[facilityId]` |
| **HCM_TYPE** | `type` | "Warehouse" or "Facility" | senderType/receiverType check |
| **HCM_BOUNDARY** | `boundary` | Translated boundary name | `facilityBoundaryMap[facilityId]` -> `t()` |
| **HCM_COMMODITY** | `commodity` | Product + variation | `productNameMap[stock.productVariantId]` |
| **HCM_CURRENT_STOCK** | `currentStock` | Net stock per facility+product | RECEIVED: +qty, DISPATCHED/ISSUE: -qty, RETURNED: +qty |
| **HCM_ACTION** | `action` | "+" button | Static button (placeholder) |

### Summary Card Balance vs Table CurrentStock

| | Summary Card (HCM_BALANCE) | Table (HCM_CURRENT_STOCK) |
|---|---|---|
| **Source** | `stockSummary.commoditySummaries` (from ES aggs or client-side) | Computed from raw hits in the tab |
| **Scope** | ALL facilities combined | Single facility only |
| **Grouped by** | Product name only | Facility + Product |
| **Represents** | Total net stock for that commodity across the entire campaign | Stock level at one specific warehouse for one commodity |

---

## 6. NewShipmentPopup.js

**Purpose:** Popup within StockSummaryTab for creating individual stock shipments. Provides hierarchy-based facility selection and Excel template download.

**Props:** `{ campaignNumber, campaignId, tenantId, onClose, onSuccess }`

**View States:** `"form"` -> `"success"` -> `"error"`

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

---

## 7. BulkStockUpload.js

**Route:** `/{contextPath}/employee/campaign/bulk-stock-upload?campaignNumber=X&campaignName=Y&campaignId=Z&projectType=T`

**Purpose:** Standalone page for bulk stock upload. Nearly identical hierarchy filtering logic as NewShipmentPopup, plus a StockComponent table showing existing stock.

### API Chain

Same as NewShipmentPopup (MDMS -> boundary hierarchy -> boundary relationships -> campaign search -> project search -> project facility search). Plus uses `StockComponent` for viewing existing stock.

---

## 8. StockComponent.js

**Purpose:** Raw stock data table for admin/debug view. Shows ALL stock fields with minimal transformation. Used inside BulkStockUpload.

**API:** Same `/stock/v1/_search` but filters client-side by `allProjectIds` set:
```js
stocks.filter(stock => allProjectIdSet.has(stock.referenceId))
```

**Columns displayed:** id, productVariantId, productName, variation, materialNoteNumber, batchNumber, quantitySent, quantityReceived, quantity, transactionType, transactionReason, wayBillNumber, senderType, receiverType, createdBy (with UserDetails tooltip), expireDate, transactionDate, distributorName.

**Data source:** All from `stock.additionalFields.fields[]` key-value pairs + direct stock properties.

---

## 9. Shared UI Components

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
| ES: `POST stock-index-v1/_search` (via Kibana proxy) | useKibanaStockSearch | `{ query: { term: { "Data.projectId.keyword": ... } }, aggs: { ... } }` | `hits.hits[]` + `aggregations` |
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
