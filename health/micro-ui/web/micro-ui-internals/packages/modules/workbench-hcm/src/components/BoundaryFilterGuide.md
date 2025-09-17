# Boundary Filter System Guide

This guide explains how to use the boundary filtering system implemented for the HCM Workbench module.

## Overview

The boundary filter system provides automatic filtering capabilities for data that contains `boundaryHierarchy` objects. It includes:

1. **BoundaryFilterComponent** - Standalone filter component
2. **withBoundaryFilter HOC** - Higher-Order Component for adding filtering to any component
3. **useBoundaryFilter hook** - Hook for custom filter implementations
4. **Utility functions** - Helper functions for filtering operations

## Components

### 1. BoundaryFilterComponent

A reusable dropdown-based filter component that automatically extracts unique boundary values from data.

```jsx
import BoundaryFilterComponent from './BoundaryFilterComponent';

<BoundaryFilterComponent
  data={yourData}
  onFiltersChange={(activeFilters, allFilters) => {
    console.log('Active filters:', activeFilters);
    // Apply filters to your data
  }}
  showClearAll={true}
  customLabels={{
    lga: 'Local Government Area',
    healthFacility: 'Health Facility'
  }}
/>
```

### 2. withBoundaryFilter HOC

Wraps any component to add automatic boundary filtering capability.

```jsx
import withBoundaryFilter from './withBoundaryFilter';
import YourComponent from './YourComponent';

// Create filtered version
const FilteredComponent = withBoundaryFilter(YourComponent, {
  showFilters: true,
  showStats: true,
  persistFilters: true,
  storageKey: 'myFilters'
});

// Use it
<FilteredComponent data={yourData} />
```

### 3. useBoundaryFilter Hook

For custom filter implementations in functional components.

```jsx
import { useBoundaryFilter } from './withBoundaryFilter';

const MyComponent = ({ data }) => {
  const {
    filteredData,
    activeFilters,
    updateFilter,
    clearFilters,
    stats
  } = useBoundaryFilter(data);

  return (
    <div>
      <select onChange={(e) => updateFilter('state', e.target.value)}>
        <option value="">All States</option>
        {/* Add options */}
      </select>
      <div>Showing {filteredData.length} of {data.length} records</div>
    </div>
  );
};
```

## Data Format Requirements

Your data must contain `boundaryHierarchy` objects with these fields:

```javascript
{
  id: 'unique-id',
  name: 'Record Name',
  // ... other fields
  boundaryHierarchy: {
    country: 'NIGERIA',
    state: 'ONDO',
    lga: 'AKOKO NORTH WEST',
    ward: 'AJOWA/IGASI/GEDEGEDE', 
    healthFacility: 'OLURO PALACE'
  }
}
```

## HOC Configuration Options

```javascript
const options = {
  // UI Configuration
  showFilters: true,              // Show filter dropdowns
  showStats: true,                // Show statistics bar
  showClearAll: true,             // Show clear all button
  filterPosition: 'top',          // 'top', 'bottom', 'none'
  
  // Behavior
  autoApplyFilters: true,         // Auto-apply filters
  persistFilters: false,          // Save filters in localStorage
  storageKey: 'boundaryFilters',  // localStorage key
  
  // Filter Configuration
  filterOrder: ['country', 'state', 'lga', 'ward', 'healthFacility'],
  requiredFilters: ['country'],   // Required filter selections
  
  // Customization
  customLabels: {
    lga: 'Local Government Area',
    healthFacility: 'Health Facility'
  },
  
  // Styling
  filterStyle: {
    backgroundColor: '#f8f9fa'
  },
  statsStyle: {
    backgroundColor: '#e5e7eb'
  },
  
  // Callbacks
  onFiltersChange: (activeFilters, allFilters) => {
    console.log('Filters changed:', activeFilters);
  },
  onDataFiltered: (filteredData, filters) => {
    console.log('Data filtered:', filteredData.length);
  }
};
```

## Enhanced Props

Components wrapped with the HOC receive these additional props:

```javascript
{
  // Original props plus:
  data: filteredData,              // Filtered data array
  originalData: originalData,      // Original unfiltered data
  activeFilters: {...},           // Current active filters
  filterCount: 2,                 // Number of active filters
  dataStats: {                    // Statistics about data
    original: {...},
    filtered: {...}
  },
  
  // Filter control methods
  clearFilters: () => {},         // Clear all filters
  setFilter: (type, value) => {}, // Set specific filter
  removeFilter: (type) => {},     // Remove specific filter
  toggleFilters: () => {}         // Show/hide filter UI
}
```

## Integration Examples

### Basic Usage with Existing Components

```jsx
// Import your existing component
import DeliveryComponent from './DeliveryComponent';
import withBoundaryFilter from './withBoundaryFilter';

// Create filtered version
const FilteredDeliveryComponent = withBoundaryFilter(DeliveryComponent, {
  showFilters: true,
  showStats: true,
  persistFilters: true,
  storageKey: 'deliveryFilters'
});

// Use in parent component
<FilteredDeliveryComponent 
  projectId={projectId}
  // ... other props
/>
```

### Custom Component with Enhanced Props

```jsx
const CustomComponent = ({ 
  data, 
  originalData, 
  activeFilters, 
  clearFilters, 
  setFilter 
}) => {
  return (
    <div>
      {/* Custom filter buttons */}
      <button onClick={() => setFilter('state', 'ONDO')}>
        Filter ONDO State
      </button>
      <button onClick={clearFilters}>Clear All</button>
      
      {/* Display filtered data */}
      <div>Showing {data.length} of {originalData.length} records</div>
      
      {/* Your data display */}
      <YourDataTable data={data} />
    </div>
  );
};

const FilteredCustomComponent = withBoundaryFilter(CustomComponent);
```

## Utility Functions

### applyBoundaryFilters

```javascript
import { applyBoundaryFilters } from '../utils/boundaryFilterUtils';

const filteredData = applyBoundaryFilters(data, { 
  state: 'ONDO', 
  lga: 'AKOKO NORTH WEST' 
});
```

### extractBoundaryOptions

```javascript
import { extractBoundaryOptions } from '../utils/boundaryFilterUtils';

const options = extractBoundaryOptions(data);
// Returns: { country: [...], state: [...], lga: [...], ward: [...], healthFacility: [...] }
```

### getBoundaryStats

```javascript
import { getBoundaryStats } from '../utils/boundaryFilterUtils';

const stats = getBoundaryStats(data);
// Returns: { totalRecords, recordsWithBoundary, uniqueCountries, ... }
```

## Best Practices

1. **Data Structure**: Ensure consistent `boundaryHierarchy` structure across all records
2. **Performance**: Use `useMemo` for expensive operations when using the hook directly
3. **Persistence**: Use `persistFilters` and unique `storageKey` for better UX
4. **Accessibility**: Custom labels make the interface more user-friendly
5. **Error Handling**: Check for missing boundary data in your components

## Troubleshooting

### No Filter Options Showing
- Check that your data contains `boundaryHierarchy` objects
- Verify the boundary field names match expected values
- Use browser dev tools to inspect the data structure

### Filters Not Working
- Ensure `autoApplyFilters` is true (default)
- Check that `onFiltersChange` callback is properly implemented
- Verify data is being passed correctly to the HOC

### Performance Issues
- Use appropriate `maxRecordLimit` in Elasticsearch hooks
- Consider implementing pagination for large datasets
- Use `useMemo` for expensive data transformations

## Advanced Usage

### Elasticsearch Integration

The system works seamlessly with Elasticsearch data:

```javascript
import { createBoundaryElasticsearchQuery } from '../utils/boundaryFilterUtils';

const esQuery = createBoundaryElasticsearchQuery({
  state: 'ONDO',
  lga: 'AKOKO NORTH WEST'
});

// Use this query in your useSimpleElasticsearch hook
```

### Multiple Filter Instances

You can have multiple filtered components on the same page:

```jsx
<FilteredDeliveryComponent storageKey="deliveryFilters" />
<FilteredStockComponent storageKey="stockFilters" />
<FilteredUsersComponent storageKey="usersFilters" />
```

Each will maintain separate filter states when using different storage keys.