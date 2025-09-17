import React from 'react';
import withBoundaryFilter from './withBoundaryFilter';
import DeliveryComponent from './DeliveryComponent';
import StockTransactionComponent from './StockTransactionComponent';
import UsersComponent from './UsersComponent';

/**
 * Integration examples showing how to use the withBoundaryFilter HOC
 * with existing data components
 */

// ============================================
// 1. Enhanced Delivery Component with Boundary Filtering
// ============================================

export const FilteredDeliveryComponent = withBoundaryFilter(DeliveryComponent, {
  showFilters: true,
  showStats: true,
  filterPosition: 'top',
  persistFilters: true,
  storageKey: 'deliveryBoundaryFilters',
  customLabels: {
    lga: 'Local Government Area',
    healthFacility: 'Health Facility'
  },
  onFiltersChange: (activeFilters) => {
    console.log('Delivery boundary filters changed:', activeFilters);
  },
  onDataFiltered: (filteredData, filters) => {
    console.log(`Delivery data filtered to ${filteredData.length} records`);
  }
});

// ============================================
// 2. Enhanced Stock Transaction Component with Required Filters
// ============================================

export const FilteredStockComponent = withBoundaryFilter(StockTransactionComponent, {
  showFilters: true,
  showStats: true,
  requiredFilters: ['country', 'state'], // Must select these filters
  filterPosition: 'top',
  persistFilters: true,
  storageKey: 'stockBoundaryFilters',
  customLabels: {
    lga: 'Local Government Area',
    healthFacility: 'Health Facility'
  },
  filterStyle: {
    backgroundColor: '#fef3c7',
    borderBottom: '2px solid #f59e0b'
  },
  statsStyle: {
    backgroundColor: '#fef3c7',
    color: '#92400e'
  },
  onFiltersChange: (activeFilters) => {
    console.log('Stock boundary filters changed:', activeFilters);
  }
});

// ============================================
// 3. Enhanced Users Component with Auto-filtering
// ============================================

export const FilteredUsersComponent = withBoundaryFilter(UsersComponent, {
  showFilters: true,
  showStats: true,
  autoApplyFilters: true,
  filterPosition: 'top',
  persistFilters: true,
  storageKey: 'usersBoundaryFilters',
  customLabels: {
    lga: 'Local Government Area', 
    healthFacility: 'Health Facility'
  },
  onDataFiltered: (filteredData, filters) => {
    console.log(`Users data filtered to ${filteredData.length} records`);
  }
});

// ============================================
// 4. Component with Minimal Filtering (Hidden UI)
// ============================================

export const MinimalFilteredDelivery = withBoundaryFilter(DeliveryComponent, {
  showFilters: false,
  showStats: true,
  filterPosition: 'none'
});

// ============================================
// 5. Usage Example in Parent Component
// ============================================

const IntegratedFilterExample = ({ projectId, boundaryType, boundaryCode }) => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <h2 style={{ margin: '20px', color: '#374151' }}>
        Boundary Filtered Components
      </h2>
      
      {/* Example 1: Delivery Component with Filtering */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ margin: '20px', fontSize: '18px', color: '#6b7280' }}>
          1. Delivery Component with Boundary Filtering
        </h3>
        <FilteredDeliveryComponent
          projectId={projectId}
          boundaryType={boundaryType}
          boundaryCode={boundaryCode}
        />
      </div>

      {/* Example 2: Stock Component with Required Filters */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ margin: '20px', fontSize: '18px', color: '#6b7280' }}>
          2. Stock Transactions with Required Boundary Filters
        </h3>
        <FilteredStockComponent
          projectId={projectId}
          boundaryType={boundaryType}
          boundaryCode={boundaryCode}
        />
      </div>

      {/* Example 3: Users Component */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ margin: '20px', fontSize: '18px', color: '#6b7280' }}>
          3. Users Component with Auto-filtering
        </h3>
        <FilteredUsersComponent
          projectId={projectId}
          boundaryType={boundaryType}
          boundaryCode={boundaryCode}
        />
      </div>
    </div>
  );
};

// ============================================
// 6. Advanced Usage with Custom Filter Control
// ============================================

export const CustomFilteredDelivery = ({ projectId, boundaryType, boundaryCode }) => {
  // You can also create components that use the enhanced props
  const DeliveryWithCustomControls = ({ 
    data, 
    originalData, 
    activeFilters, 
    clearFilters, 
    setFilter,
    dataStats,
    ...props 
  }) => {
    return (
      <div>
        {/* Custom filter controls */}
        <div style={{ 
          padding: '16px 20px', 
          backgroundColor: '#f3f4f6', 
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <strong>Custom Controls:</strong>
            <button 
              onClick={() => setFilter('state', 'ONDO')}
              style={{ 
                marginLeft: '10px', 
                padding: '4px 12px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Filter ONDO
            </button>
            <button 
              onClick={clearFilters}
              style={{ 
                marginLeft: '10px', 
                padding: '4px 12px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Clear All
            </button>
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            {data.length} of {originalData.length} records
            {Object.keys(activeFilters).length > 0 && 
              ` (${Object.keys(activeFilters).length} filters active)`
            }
          </div>
        </div>

        {/* Original delivery component */}
        <DeliveryComponent {...props} />
      </div>
    );
  };

  const CustomFilteredComponent = withBoundaryFilter(DeliveryWithCustomControls, {
    showFilters: true,
    showStats: false, // We have custom stats above
    filterPosition: 'top'
  });

  return (
    <CustomFilteredComponent
      projectId={projectId}
      boundaryType={boundaryType}
      boundaryCode={boundaryCode}
    />
  );
};

export default IntegratedFilterExample;