import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ReusableTableWrapper from './ReusableTableWrapper';
import withMapView from './withMapView';
import withBoundaryFilter from './withBoundaryFilter';
import withGenericFilter from './withGenericFilter';

/**
 * Example component demonstrating how to use the withMapView HOC
 * Shows both simple usage and composition with other filter HOCs
 */

// Simple usage: Just add map view to a table
const SimpleMapTable = withMapView(ReusableTableWrapper, {
  showMapToggle: true,
  defaultView: 'table',
  mapContainerId: 'simple-map-container',
  
  // Basic coordinate extraction
  getLatitude: (row) => row.latitude || row.lat,
  getLongitude: (row) => row.longitude || row.lng,
  
  // Simple popup content
  getMapPopupContent: (visit, index, originalData) => {
    const data = originalData[visit._originalIndex] || visit;
    return `
      <div style="padding: 12px;">
        <h4>${data.name || `Point ${index + 1}`}</h4>
        <p>Coordinates: ${visit.lat.toFixed(4)}, ${visit.lng.toFixed(4)}</p>
        ${data.description ? `<p>${data.description}</p>` : ''}
      </div>
    `;
  }
});

// Complex usage: Map view with multiple filter HOCs
const ComplexFilteredMapTable = withBoundaryFilter(
  withGenericFilter(
    withMapView(ReusableTableWrapper, {
      showMapToggle: true,
      defaultView: 'table',
      mapContainerId: 'complex-map-container',
      persistViewMode: true,
      storageKey: 'complexMapView',
      
      // Advanced coordinate extraction
      getLatitude: (row) => {
        // Handle multiple coordinate formats
        if (row.geoLocation) {
          return Array.isArray(row.geoLocation) ? row.geoLocation[1] : row.geoLocation.lat;
        }
        return row.latitude || row.lat || row.coordinates?.lat;
      },
      
      getLongitude: (row) => {
        // Handle multiple coordinate formats
        if (row.geoLocation) {
          return Array.isArray(row.geoLocation) ? row.geoLocation[0] : row.geoLocation.lng;
        }
        return row.longitude || row.lng || row.coordinates?.lng;
      },
      
      // Rich popup content with conditional fields
      getMapPopupContent: (visit, index, originalData) => {
        const data = originalData[visit._originalIndex] || visit;
        return `
          <div style="padding: 16px; min-width: 200px; font-family: system-ui;">
            <h4 style="margin: 0 0 8px 0; color: #1f2937;">${data.title || data.name || `Location ${index + 1}`}</h4>
            <div style="font-size: 13px; line-height: 1.5;">
              ${data.category ? `<div><strong>Category:</strong> ${data.category}</div>` : ''}
              ${data.status ? `<div><strong>Status:</strong> ${data.status}</div>` : ''}
              ${data.date ? `<div><strong>Date:</strong> ${new Date(data.date).toLocaleDateString()}</div>` : ''}
              ${data.value ? `<div><strong>Value:</strong> ${data.value}</div>` : ''}
              <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
                <strong>Coordinates:</strong> ${visit.lat.toFixed(4)}, ${visit.lng.toFixed(4)}
              </div>
            </div>
          </div>
        `;
      },
      
      // Custom marker styling based on data
      customMarkerStyle: {
        fill: '#3B82F6',
        stroke: '#fff',
        strokeWidth: 2,
        radius: 6
      }
    }), 
    {
      // Generic filter configuration
      showFilters: true,
      filterFields: ['category', 'status', 'type'],
      storageKey: 'complexGenericFilters'
    }
  ),
  {
    // Boundary filter configuration
    showFilters: true,
    storageKey: 'complexBoundaryFilters'
  }
);

const MapViewHOCExample = () => {
  const { t } = useTranslation();
  
  // Sample data with coordinates for demonstration
  const sampleData = useMemo(() => [
    {
      id: 1,
      name: 'Health Facility A',
      category: 'Health',
      status: 'Active',
      latitude: 7.25,
      longitude: 5.2,
      description: 'Primary health center',
      date: '2024-01-15',
      value: 150,
      boundaryHierarchy: { state: 'Ondo', lga: 'Akure South' }
    },
    {
      id: 2,
      name: 'Distribution Point B',
      category: 'Distribution',
      status: 'Pending',
      latitude: 7.3,
      longitude: 5.25,
      description: 'Net distribution center',
      date: '2024-01-20',
      value: 75,
      boundaryHierarchy: { state: 'Ondo', lga: 'Akure North' }
    },
    {
      id: 3,
      name: 'Storage Facility C',
      category: 'Storage',
      status: 'Inactive',
      latitude: 7.15,
      longitude: 5.15,
      description: 'Medical supplies storage',
      date: '2024-01-10',
      value: 200,
      boundaryHierarchy: { state: 'Ondo', lga: 'Owo' }
    }
  ], []);

  // Column configuration for the table
  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'latitude', label: 'Latitude', sortable: true },
    { key: 'longitude', label: 'Longitude', sortable: true },
    { key: 'value', label: 'Value', sortable: true },
    { key: 'date', label: 'Date', sortable: true }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Map View HOC Examples</h2>
      
      {/* Simple Example */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ marginBottom: '10px' }}>Simple Map View Example</h3>
        <p style={{ marginBottom: '20px', color: '#6b7280' }}>
          Basic map/table toggle with simple popup content
        </p>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
          <SimpleMapTable
            title="Simple Data Visualization"
            data={sampleData}
            columns={columns}
            enableExcelDownload={true}
            excelFileName="simple_map_data"
          />
        </div>
      </div>
      
      {/* Complex Example */}
      <div>
        <h3 style={{ marginBottom: '10px' }}>Complex Example with Filters</h3>
        <p style={{ marginBottom: '20px', color: '#6b7280' }}>
          Map/table toggle combined with boundary and generic filters
        </p>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
          <ComplexFilteredMapTable
            title="Advanced Data Visualization with Filters"
            data={sampleData}
            columns={columns}
            enableExcelDownload={true}
            excelFileName="complex_map_data"
          />
        </div>
      </div>
    </div>
  );
};

export default MapViewHOCExample;