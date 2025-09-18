import React from 'react';
import DeliveryComponent from './DeliveryComponent';
import withDateRangeFilter from './withDateRangeFilter';

// Create the triple-filtered delivery component (Date Range + Boundary + Generic)
const TripleFilteredDeliveryComponent = withDateRangeFilter(DeliveryComponent, {
  showDateFilter: true,
  showPresets: true,
  persistDates: true,
  storageKey: 'deliveryTripleFilterDateRange',
  defaultPreset: 'last30days',
  label: 'Delivery Date Range Filter',
  filterPosition: 'top',
  containerStyle: {
    backgroundColor: '#fff3cd',
    borderBottom: '2px solid #ffc107'
  },
  onDateRangeChange: (startDate, endDate) => {
    console.log('Triple filter date range changed:', { startDate, endDate });
  }
});

/**
 * Demo component showcasing the DeliveryComponent with all three filter layers:
 * 1. Date Range Filter (outermost wrapper - query level)
 * 2. Boundary Filters (geographic/hierarchical)
 * 3. Generic Filters (field-specific)
 */
const DeliveryComponentTripleFilterDemo = () => {
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
          🔧 Triple-Layer Filtered Delivery Component
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#6b7280',
          lineHeight: '1.6'
        }}>
          Delivery Component with all three filtering layers: Date Range + Boundary + Generic Filters
        </p>
      </div>

      {/* Filter Architecture Explanation */}
      <div style={{
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px'
      }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          color: '#1e293b',
          marginBottom: '20px'
        }}>
          🏗️ Triple Filter Architecture
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '20px'
        }}>
          {/* Date Range Filter */}
          <div style={{
            backgroundColor: '#fff3cd',
            border: '2px solid #ffc107',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#856404',
              marginBottom: '12px'
            }}>
              📅 Date Range Filter (Layer 1)
            </h3>
            <p style={{ fontSize: '14px', color: '#856404', marginBottom: '12px' }}>
              Query-level filtering by Data.createdTime:
            </p>
            <ul style={{ fontSize: '13px', color: '#856404', marginLeft: '20px' }}>
              <li>Elasticsearch range query</li>
              <li>Date presets (Last 7/30 days, etc.)</li>
              <li>Custom date selection</li>
              <li>Persisted across sessions</li>
            </ul>
            <div style={{
              marginTop: '12px',
              padding: '8px',
              backgroundColor: '#ffeaa7',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '500'
            }}>
              Level: Query/Data Source
            </div>
          </div>

          {/* Boundary Filters */}
          <div style={{
            backgroundColor: '#f0f9ff',
            border: '2px solid #bae6fd',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#1e40af',
              marginBottom: '12px'
            }}>
              🌍 Boundary Filters (Layer 2)
            </h3>
            <p style={{ fontSize: '14px', color: '#1e40af', marginBottom: '12px' }}>
              Geographic/hierarchical filtering:
            </p>
            <ul style={{ fontSize: '13px', color: '#1e40af', marginLeft: '20px' }}>
              <li>Auto-discovered from boundaryHierarchy</li>
              <li>Dynamic dropdowns</li>
              <li>Smart hiding (single values)</li>
              <li>Geographic cascade</li>
            </ul>
            <div style={{
              marginTop: '12px',
              padding: '8px',
              backgroundColor: '#dbeafe',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '500'
            }}>
              Level: Post-Query Processing
            </div>
          </div>

          {/* Generic Filters */}
          <div style={{
            backgroundColor: '#f0fdf4',
            border: '2px solid #bbf7d0',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#166534',
              marginBottom: '12px'
            }}>
              📋 Generic Filters (Layer 3)
            </h3>
            <p style={{ fontSize: '14px', color: '#166534', marginBottom: '12px' }}>
              Field-specific filtering:
            </p>
            <ul style={{ fontSize: '13px', color: '#166534', marginLeft: '20px' }}>
              <li>deliveredBy, quantity</li>
              <li>deliveryStatus, productName</li>
              <li>Field validation</li>
              <li>Statistics tracking</li>
            </ul>
            <div style={{
              marginTop: '12px',
              padding: '8px',
              backgroundColor: '#dcfce7',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '500'
            }}>
              Level: Final UI Filtering
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
          🔄 Complete Data Flow
        </h3>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '13px',
          color: '#92400e',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{
            padding: '10px',
            backgroundColor: '#fed7aa',
            borderRadius: '6px',
            fontWeight: '600',
            textAlign: 'center',
            minWidth: '120px'
          }}>
            Elasticsearch<br/>
            <small>Date Range Query</small>
          </div>
          <span>→</span>
          <div style={{
            padding: '10px',
            backgroundColor: '#fed7aa',
            borderRadius: '6px',
            textAlign: 'center',
            minWidth: '120px'
          }}>
            Raw Data<br/>
            <small>Date Filtered</small>
          </div>
          <span>→</span>
          <div style={{
            padding: '10px',
            backgroundColor: '#fed7aa',
            borderRadius: '6px',
            textAlign: 'center',
            minWidth: '120px'
          }}>
            Boundary Filter<br/>
            <small>Geographic</small>
          </div>
          <span>→</span>
          <div style={{
            padding: '10px',
            backgroundColor: '#fed7aa',
            borderRadius: '6px',
            textAlign: 'center',
            minWidth: '120px'
          }}>
            Generic Filter<br/>
            <small>Field Values</small>
          </div>
          <span>→</span>
          <div style={{
            padding: '10px',
            backgroundColor: '#fed7aa',
            borderRadius: '6px',
            fontWeight: '600',
            textAlign: 'center',
            minWidth: '120px'
          }}>
            Final Table<br/>
            <small>Triple Filtered</small>
          </div>
        </div>
      </div>

      {/* Filter Priority and Interaction */}
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
          🎯 Filter Interaction & Priority
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px',
          fontSize: '14px',
          color: '#01579b'
        }}>
          <div>
            <strong>📊 Performance Optimization:</strong>
            <ul style={{ marginLeft: '20px', marginTop: '8px', fontSize: '13px' }}>
              <li>Date range reduces dataset at source</li>
              <li>Boundary filters reduce memory usage</li>
              <li>Generic filters provide instant UI response</li>
              <li>All filters work independently</li>
            </ul>
          </div>
          <div>
            <strong>💾 Persistence Strategy:</strong>
            <ul style={{ marginLeft: '20px', marginTop: '8px', fontSize: '13px' }}>
              <li>Date range: deliveryTripleFilterDateRange</li>
              <li>Boundary: deliveryBoundaryFilters</li>
              <li>Generic: deliveryGenericFilters</li>
              <li>Each layer saves/restores independently</li>
            </ul>
          </div>
          <div>
            <strong>🔧 User Experience:</strong>
            <ul style={{ marginLeft: '20px', marginTop: '8px', fontSize: '13px' }}>
              <li>Clear visual separation of filter types</li>
              <li>Independent clear buttons per layer</li>
              <li>Real-time statistics for each filter</li>
              <li>Toggle visibility for advanced users</li>
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
            Live Component with Triple Filtering
          </h2>
          <p style={{ 
            fontSize: '14px', 
            color: '#64748b',
            margin: '4px 0 0 0'
          }}>
            Experience all three filter layers working together in harmony
          </p>
        </div>

        <TripleFilteredDeliveryComponent 
          projectId="demo-project-id"
          boundaryType="state"
          boundaryCode="ONDO"
        />
      </div>

      {/* Implementation Code */}
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
          💻 Triple Filter Implementation
        </h3>
        
        <pre style={{
          backgroundColor: '#f1f5f9',
          padding: '16px',
          borderRadius: '6px',
          fontSize: '13px',
          overflow: 'auto',
          lineHeight: '1.5'
        }}>
{`// Step 1: Create the base table with generic filters
const GenericFilteredTable = withGenericFilter(ReusableTableWrapper, {
  filterFields: ['deliveredBy', 'quantity', 'deliveryStatus', 'productName'],
  storageKey: 'deliveryGenericFilters',
  filterStyle: { backgroundColor: '#f0fdf4' }
});

// Step 2: Add boundary filtering
const BoundaryAndGenericTable = withBoundaryFilter(GenericFilteredTable, {
  storageKey: 'deliveryBoundaryFilters',
  filterStyle: { backgroundColor: '#f0f9ff' }
});

// Step 3: Create DeliveryComponent using the dual-filtered table
const DeliveryComponent = ({ startDate, endDate, dateRange, ...props }) => {
  // Build Elasticsearch query with date range
  const elasticsearchQuery = useMemo(() => {
    const conditions = [];
    
    // Add date range filter to Elasticsearch query
    const actualStartDate = startDate || dateRange?.startDate;
    const actualEndDate = endDate || dateRange?.endDate;
    
    if (actualStartDate || actualEndDate) {
      conditions.push({
        "range": {
          "Data.createdTime": {
            ...(actualStartDate && { "gte": actualStartDate.toISOString() }),
            ...(actualEndDate && { "lte": actualEndDate.toISOString() })
          }
        }
      });
    }
    
    return conditions.length > 0 
      ? { "bool": { "must": conditions } }
      : { "match_all": {} };
  }, [startDate, endDate, dateRange]);
  
  return <BoundaryAndGenericTable data={filteredData} {...props} />;
};

// Step 4: Wrap with date range filter HOC
const TripleFilteredDeliveryComponent = withDateRangeFilter(DeliveryComponent, {
  defaultPreset: 'last30days',
  persistDates: true,
  storageKey: 'deliveryTripleFilterDateRange'
});

// Step 5: Use the triple-filtered component
<TripleFilteredDeliveryComponent 
  projectId="demo-project"
  boundaryType="state"
  boundaryCode="ONDO"
/>`}
        </pre>
      </div>
    </div>
  );
};

export default DeliveryComponentTripleFilterDemo;