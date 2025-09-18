import React from 'react';
import DeliveryComponent from './DeliveryComponent';

/**
 * Demo component showcasing the enhanced DeliveryComponent 
 * with both boundary and generic filters
 */
const DeliveryComponentWithGenericDemo = () => {
  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          color: '#1f2937',
          marginBottom: '12px'
        }}>
          🚚 Enhanced Delivery Component Demo
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#6b7280',
          lineHeight: '1.6'
        }}>
          Delivery Component now features dual-layer filtering with both boundary and generic filters
        </p>
      </div>

      {/* Filter Structure Explanation */}
      <div style={{
        backgroundColor: '#f0f9ff',
        border: '1px solid #bae6fd',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          color: '#1e40af',
          marginBottom: '16px'
        }}>
          🎯 Dual Filter System Architecture
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr',
          gap: '20px'
        }}>
          {/* Generic Filters */}
          <div style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#166534',
              marginBottom: '12px'
            }}>
              📋 Generic Filters (Top Layer)
            </h3>
            <p style={{ fontSize: '14px', color: '#166534', marginBottom: '12px' }}>
              Field-specific filtering for delivery attributes:
            </p>
            <ul style={{ fontSize: '13px', color: '#166534', marginLeft: '20px' }}>
              <li><strong>deliveredBy</strong> - Filter by who delivered</li>
              <li><strong>quantity</strong> - Filter by quantity amounts</li>
              <li><strong>deliveryStatus</strong> - Filter by delivery status</li>
              <li><strong>productName</strong> - Filter by product name</li>
            </ul>
            <div style={{
              marginTop: '12px',
              padding: '8px',
              backgroundColor: '#dcfce7',
              borderRadius: '4px',
              fontSize: '12px'
            }}>
              <strong>Storage Key:</strong> deliveryGenericFilters
            </div>
          </div>

          {/* Boundary Filters */}
          <div style={{
            backgroundColor: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#1e40af',
              marginBottom: '12px'
            }}>
              🌍 Boundary Filters (Bottom Layer)
            </h3>
            <p style={{ fontSize: '14px', color: '#1e40af', marginBottom: '12px' }}>
              Geographic/hierarchical filtering:
            </p>
            <ul style={{ fontSize: '13px', color: '#1e40af', marginLeft: '20px' }}>
              <li><strong>country</strong> - Filter by country</li>
              <li><strong>state</strong> - Filter by state</li>
              <li><strong>lga</strong> - Filter by Local Government Area</li>
              <li><strong>ward</strong> - Filter by ward</li>
              <li><strong>healthFacility</strong> - Filter by health facility</li>
            </ul>
            <div style={{
              marginTop: '12px',
              padding: '8px',
              backgroundColor: '#dbeafe',
              borderRadius: '4px',
              fontSize: '12px'
            }}>
              <strong>Storage Key:</strong> deliveryBoundaryFilters
            </div>
          </div>
        </div>
      </div>

      {/* Data Flow Visualization */}
      <div style={{
        backgroundColor: '#fef3c7',
        border: '1px solid #f59e0b',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h3 style={{ 
          fontSize: '16px', 
          fontWeight: '600', 
          color: '#92400e',
          marginBottom: '12px'
        }}>
          🔄 Data Flow & Filtering Order
        </h3>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '14px',
          color: '#92400e'
        }}>
          <div style={{
            padding: '12px',
            backgroundColor: '#fed7aa',
            borderRadius: '6px',
            fontWeight: '600'
          }}>
            Original Data
          </div>
          <span>→</span>
          <div style={{
            padding: '12px',
            backgroundColor: '#fed7aa',
            borderRadius: '6px'
          }}>
            Boundary Filter
          </div>
          <span>→</span>
          <div style={{
            padding: '12px',
            backgroundColor: '#fed7aa',
            borderRadius: '6px'
          }}>
            Generic Filter
          </div>
          <span>→</span>
          <div style={{
            padding: '12px',
            backgroundColor: '#fed7aa',
            borderRadius: '6px',
            fontWeight: '600'
          }}>
            Filtered Table
          </div>
        </div>
        <p style={{ fontSize: '13px', marginTop: '12px', color: '#92400e' }}>
          <strong>Note:</strong> Both filter sets work independently but cumulatively. 
          Selecting filters in both layers will apply both conditions to the data.
        </p>
      </div>

      {/* Expected Behavior */}
      <div style={{
        backgroundColor: '#e0f2fe',
        border: '1px solid #0288d1',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '30px'
      }}>
        <h3 style={{ 
          fontSize: '16px', 
          fontWeight: '600', 
          color: '#01579b',
          marginBottom: '12px'
        }}>
          ✨ Enhanced Features
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '12px',
          fontSize: '13px',
          color: '#01579b'
        }}>
          <div>
            <strong>🎛️ Dual Filter Sets:</strong>
            <ul style={{ marginLeft: '20px', marginTop: '4px' }}>
              <li>Generic filters for operational data</li>
              <li>Boundary filters for geographic data</li>
            </ul>
          </div>
          <div>
            <strong>💾 Independent Persistence:</strong>
            <ul style={{ marginLeft: '20px', marginTop: '4px' }}>
              <li>Generic filters saved separately</li>
              <li>Boundary filters saved separately</li>
            </ul>
          </div>
          <div>
            <strong>📊 Dual Statistics:</strong>
            <ul style={{ marginLeft: '20px', marginTop: '4px' }}>
              <li>Generic filter stats bar</li>
              <li>Boundary filter stats bar</li>
            </ul>
          </div>
          <div>
            <strong>🎨 Visual Distinction:</strong>
            <ul style={{ marginLeft: '20px', marginTop: '4px' }}>
              <li>Green theme for generic filters</li>
              <li>Blue theme for boundary filters</li>
            </ul>
          </div>
        </div>
      </div>

      {/* The Enhanced Delivery Component */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '2px solid #e5e7eb',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <div style={{
          backgroundColor: '#f8fafc',
          padding: '16px 24px',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            color: '#1e293b',
            margin: '0'
          }}>
            Live Component with Dual Filtering
          </h2>
          <p style={{ 
            fontSize: '14px', 
            color: '#64748b',
            margin: '4px 0 0 0'
          }}>
            Try using both filter sets to see how they work together
          </p>
        </div>

        <DeliveryComponent 
          projectId="demo-project-id"
          boundaryType="state"
          boundaryCode="ONDO"
        />
      </div>

      {/* Code Implementation */}
      <div style={{
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '20px',
        marginTop: '30px'
      }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#334155',
          marginBottom: '16px'
        }}>
          💻 Implementation Code
        </h3>
        
        <pre style={{
          backgroundColor: '#f1f5f9',
          padding: '16px',
          borderRadius: '6px',
          fontSize: '13px',
          overflow: 'auto',
          lineHeight: '1.5'
        }}>
{`// Step 1: Create boundary filtered table
const BoundaryFilteredTable = withBoundaryFilter(ReusableTableWrapper, {
  showFilters: true,
  showStats: true,
  storageKey: 'deliveryBoundaryFilters',
  customLabels: {
    state: 'State',
    lga: 'Local Government Area',
    ward: 'Ward',
    healthFacility: 'Health Facility'
  },
  filterStyle: {
    backgroundColor: '#f0f9ff',
    border: '1px solid #bae6fd'
  }
});

// Step 2: Add generic filters for delivery fields
const FullFeaturedFilteredTable = withGenericFilter(BoundaryFilteredTable, {
  showFilters: true,
  showStats: true,
  storageKey: 'deliveryGenericFilters',
  filterFields: ['deliveredBy', 'quantity', 'deliveryStatus', 'productName'],
  customLabels: {
    deliveredBy: 'Delivered By',
    quantity: 'Quantity',
    deliveryStatus: 'Delivery Status',
    productName: 'Product Name'
  },
  filterStyle: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0'
  }
});

// Step 3: Use the enhanced table
<FullFeaturedFilteredTable 
  data={tableData}
  columns={columns}
  pagination={true}
  enableExcelDownload={true}
/>`}
        </pre>

        <div style={{ 
          marginTop: '16px', 
          padding: '12px',
          backgroundColor: '#fffbeb',
          border: '1px solid #fed7aa',
          borderRadius: '6px',
          fontSize: '13px',
          color: '#92400e'
        }}>
          <strong>💡 Pro Tip:</strong> The filter fields <code>['deliveredBy', 'quantity', 'deliveryStatus', 'productName']</code> 
          are automatically scanned for unique values. Only fields with multiple unique values will show as dropdowns. 
          This keeps the UI clean and relevant!
        </div>
      </div>

      {/* Usage Tips */}
      <div style={{
        backgroundColor: '#f1f5f9',
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        padding: '20px',
        marginTop: '20px'
      }}>
        <h3 style={{ 
          fontSize: '16px', 
          fontWeight: '600', 
          color: '#334155',
          marginBottom: '12px'
        }}>
          📝 Usage Tips
        </h3>
        <ul style={{ fontSize: '14px', color: '#64748b', marginLeft: '20px' }}>
          <li><strong>Filter Order Matters:</strong> Boundary filters are applied first, then generic filters on the boundary-filtered data</li>
          <li><strong>Independent Clear Buttons:</strong> Each filter set has its own "Clear All" button</li>
          <li><strong>Persistent Filters:</strong> Your selections are saved and restored when you return</li>
          <li><strong>Excel Export:</strong> Downloads include only the filtered data from both filter layers</li>
          <li><strong>Dynamic Columns:</strong> Boundary columns are dynamically added based on discovered fields</li>
          <li><strong>Smart Hiding:</strong> Fields with only one value won't show as filter dropdowns</li>
        </ul>
      </div>
    </div>
  );
};

export default DeliveryComponentWithGenericDemo;