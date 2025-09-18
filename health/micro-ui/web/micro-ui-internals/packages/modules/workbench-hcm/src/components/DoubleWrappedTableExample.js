import React from 'react';
import ReusableTableWrapper from './ReusableTableWrapper';
import withBoundaryFilter from './withBoundaryFilter';
import withGenericFilter from './withGenericFilter';

/**
 * Example showing exactly what was requested:
 * ReusableTableWrapper wrapped with boundary filter HOC, then wrapped with generic filter HOC
 */

// ============================================
// Step 1: Wrap ReusableTableWrapper with Boundary Filter
// ============================================
const BoundaryWrappedTable = withBoundaryFilter(ReusableTableWrapper, {
  showFilters: true,
  showStats: true,
  filterPosition: 'top',
  customLabels: {
    state: 'State',
    lga: 'Local Government Area',
    ward: 'Ward',
    healthFacility: 'Health Facility'
  },
  filterStyle: {
    backgroundColor: '#f0f9ff',
    border: '1px solid #bae6fd',
    borderRadius: '8px',
    padding: '16px'
  }
});

// ============================================
// Step 2: Wrap the Boundary Filtered Table with Generic Filter
// ============================================
const DoubleWrappedTable = withGenericFilter(BoundaryWrappedTable, {
  filterFields: ['deliveredBy', 'administrativeArea'], // Exactly as requested
  showFilters: true,
  showStats: true,
  filterPosition: 'top',
  customLabels: {
    deliveredBy: 'Delivered By',
    administrativeArea: 'Administrative Area'
  },
  filterStyle: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '8px'
  },
  onFiltersChange: (activeFilters) => {
    console.log('Generic filters (deliveredBy, administrativeArea) changed:', activeFilters);
  }
});

// ============================================
// Demo Component
// ============================================
const DoubleWrappedTableExample = () => {
  // Sample data that has both boundary hierarchy and the requested fields
  const sampleData = [
    {
      id: 1,
      taskId: 'TASK001',
      deliveredBy: 'John Doe',              // Generic filter field 1
      administrativeArea: 'Urban District',  // Generic filter field 2  
      productName: 'Medicine A',
      quantity: 100,
      deliveryStatus: 'COMPLETED',
      deliveryDate: '2024-01-15',
      boundaryHierarchy: {                   // Boundary filter fields
        country: 'NIGERIA',
        state: 'ONDO',
        lga: 'AKOKO NORTH WEST',
        ward: 'AJOWA',
        healthFacility: 'OLURO PALACE'
      }
    },
    {
      id: 2,
      taskId: 'TASK002',
      deliveredBy: 'Jane Smith',             // Generic filter field 1
      administrativeArea: 'Rural District',   // Generic filter field 2
      productName: 'Medicine B',
      quantity: 50,
      deliveryStatus: 'PENDING',
      deliveryDate: '2024-01-16',
      boundaryHierarchy: {                   // Boundary filter fields
        country: 'NIGERIA',
        state: 'LAGOS',
        lga: 'SURULERE',
        ward: 'COKER',
        healthFacility: 'RANDLE HOSPITAL'
      }
    },
    {
      id: 3,
      taskId: 'TASK003',
      deliveredBy: 'John Doe',               // Same deliveredBy (will create dropdown)
      administrativeArea: 'Urban District',   // Same administrativeArea (will create dropdown)
      productName: 'Medicine C',
      quantity: 75,
      deliveryStatus: 'COMPLETED',
      deliveryDate: '2024-01-17',
      boundaryHierarchy: {                   // Boundary filter fields
        country: 'NIGERIA',
        state: 'ONDO',
        lga: 'AKOKO NORTH EAST',
        ward: 'IKARE',
        healthFacility: 'IKARE HOSPITAL'
      }
    },
    {
      id: 4,
      taskId: 'TASK004',
      deliveredBy: 'Bob Johnson',            // Different deliveredBy (adds to dropdown)
      administrativeArea: 'Suburban Area',    // Different administrativeArea (adds to dropdown)
      productName: 'Medicine D',
      quantity: 25,
      deliveryStatus: 'FAILED',
      deliveryDate: '2024-01-18',
      boundaryHierarchy: {                   // Boundary filter fields
        country: 'NIGERIA',
        state: 'LAGOS',
        lga: 'LAGOS ISLAND',
        ward: 'ISALE EKO',
        healthFacility: 'LAGOS HOSPITAL'
      }
    }
  ];

  const columns = [
    { key: 'taskId', label: 'Task ID', sortable: true },
    { key: 'deliveredBy', label: 'Delivered By', sortable: true },
    { key: 'administrativeArea', label: 'Administrative Area', sortable: true },
    { key: 'productName', label: 'Product', sortable: true },
    { key: 'quantity', label: 'Quantity', sortable: true },
    { key: 'deliveryStatus', label: 'Status', sortable: true },
    { key: 'deliveryDate', label: 'Date', sortable: true }
  ];

  return (
    <div style={{ padding: '20px' }}>
      {/* Explanation Header */}
      <div style={{
        backgroundColor: '#fef3c7',
        border: '1px solid #f59e0b',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#92400e', marginBottom: '12px' }}>
          🎯 Double Wrapped Table Example
        </h1>
        
        <div style={{ fontSize: '14px', color: '#92400e', lineHeight: '1.6' }}>
          <p><strong>Exactly as requested:</strong></p>
          <ol style={{ marginLeft: '20px' }}>
            <li><strong>ReusableTableWrapper</strong> - Base table component</li>
            <li><strong>+ withBoundaryFilter</strong> - Adds boundary filtering (state, lga, ward, healthFacility)</li>
            <li><strong>+ withGenericFilter</strong> - Adds generic filtering for: <code>['deliveredBy', 'administrativeArea']</code></li>
          </ol>
          
          <p style={{ marginTop: '12px' }}>
            <strong>Result:</strong> Two dropdown sets will be created:
          </p>
          <ul style={{ marginLeft: '20px' }}>
            <li><strong>Boundary Filters:</strong> Automatically discovered boundary fields (country, state, lga, ward, healthFacility)</li>
            <li><strong>Generic Filters:</strong> 2 dropdowns for "deliveredBy" and "administrativeArea" with unique values</li>
          </ul>
        </div>
      </div>

      {/* Expected Behavior */}
      <div style={{
        backgroundColor: '#e0f2fe',
        border: '1px solid #0288d1',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#01579b', marginBottom: '8px' }}>
          📋 Expected Behavior:
        </h3>
        <ul style={{ fontSize: '13px', color: '#01579b', marginLeft: '20px' }}>
          <li><strong>Generic Filters (Top):</strong> "Delivered By" dropdown (John Doe, Jane Smith, Bob Johnson) + "Administrative Area" dropdown (Urban District, Rural District, Suburban Area)</li>
          <li><strong>Boundary Filters (Below):</strong> Auto-discovered boundary dropdowns (Country, State, LGA, Ward, Health Facility)</li>
          <li><strong>Filtering Order:</strong> Generic filters applied first, then boundary filters</li>
          <li><strong>Data Flow:</strong> Original Data → Generic Filter → Boundary Filter → Filtered Table</li>
        </ul>
      </div>

      {/* The Double Wrapped Table */}
      <DoubleWrappedTable
        title="Double Wrapped Table: Generic + Boundary Filters"
        data={sampleData}
        columns={columns}
        pagination={true}
        paginationPerPage={10}
        enableExcelDownload={true}
        excelFileName="double_wrapped_table_data"
        excelButtonText="Download Filtered Data"
      />

      {/* Code Example */}
      <div style={{
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '20px',
        marginTop: '30px'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#334155', marginBottom: '16px' }}>
          💻 Code Implementation
        </h3>
        
        <pre style={{
          backgroundColor: '#f1f5f9',
          padding: '16px',
          borderRadius: '6px',
          fontSize: '13px',
          overflow: 'auto',
          lineHeight: '1.4'
        }}>
{`// Step 1: Wrap ReusableTableWrapper with boundary filter
const BoundaryWrappedTable = withBoundaryFilter(ReusableTableWrapper, {
  showFilters: true,
  showStats: true,
  // ... boundary filter config
});

// Step 2: Wrap the result with generic filter for specific attributes
const DoubleWrappedTable = withGenericFilter(BoundaryWrappedTable, {
  filterFields: ['deliveredBy', 'administrativeArea'], // Your specified attributes
  showFilters: true,
  showStats: true,
  customLabels: {
    deliveredBy: 'Delivered By',
    administrativeArea: 'Administrative Area'
  }
});

// Step 3: Use the double-wrapped component
<DoubleWrappedTable 
  data={yourData} 
  columns={yourColumns}
/>`}
        </pre>

        <div style={{ marginTop: '16px', fontSize: '14px', color: '#64748b' }}>
          <p><strong>Key Points:</strong></p>
          <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
            <li>The <code>filterFields</code> array determines which attributes get dropdown filters</li>
            <li>Only fields with multiple unique values will show dropdowns</li>
            <li>You can specify any field names: <code>['status', 'category', 'assignedTo']</code></li>
            <li>Supports nested fields: <code>['user.department', 'location.district']</code></li>
            <li>Each HOC can have independent styling and configuration</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DoubleWrappedTableExample;