# Generic Filter HOC System Guide

This guide explains the generic filter system that can create dropdown filters for any field attributes, and how to combine it with the boundary filter HOC.

## 🚀 Overview

The Generic Filter HOC (`withGenericFilter`) allows you to:
- Create dropdown filters for any data fields you specify
- Combine with boundary filters for multi-layered filtering
- Validate field paths automatically
- Support nested object properties with dot notation
- Persist filters in localStorage
- Apply custom styling and configurations

## 📋 Basic Usage

### Simple Generic Filter

```javascript
import withGenericFilter from './withGenericFilter';
import ReusableTableWrapper from './ReusableTableWrapper';

// Create filtered table for specific fields
const GenericFilteredTable = withGenericFilter(ReusableTableWrapper, {
  filterFields: ['deliveredBy', 'deliveryStatus', 'productName'], // Fields to filter
  showFilters: true,
  showStats: true,
  customLabels: {
    deliveredBy: 'Delivered By',
    deliveryStatus: 'Delivery Status',
    productName: 'Product Name'
  }
});

// Use it
<GenericFilteredTable 
  data={yourData} 
  columns={yourColumns}
/>
```

### Nested Field Support

```javascript
const AdvancedFilteredTable = withGenericFilter(ReusableTableWrapper, {
  filterFields: [
    'user.profile.department',  // Nested object access
    'contact.email',            // Nested properties
    'status',                   // Direct properties
    'metadata.tags'             // Deep nesting
  ],
  customLabels: {
    'user.profile.department': 'Department',
    'contact.email': 'Email Address',
    'metadata.tags': 'Tags'
  }
});
```

## 🔗 Combining with Boundary Filters

### Method 1: Boundary First, Generic Second

```javascript
// Step 1: Apply boundary filtering
const BoundaryFiltered = withBoundaryFilter(ReusableTableWrapper, {
  showFilters: true,
  showStats: true,
  filterStyle: { backgroundColor: '#f0f9ff' }
});

// Step 2: Apply generic filtering
const CombinedFiltered = withGenericFilter(BoundaryFiltered, {
  filterFields: ['deliveredBy', 'status', 'productName'],
  showFilters: true,
  filterStyle: { backgroundColor: '#f0fdf4' },
  customLabels: {
    deliveredBy: 'Delivered By',
    status: 'Delivery Status',
    productName: 'Product Name'
  }
});
```

### Method 2: Generic First, Boundary Second

```javascript
// Step 1: Apply generic filtering
const GenericFiltered = withGenericFilter(ReusableTableWrapper, {
  filterFields: ['role', 'department', 'status']
});

// Step 2: Apply boundary filtering
const CombinedFiltered = withBoundaryFilter(GenericFiltered, {
  showFilters: true,
  showStats: true
});
```

## ⚙️ Configuration Options

### Complete Configuration

```javascript
const FilteredComponent = withGenericFilter(YourComponent, {
  // Filter Configuration
  filterFields: ['field1', 'nested.field2', 'deep.nested.field3'],
  initialFilters: { field1: 'defaultValue' },
  requiredFilters: ['field1'], // Must be selected
  
  // UI Configuration
  showFilters: true,
  showStats: true,
  showClearAll: true,
  filterPosition: 'top', // 'top', 'bottom', 'none'
  
  // Behavior
  autoApplyFilters: true,
  persistFilters: true,
  storageKey: 'myGenericFilters',
  validateFields: true, // Validates field paths against data
  
  // Customization
  customLabels: {
    'nested.field': 'Custom Label',
    field1: 'Field One'
  },
  
  // Styling
  filterStyle: {
    backgroundColor: '#f8f9fa',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    padding: '16px'
  },
  statsStyle: {
    backgroundColor: '#e3f2fd',
    color: '#1565c0'
  },
  
  // Callbacks
  onFiltersChange: (activeFilters, allFilters) => {
    console.log('Filters changed:', activeFilters);
  },
  onDataFiltered: (filteredData, filters) => {
    console.log(`Filtered to ${filteredData.length} records`);
  },
  onFieldValidation: (validation) => {
    console.log('Invalid fields:', validation.invalid);
  }
});
```

## 🔍 Field Path Examples

### Basic Fields
```javascript
filterFields: [
  'name',           // Direct property
  'email',          // Direct property  
  'status',         // Direct property
  'role'            // Direct property
]
```

### Nested Objects
```javascript
filterFields: [
  'user.profile.name',        // user.profile.name
  'contact.address.city',     // contact.address.city
  'metadata.department',      // metadata.department
  'settings.preferences.theme' // settings.preferences.theme
]
```

### Mixed Examples
```javascript
filterFields: [
  'deliveredBy',                    // Direct field
  'boundaryHierarchy.state',       // Boundary field (if not using boundary HOC)
  'auditDetails.createdBy',        // Audit information
  'additionalDetails.category'     // Additional metadata
]
```

## 📊 Enhanced Props

Components wrapped with the generic filter HOC receive these additional props:

```javascript
{
  // Original props plus:
  data: filteredData,                    // Filtered data
  originalData: originalData,            // Original unfiltered data
  activeGenericFilters: {...},          // Current active filters
  genericFilterCount: 2,                 // Number of active filters
  genericFilterStats: {                 // Statistics
    original: {...},
    filtered: {...}
  },
  
  // Field validation
  validFilterFields: [...],              // Fields that exist in data
  invalidFilterFields: [...],            // Fields that don't exist
  
  // Control methods
  clearGenericFilters: () => {},         // Clear all filters
  setGenericFilter: (field, value) => {}, // Set specific filter
  removeGenericFilter: (field) => {},    // Remove specific filter
  toggleGenericFilters: () => {}         // Show/hide filter UI
}
```

## 🎛️ Different Variants

### Minimal Generic Filter

```javascript
const MinimalGenericFilter = withGenericFilter(ReusableTableWrapper, {
  filterFields: ['status', 'type'],
  showFilters: true,
  showStats: false,      // Clean look
  showClearAll: false,   // Minimal controls
  persistFilters: false, // No persistence
  filterStyle: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb'
  }
});
```

### Required Generic Filter

```javascript
const RequiredGenericFilter = withGenericFilter(ReusableTableWrapper, {
  filterFields: ['department', 'status', 'priority'],
  requiredFilters: ['department'], // Must select department
  showFilters: true,
  showStats: true,
  filterStyle: {
    backgroundColor: '#fef9e7',
    border: '2px solid #f59e0b'
  },
  onFiltersChange: (activeFilters) => {
    const missing = ['department'].filter(field => !activeFilters[field]);
    if (missing.length > 0) {
      console.warn('Missing required filters:', missing);
    }
  }
});
```

### Discovery-Based Filter

```javascript
import { discoverFields } from '../utils/genericFilterUtils';

// Automatically discover filterable fields
const DiscoveryGenericFilter = withGenericFilter(ReusableTableWrapper, {
  filterFields: discoverFields(yourData, 2), // Auto-discover up to depth 2
  showFilters: true,
  validateFields: true
});
```

## 🛠️ Utility Functions

### Field Discovery

```javascript
import { discoverFields } from '../utils/genericFilterUtils';

// Discover all filterable fields in your data
const fields = discoverFields(data, 2, ['boundaryHierarchy']); 
// depth=2, exclude boundaryHierarchy paths
// Result: ['name', 'email', 'status', 'user.profile.department']
```

### Field Validation

```javascript
import { validateFieldPaths } from '../utils/genericFilterUtils';

const validation = validateFieldPaths(data, ['name', 'invalid.field']);
// Result: { valid: ['name'], invalid: ['invalid.field'] }
```

### Manual Filtering

```javascript
import { applyGenericFilters } from '../utils/genericFilterUtils';

const filtered = applyGenericFilters(data, {
  'status': 'ACTIVE',
  'user.department': 'IT'
});
```

## 🔧 useGenericFilter Hook

For custom implementations without the HOC:

```javascript
import { useGenericFilter } from './withGenericFilter';

const MyComponent = ({ data }) => {
  const {
    filteredData,
    activeFilters,
    updateFilter,
    clearFilters,
    stats
  } = useGenericFilter(data, ['status', 'department', 'role']);

  return (
    <div>
      <select onChange={(e) => updateFilter('status', e.target.value)}>
        <option value="">All Status</option>
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Inactive</option>
      </select>
      
      <button onClick={clearFilters}>Clear</button>
      
      <div>Showing {filteredData.length} of {data.length} records</div>
      
      <YourTable data={filteredData} />
    </div>
  );
};
```

## 🎯 Best Practices

### 1. Field Selection
```javascript
// Good: Specific, meaningful fields
filterFields: ['deliveredBy', 'deliveryStatus', 'productName']

// Avoid: Too many fields (overwhelming UI)
filterFields: ['field1', 'field2', 'field3', 'field4', 'field5', 'field6']
```

### 2. Custom Labels
```javascript
// Good: Human-readable labels
customLabels: {
  'deliveredBy': 'Delivered By',
  'deliveryStatus': 'Delivery Status',
  'user.profile.dept': 'Department'
}
```

### 3. Combining with Boundary Filters
```javascript
// Good: Logical grouping
// Boundary filters (geographic) → Generic filters (operational)
const CombinedFilter = withGenericFilter(
  withBoundaryFilter(ReusableTableWrapper, boundaryConfig),
  genericConfig
);
```

### 4. Field Validation
```javascript
// Good: Enable validation for robust error handling
const FilteredTable = withGenericFilter(ReusableTableWrapper, {
  filterFields: ['some.nested.field'],
  validateFields: true,
  onFieldValidation: (validation) => {
    if (validation.invalid.length > 0) {
      console.error('Invalid filter fields:', validation.invalid);
    }
  }
});
```

## 🚨 Troubleshooting

### No Filter Options Showing
- Check that `filterFields` contains valid field paths
- Verify fields exist in your data structure
- Ensure fields have more than one unique value
- Check browser console for validation warnings

### Nested Fields Not Working
- Use dot notation: `'user.profile.name'`
- Verify the nested structure exists in your data
- Check for null/undefined values in the nested path

### Performance Issues
- Limit `filterFields` to essential fields only
- Use `validateFields: false` for large datasets if validation is slow
- Consider using `discoverFields` with appropriate depth limits

## 📱 Real-World Examples

### Healthcare System
```javascript
const HealthcareFilters = withGenericFilter(ReusableTableWrapper, {
  filterFields: [
    'staff.designation',
    'facility.type', 
    'patient.category',
    'treatment.status'
  ],
  customLabels: {
    'staff.designation': 'Staff Role',
    'facility.type': 'Facility Type',
    'patient.category': 'Patient Category',
    'treatment.status': 'Treatment Status'
  }
});
```

### Inventory Management
```javascript
const InventoryFilters = withGenericFilter(ReusableTableWrapper, {
  filterFields: [
    'product.category',
    'supplier.name',
    'warehouse.location',
    'stock.status'
  ],
  requiredFilters: ['product.category'],
  customLabels: {
    'product.category': 'Product Category',
    'supplier.name': 'Supplier',
    'warehouse.location': 'Warehouse',
    'stock.status': 'Stock Status'
  }
});
```

The Generic Filter HOC provides maximum flexibility for filtering any data structure while maintaining consistency with the boundary filter system!