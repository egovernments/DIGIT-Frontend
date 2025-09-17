# Dynamic Boundary Filter System Guide

This guide explains the enhanced dynamic boundary filtering system that automatically adapts to any data structure.

## 🚀 Key Features

### 1. **Automatic Field Discovery**
- Scans your data to find all boundary fields automatically
- No need to pre-configure field names
- Adapts to any boundary hierarchy structure

### 2. **Smart Filter Hiding**
- Automatically hides dropdowns that have only one unique value
- Only shows filters where user choice would make a difference
- Keeps the UI clean and relevant

### 3. **Dynamic Column Generation**
- Table columns are generated based on discovered boundary fields
- No manual column configuration needed
- Consistent labeling with intelligent field name formatting

## 📊 How It Works

### Field Discovery Process
1. **Scan Data**: System scans all records for `boundaryHierarchy` objects
2. **Extract Fields**: Collects all unique field names across all records
3. **Count Values**: For each field, counts unique values
4. **Filter Options**: Only shows dropdowns for fields with 2+ unique values
5. **Generate UI**: Creates filters and table columns dynamically

### Example Data Structures

```javascript
// Standard Health System Structure
{
  boundaryHierarchy: {
    country: 'NIGERIA',
    state: 'ONDO', 
    lga: 'AKOKO NORTH WEST',
    ward: 'AJOWA',
    healthFacility: 'OLURO PALACE'
  }
}

// Custom Regional Structure  
{
  boundaryHierarchy: {
    region: 'WEST_AFRICA',
    country: 'NIGERIA',
    zone: 'SOUTH_WEST',
    district: 'URBAN_DISTRICT_A'
  }
}

// Minimal Structure
{
  boundaryHierarchy: {
    area: 'RURAL',
    facility: 'HEALTH_CENTER_1'
  }
}
```

## 🛠 Implementation

### Updated Components

#### 1. **BoundaryFilterComponent** - Now Fully Dynamic

```javascript
import BoundaryFilterComponent from './BoundaryFilterComponent';

<BoundaryFilterComponent
  data={yourData}
  onFiltersChange={(activeFilters, allFilters) => {
    // Handle filter changes
  }}
  // filterOrder is now optional - defaults to auto-discovery
  filterOrder={null} // or ['customField1', 'customField2'] for custom order
  customLabels={{
    // Only define labels for fields you want to customize
    lga: 'Local Government Area',
    healthFacility: 'Health Facility'
  }}
/>
```

#### 2. **withBoundaryFilter HOC** - Auto-Discovery Enabled

```javascript
import withBoundaryFilter from './withBoundaryFilter';

const DynamicFilteredTable = withBoundaryFilter(YourComponent, {
  showFilters: true,
  showStats: true,
  filterOrder: null, // Auto-discover fields
  customLabels: {
    // Only customize the labels you need
    someFieldName: 'Human Readable Label'
  }
});
```

#### 3. **Updated Utility Functions**

```javascript
import { 
  discoverBoundaryFields,
  extractBoundaryOptions,
  getBoundaryStats 
} from '../utils/boundaryFilterUtils';

// Discover all boundary fields in your data
const fields = discoverBoundaryFields(data);
// Result: ['country', 'state', 'lga', 'ward', 'facility']

// Get filterable options (only fields with multiple values)
const options = extractBoundaryOptions(data);  
// Result: { state: ['ONDO', 'LAGOS'], lga: ['AKOKO', 'SURULERE'] }
// Note: 'country' might be excluded if all records have 'NIGERIA'

// Get comprehensive statistics
const stats = getBoundaryStats(data);
// Result: {
//   totalRecords: 100,
//   recordsWithBoundary: 95,
//   boundaryFields: { country: 1, state: 2, lga: 5 }, // All fields with counts
//   availableFilters: ['state', 'lga'], // Only multi-value fields
//   allDiscoveredFields: ['country', 'state', 'lga'], // All discovered
//   coveragePercentage: 95
// }
```

## 📋 Updated DeliveryComponent Example

The DeliveryComponent now uses completely dynamic filtering:

```javascript
// Automatically discovers boundary fields from data
const boundaryFields = useMemo(() => {
  return discoverBoundaryFields(tableData);
}, [tableData]);

// Dynamically generates table columns
const columns = useMemo(() => {
  const baseColumns = [
    { key: 'deliveredBy', label: t('DELIVERED_BY'), sortable: true },
    // ... other columns
  ];

  // Add dynamic boundary columns
  const boundaryColumns = boundaryFields.map(field => ({
    key: `boundaryHierarchy.${field}`,
    label: t(getFieldLabel(field)), // Auto-generates labels
    sortable: true,
    width: '150px'
  }));

  return [...baseColumns, ...boundaryColumns];
}, [boundaryFields, t]);

// Dynamic cell renderers
const customCellRenderer = useMemo(() => {
  const renderers = {
    // ... base renderers
  };

  // Add boundary field renderers dynamically
  boundaryFields.forEach(field => {
    renderers[`boundaryHierarchy.${field}`] = (row) => (
      <span style={{ fontSize: '13px' }}>
        {row.boundaryHierarchy?.[field] || '-'}
      </span>
    );
  });

  return renderers;
}, [boundaryFields]);
```

## 🎯 Intelligent Label Generation

The system automatically generates human-readable labels from field names:

```javascript
// Field name → Generated label
'lga' → 'Lga'
'healthFacility' → 'Health Facility' 
'adminArea' → 'Admin Area'
'someCustomField' → 'Some Custom Field'
'UPPER_CASE' → 'UPPER CASE'
```

You can override any label using `customLabels`:

```javascript
customLabels: {
  lga: 'Local Government Area',
  healthFacility: 'Health Facility',
  adminLevel: 'Administrative Level'
}
```

## 🔧 Configuration Options

### Complete HOC Configuration

```javascript
const FilteredComponent = withBoundaryFilter(YourComponent, {
  // Auto-discovery (new)
  filterOrder: null, // null = auto-discover, array = custom order
  
  // UI Configuration  
  showFilters: true,
  showStats: true,
  showClearAll: true,
  filterPosition: 'top',
  
  // Behavior
  autoApplyFilters: true,
  persistFilters: true,
  storageKey: 'myComponentFilters',
  
  // Customization
  customLabels: {
    // Only specify labels you want to customize
  },
  
  // Validation
  requiredFilters: [], // Can use discovered field names
  
  // Styling
  filterStyle: { backgroundColor: '#f8f9fa' },
  statsStyle: { color: '#1565c0' },
  
  // Callbacks
  onFiltersChange: (activeFilters, allFilters) => {
    console.log('Available fields:', Object.keys(allFilters));
    console.log('Active filters:', activeFilters);
  }
});
```

## 🧪 Testing Different Data Structures

Use the `DynamicBoundaryFilterDemo` component to test various data structures:

```javascript
import DynamicBoundaryFilterDemo from './DynamicBoundaryFilterDemo';

// This component includes test datasets with different boundary structures
<DynamicBoundaryFilterDemo />
```

### Test Scenarios Included:

1. **Standard**: Traditional health system boundaries
2. **Custom**: Regional/zone-based boundaries  
3. **Mixed**: Partial data with missing fields
4. **Single Value**: Demonstrates filter hiding when only one value exists

## 🚨 Migration Guide

### From Fixed to Dynamic System:

#### Before (Fixed Fields):
```javascript
// Old way - fixed fields
filterOrder: ['country', 'state', 'lga', 'ward', 'healthFacility']
```

#### After (Dynamic Discovery):
```javascript
// New way - auto-discovery
filterOrder: null // or omit entirely

// OR specify custom order for your specific fields
filterOrder: ['region', 'country', 'zone', 'district']
```

### Benefits of Migration:

1. **Flexibility**: Works with any boundary structure
2. **Maintenance**: No need to update field lists when data changes
3. **UI Cleanliness**: Automatically hides irrelevant filters
4. **Performance**: Only processes fields that actually exist in data

## ⚡ Performance Considerations

- Field discovery runs only when data changes (memoized)
- Filter extraction is optimized with Set operations
- UI updates are batched to prevent excessive re-renders
- Statistics calculation is cached based on data reference

## 🎪 Advanced Usage

### Custom Field Ordering

```javascript
// Auto-discover but control order
const discoveredFields = discoverBoundaryFields(data);
const customOrder = ['country', ...discoveredFields.filter(f => f !== 'country')];

filterOrder: customOrder
```

### Conditional Filter Requirements

```javascript
// Dynamically set required filters based on discovered fields
requiredFilters: discoveredFields.includes('country') ? ['country'] : []
```

### Integration with Elasticsearch

```javascript
import { createBoundaryElasticsearchQuery } from '../utils/boundaryFilterUtils';

// Works with any boundary structure
const esQuery = createBoundaryElasticsearchQuery(activeFilters);
// Automatically generates proper Elasticsearch query regardless of field names
```

The dynamic boundary filter system provides maximum flexibility while maintaining ease of use and optimal performance!