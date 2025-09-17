import React from 'react';
import withBoundaryFilter, { useBoundaryFilter } from './withBoundaryFilter';
import ReusableTableWrapper from './ReusableTableWrapper';
import DeliveryComponent from './DeliveryComponent';
import StockTransactionComponent from './StockTransactionComponent';
import UsersComponent from './UsersComponent';

// ============================================
// Example 1: Simple Table with Automatic Filtering
// ============================================

const SimpleTable = ({ data, columns }) => {
  return (
    <ReusableTableWrapper
      title="Filtered Data Table"
      data={data}
      columns={columns}
      pagination={true}
      paginationPerPage={25}
      enableExcelDownload={true}
      excelFileName="filtered_data"
    />
  );
};

// Wrap SimpleTable with boundary filtering
export const FilteredSimpleTable = withBoundaryFilter(SimpleTable, {
  showFilters: true,
  showStats: true,
  showClearAll: true,
  filterPosition: 'top',
  customLabels: {
    lga: 'Local Government Area',
    healthFacility: 'Health Facility'
  }
});

// ============================================
// Example 2: Enhanced Delivery Component with Filtering
// ============================================

export const FilteredDeliveryComponent = withBoundaryFilter(DeliveryComponent, {
  showFilters: true,
  showStats: true,
  filterPosition: 'top',
  persistFilters: true, // Saves filters in localStorage
  storageKey: 'deliveryBoundaryFilters',
  onFiltersChange: (activeFilters) => {
    console.log('Delivery filters changed:', activeFilters);
  },
  onDataFiltered: (filteredData, filters) => {
    console.log(`Filtered to ${filteredData.length} delivery records`);
  }
});

// ============================================
// Example 3: Stock Transaction with Required Filters
// ============================================

export const FilteredStockComponent = withBoundaryFilter(StockTransactionComponent, {
  showFilters: true,
  showStats: true,
  requiredFilters: ['country', 'state'], // These filters must be selected
  filterPosition: 'top',
  filterStyle: {
    backgroundColor: '#fef3c7',
    borderBottom: '2px solid #f59e0b'
  },
  statsStyle: {
    backgroundColor: '#fef3c7',
    color: '#92400e'
  }
});

// ============================================
// Example 4: Users Component with Hidden Filters
// ============================================

export const AutoFilteredUsersComponent = withBoundaryFilter(UsersComponent, {
  showFilters: false, // Filters hidden by default
  showStats: true,
  filterPosition: 'none', // No filter UI, just filtered data
  autoApplyFilters: true
});

// ============================================
// Example 5: Custom Component Using Enhanced Props
// ============================================

const CustomDataView = ({ 
  data, 
  originalData, 
  activeFilters, 
  filterCount,
  dataStats,
  clearFilters,
  setFilter,
  removeFilter,
  toggleFilters 
}) => {
  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3>Custom Data View with Filter Controls</h3>
        
        {/* Display filter information */}
        <div style={{ marginBottom: '10px' }}>
          <p>Total Records: {originalData.length}</p>
          <p>Filtered Records: {data.length}</p>
          <p>Active Filters: {filterCount}</p>
          <p>Coverage: {dataStats.original.coveragePercentage}%</p>
        </div>

        {/* Custom filter controls */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <button 
            onClick={() => setFilter('state', 'ONDO')}
            style={{ padding: '5px 10px' }}
          >
            Filter ONDO State
          </button>
          
          <button 
            onClick={() => removeFilter('state')}
            style={{ padding: '5px 10px' }}
          >
            Remove State Filter
          </button>
          
          <button 
            onClick={clearFilters}
            style={{ padding: '5px 10px' }}
          >
            Clear All Filters
          </button>
          
          <button 
            onClick={toggleFilters}
            style={{ padding: '5px 10px' }}
          >
            Toggle Filter UI
          </button>
        </div>

        {/* Display active filters */}
        {filterCount > 0 && (
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#e5e7eb', 
            borderRadius: '4px' 
          }}>
            <strong>Active Filters:</strong>
            {Object.entries(activeFilters).map(([key, value]) => (
              <span key={key} style={{ marginLeft: '10px' }}>
                {key}: {value}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Data display */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '10px'
      }}>
        {data.slice(0, 10).map((item, index) => (
          <div key={index} style={{
            padding: '10px',
            border: '1px solid #e5e7eb',
            borderRadius: '4px',
            backgroundColor: '#f9fafb'
          }}>
            <div>ID: {item.id}</div>
            <div>Location: {item.boundaryHierarchy?.ward || 'N/A'}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const EnhancedCustomView = withBoundaryFilter(CustomDataView, {
  showFilters: true,
  showStats: true,
  filterPosition: 'top'
});

// ============================================
// Example 6: Using the Hook for Custom Logic
// ============================================

export const CustomFilteredComponent = ({ data }) => {
  const {
    filteredData,
    activeFilters,
    updateFilter,
    clearFilters,
    stats
  } = useBoundaryFilter(data);

  return (
    <div style={{ padding: '20px' }}>
      <h3>Custom Component Using useBoundaryFilter Hook</h3>
      
      {/* Custom filter buttons */}
      <div style={{ marginBottom: '20px' }}>
        <select 
          onChange={(e) => updateFilter('state', e.target.value)}
          value={activeFilters.state || ''}
          style={{ marginRight: '10px' }}
        >
          <option value="">All States</option>
          <option value="ONDO">ONDO</option>
          <option value="LAGOS">LAGOS</option>
        </select>
        
        <button onClick={clearFilters}>Clear Filters</button>
      </div>

      {/* Stats display */}
      <div style={{ marginBottom: '20px' }}>
        Showing {filteredData.length} of {data.length} records
        {stats.filtered.coveragePercentage && (
          <span> ({stats.filtered.coveragePercentage}% with boundary data)</span>
        )}
      </div>

      {/* Data table */}
      <ReusableTableWrapper
        data={filteredData}
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Name' },
          { key: 'boundaryHierarchy.state', label: 'State' },
          { key: 'boundaryHierarchy.lga', label: 'LGA' }
        ]}
        pagination={true}
      />
    </div>
  );
};

// ============================================
// Example 7: Multiple Filter Configurations
// ============================================

// Minimal configuration - just filtering, no UI
export const MinimalFiltered = withBoundaryFilter(SimpleTable, {
  filterPosition: 'none',
  showStats: false
});

// Full featured with all options
export const FullFeaturedFiltered = withBoundaryFilter(SimpleTable, {
  showFilters: true,
  showStats: true,
  showClearAll: true,
  autoApplyFilters: true,
  persistFilters: true,
  filterPosition: 'top',
  storageKey: 'myComponentFilters',
  customLabels: {
    country: 'Nation',
    state: 'Province',
    lga: 'District',
    ward: 'Sub-District',
    healthFacility: 'Health Center'
  },
  filterOrder: ['country', 'state', 'lga', 'ward', 'healthFacility'],
  requiredFilters: [],
  filterStyle: {
    backgroundColor: '#f3f4f6',
    padding: '20px'
  },
  statsStyle: {
    backgroundColor: '#e5e7eb',
    fontSize: '14px'
  },
  onFiltersChange: (activeFilters, allFilters) => {
    console.log('Filters changed:', activeFilters);
  },
  onDataFiltered: (filteredData, filters) => {
    console.log(`Data filtered: ${filteredData.length} records`);
  }
});

// ============================================
// Usage in Parent Component
// ============================================

export const ParentComponentExample = () => {
  // Sample data with boundaryHierarchy
  const sampleData = [
    {
      id: 1,
      name: 'Record 1',
      boundaryHierarchy: {
        country: 'NIGERIA',
        state: 'ONDO',
        lga: 'AKOKO NORTH WEST',
        ward: 'AJOWA/IGASI/GEDEGEDE',
        healthFacility: 'OLURO PALACE'
      }
    },
    // ... more data
  ];

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'boundaryHierarchy.state', label: 'State' },
    { key: 'boundaryHierarchy.ward', label: 'Ward' }
  ];

  return (
    <div>
      <h2>HOC Examples</h2>
      
      {/* Example 1: Simple filtered table */}
      <FilteredSimpleTable 
        data={sampleData} 
        columns={columns} 
      />
      
      {/* Example 2: With external filter control */}
      <FilteredSimpleTable 
        data={sampleData} 
        columns={columns}
        externalFilters={{ state: 'ONDO' }}
      />
      
      {/* Example 3: Using the hook */}
      <CustomFilteredComponent data={sampleData} />
    </div>
  );
};

export default ParentComponentExample;