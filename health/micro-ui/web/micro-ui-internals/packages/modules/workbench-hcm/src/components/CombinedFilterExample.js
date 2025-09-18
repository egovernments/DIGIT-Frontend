import React from 'react';
import ReusableTableWrapper from './ReusableTableWrapper';
import withBoundaryFilter from './withBoundaryFilter';
import withGenericFilter from './withGenericFilter';

/**
 * Example showing how to combine boundary and generic filter HOCs
 * This demonstrates the power of composing multiple HOCs for complex filtering scenarios
 */

// ============================================
// Example 1: Boundary + Generic Filters
// ============================================

// First, create a table with boundary filtering
const BoundaryFilteredTable = withBoundaryFilter(ReusableTableWrapper, {
  showFilters: true,
  showStats: true,
  filterPosition: 'top',
  persistFilters: true,
  storageKey: 'combinedBoundaryFilters',
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
  },
  statsStyle: {
    backgroundColor: '#dbeafe',
    color: '#1e40af'
  }
});

// Then, wrap it with generic filtering for additional fields
const CombinedFilteredTable = withGenericFilter(BoundaryFilteredTable, {
  showFilters: true,
  showStats: true,
  filterPosition: 'top',
  persistFilters: true,
  storageKey: 'combinedGenericFilters',
  filterFields: ['deliveredBy', 'deliveryStatus', 'productName'], // Generic fields to filter
  customLabels: {
    deliveredBy: 'Delivered By',
    deliveryStatus: 'Delivery Status',
    productName: 'Product Name'
  },
  filterStyle: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '8px'
  },
  statsStyle: {
    backgroundColor: '#dcfce7',
    color: '#166534'
  },
  onFiltersChange: (activeFilters) => {
    console.log('Generic filters changed:', activeFilters);
  },
  onDataFiltered: (filteredData, filters) => {
    console.log(`Generic filtering: ${filteredData.length} records after applying:`, filters);
  }
});

// ============================================
// Example 2: Different Order - Generic First
// ============================================

// First apply generic filtering
const GenericFilteredTable = withGenericFilter(ReusableTableWrapper, {
  showFilters: true,
  showStats: true,
  filterPosition: 'top',
  filterFields: ['role', 'status', 'localityCode'],
  customLabels: {
    role: 'User Role',
    status: 'Status',
    localityCode: 'Locality Code'
  },
  filterStyle: {
    backgroundColor: '#fefce8',
    border: '1px solid #fef08a'
  }
});

// Then apply boundary filtering
const GenericThenBoundaryTable = withBoundaryFilter(GenericFilteredTable, {
  showFilters: true,
  showStats: true,
  filterPosition: 'top',
  filterStyle: {
    backgroundColor: '#f3e8ff',
    border: '1px solid #d8b4fe'
  }
});

// ============================================
// Example 3: Stock Data with Multiple Filter Types
// ============================================

const StockBoundaryTable = withBoundaryFilter(ReusableTableWrapper, {
  showFilters: true,
  showStats: true,
  filterPosition: 'top',
  requiredFilters: ['state'],
  customLabels: {
    state: 'State',
    lga: 'Local Government Area',
    healthFacility: 'Health Facility'
  },
  filterStyle: {
    backgroundColor: '#fef9e7',
    border: '2px solid #f59e0b'
  }
});

const StockCombinedTable = withGenericFilter(StockBoundaryTable, {
  showFilters: true,
  showStats: true,
  filterPosition: 'top',
  filterFields: ['transactionType', 'facilityName', 'createdBy'],
  requiredFilters: ['transactionType'],
  customLabels: {
    transactionType: 'Transaction Type',
    facilityName: 'Facility Name',
    createdBy: 'Created By'
  },
  filterStyle: {
    backgroundColor: '#fff7ed',
    border: '1px solid #fed7aa'
  }
});

// ============================================
// Main Demo Component
// ============================================

const CombinedFilterExample = () => {
  // Sample data for delivery records
  const deliveryData = [
    {
      id: 1,
      deliveredBy: 'John Doe',
      deliveryStatus: 'COMPLETED',
      productName: 'Medicine A',
      quantity: 100,
      deliveryDate: '2024-01-15',
      boundaryHierarchy: {
        country: 'NIGERIA',
        state: 'ONDO',
        lga: 'AKOKO NORTH WEST',
        ward: 'AJOWA',
        healthFacility: 'OLURO PALACE'
      }
    },
    {
      id: 2,
      deliveredBy: 'Jane Smith',
      deliveryStatus: 'PENDING',
      productName: 'Medicine B',
      quantity: 50,
      deliveryDate: '2024-01-16',
      boundaryHierarchy: {
        country: 'NIGERIA',
        state: 'LAGOS',
        lga: 'SURULERE',
        ward: 'COKER',
        healthFacility: 'RANDLE HOSPITAL'
      }
    },
    {
      id: 3,
      deliveredBy: 'John Doe',
      deliveryStatus: 'COMPLETED',
      productName: 'Medicine A',
      quantity: 75,
      deliveryDate: '2024-01-17',
      boundaryHierarchy: {
        country: 'NIGERIA',
        state: 'ONDO',
        lga: 'AKOKO NORTH EAST',
        ward: 'IKARE',
        healthFacility: 'IKARE HOSPITAL'
      }
    },
    {
      id: 4,
      deliveredBy: 'Bob Johnson',
      deliveryStatus: 'FAILED',
      productName: 'Medicine C',
      quantity: 25,
      deliveryDate: '2024-01-18',
      boundaryHierarchy: {
        country: 'NIGERIA',
        state: 'LAGOS',
        lga: 'LAGOS ISLAND',
        ward: 'ISALE EKO',
        healthFacility: 'LAGOS HOSPITAL'
      }
    }
  ];

  // Sample data for users
  const usersData = [
    {
      id: 1,
      name: 'Alice Johnson',
      role: 'SUPERVISOR',
      status: 'ACTIVE',
      localityCode: 'RURAL',
      boundaryHierarchy: {
        country: 'NIGERIA',
        state: 'ONDO',
        lga: 'AKOKO NORTH WEST'
      }
    },
    {
      id: 2,
      name: 'Bob Smith',
      role: 'FIELD_WORKER',
      status: 'ACTIVE',
      localityCode: 'URBAN',
      boundaryHierarchy: {
        country: 'NIGERIA',
        state: 'LAGOS',
        lga: 'SURULERE'
      }
    },
    {
      id: 3,
      name: 'Carol Davis',
      role: 'ADMIN',
      status: 'INACTIVE',
      localityCode: 'RURAL',
      boundaryHierarchy: {
        country: 'NIGERIA',
        state: 'ONDO',
        lga: 'AKOKO NORTH EAST'
      }
    }
  ];

  // Sample stock data
  const stockData = [
    {
      id: 1,
      transactionType: 'RECEIPT',
      facilityName: 'Central Warehouse',
      quantity: 1000,
      createdBy: 'admin@system.com',
      boundaryHierarchy: {
        country: 'NIGERIA',
        state: 'ONDO',
        lga: 'AKOKO NORTH WEST',
        healthFacility: 'CENTRAL WAREHOUSE'
      }
    },
    {
      id: 2,
      transactionType: 'ISSUE',
      facilityName: 'District Hospital',
      quantity: 100,
      createdBy: 'nurse@hospital.com',
      boundaryHierarchy: {
        country: 'NIGERIA',
        state: 'LAGOS',
        lga: 'SURULERE',
        healthFacility: 'DISTRICT HOSPITAL'
      }
    }
  ];

  const deliveryColumns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'deliveredBy', label: 'Delivered By', sortable: true },
    { key: 'deliveryStatus', label: 'Status', sortable: true },
    { key: 'productName', label: 'Product', sortable: true },
    { key: 'quantity', label: 'Quantity', sortable: true },
    { key: 'deliveryDate', label: 'Date', sortable: true }
  ];

  const usersColumns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'localityCode', label: 'Locality', sortable: true }
  ];

  const stockColumns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'transactionType', label: 'Type', sortable: true },
    { key: 'facilityName', label: 'Facility', sortable: true },
    { key: 'quantity', label: 'Quantity', sortable: true },
    { key: 'createdBy', label: 'Created By', sortable: true }
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937' }}>
          🔗 Combined Filter HOCs Demo
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280', marginTop: '8px' }}>
          Demonstrates combining boundary and generic filter HOCs for powerful multi-layered filtering
        </p>
      </div>

      {/* Example 1: Delivery Data with Combined Filters */}
      <div style={{ marginBottom: '50px' }}>
        <div style={{
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e40af', marginBottom: '8px' }}>
            📦 Example 1: Delivery Data - Boundary + Generic Filters
          </h2>
          <p style={{ fontSize: '14px', color: '#1e40af', margin: 0 }}>
            <strong>Filter Order:</strong> Boundary Filters (geographic) → Generic Filters (delivery fields)<br/>
            <strong>Fields:</strong> State, LGA, Ward, Health Facility + Delivered By, Status, Product Name
          </p>
        </div>

        <CombinedFilteredTable
          title="Delivery Records with Combined Filtering"
          data={deliveryData}
          columns={deliveryColumns}
          pagination={true}
          paginationPerPage={10}
          enableExcelDownload={true}
          excelFileName="combined_delivery_data"
        />
      </div>

      {/* Example 2: Users Data with Different Order */}
      <div style={{ marginBottom: '50px' }}>
        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#166534', marginBottom: '8px' }}>
            👥 Example 2: Users Data - Generic + Boundary Filters
          </h2>
          <p style={{ fontSize: '14px', color: '#166534', margin: 0 }}>
            <strong>Filter Order:</strong> Generic Filters (user fields) → Boundary Filters (geographic)<br/>
            <strong>Fields:</strong> Role, Status, Locality Code + State, LGA, Ward
          </p>
        </div>

        <GenericThenBoundaryTable
          title="User Records with Reversed Filter Order"
          data={usersData}
          columns={usersColumns}
          pagination={true}
          paginationPerPage={10}
        />
      </div>

      {/* Example 3: Stock Data with Required Filters */}
      <div style={{ marginBottom: '50px' }}>
        <div style={{
          backgroundColor: '#fef9e7',
          border: '1px solid #fde68a',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#92400e', marginBottom: '8px' }}>
            📊 Example 3: Stock Data - Required Filters
          </h2>
          <p style={{ fontSize: '14px', color: '#92400e', margin: 0 }}>
            <strong>Filter Order:</strong> Boundary Filters (requires State) → Generic Filters (requires Transaction Type)<br/>
            <strong>Required:</strong> State selection + Transaction Type selection for meaningful filtering
          </p>
        </div>

        <StockCombinedTable
          title="Stock Records with Required Filter Validation"
          data={stockData}
          columns={stockColumns}
          pagination={true}
          paginationPerPage={10}
        />
      </div>

      {/* Usage Instructions */}
      <div style={{
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#334155', marginBottom: '16px' }}>
          💡 How to Combine Filter HOCs
        </h3>

        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
            Method 1: Boundary First, then Generic
          </h4>
          <pre style={{
            backgroundColor: '#f1f5f9',
            padding: '12px',
            borderRadius: '4px',
            fontSize: '13px',
            overflow: 'auto'
          }}>
{`// Step 1: Apply boundary filtering
const BoundaryFiltered = withBoundaryFilter(ReusableTableWrapper, {
  // boundary filter options
});

// Step 2: Apply generic filtering
const CombinedFiltered = withGenericFilter(BoundaryFiltered, {
  filterFields: ['deliveredBy', 'status', 'productName']
});`}
          </pre>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
            Method 2: Generic First, then Boundary
          </h4>
          <pre style={{
            backgroundColor: '#f1f5f9',
            padding: '12px',
            borderRadius: '4px',
            fontSize: '13px',
            overflow: 'auto'
          }}>
{`// Step 1: Apply generic filtering
const GenericFiltered = withGenericFilter(ReusableTableWrapper, {
  filterFields: ['role', 'status', 'department']
});

// Step 2: Apply boundary filtering
const CombinedFiltered = withBoundaryFilter(GenericFiltered, {
  // boundary filter options
});`}
          </pre>
        </div>

        <div>
          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
            Key Benefits of Combining HOCs:
          </h4>
          <ul style={{ fontSize: '14px', color: '#64748b', marginLeft: '20px' }}>
            <li><strong>Layered Filtering:</strong> Users can filter by geographic boundaries AND specific field values</li>
            <li><strong>Independent Configuration:</strong> Each HOC can have different styling, persistence, and validation rules</li>
            <li><strong>Composable:</strong> Mix and match HOCs based on your specific requirements</li>
            <li><strong>Maintainable:</strong> Each HOC handles its own concerns, making code easier to maintain</li>
            <li><strong>Flexible Order:</strong> Change the order of HOCs to change the filtering hierarchy</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CombinedFilterExample;