import React, { useState, useMemo, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@egovernments/digit-ui-components';
import MapViewSafe from './MapViewSafe';

/**
 * Higher-Order Component that wraps a table component with map view toggle functionality
 * Provides map/table view switching with data transformation for map visualization
 * 
 * @param {React.Component} WrappedComponent - Component to wrap with map view functionality
 * @param {Object} options - Configuration options for the HOC
 */
const withMapView = (WrappedComponent, options = {}) => {
  const {
    // Map configuration
    showMapToggle = true,
    defaultView = 'table', // 'table' or 'map'
    mapContainerId = 'data-map-container',
    
    // Data mapping functions
    getLatitude = null, // Function to extract latitude from data row
    getLongitude = null, // Function to extract longitude from data row
    getMapPopupContent = null, // Function to generate popup content for map markers
    
    // Map styling
    customMarkerStyle = {
      fill: '#F47738',
      stroke: '#fff',
      strokeWidth: 2,
      radius: 7
    },
    
    // Boundary/shapefile support
    getBoundaryData = null, // Function to get boundary/shapefile data
    boundaryStyle = {
      color: '#3388ff',
      weight: 2,
      opacity: 0.8,
      fillColor: '#3388ff',
      fillOpacity: 0.1
    },
    
    // Map features
    showConnectingLines = false,
    showBaseLayer = true,
    
    // Storage and persistence
    persistViewMode = true,
    storageKey = 'mapViewMode',
    
    // Callbacks
    onViewModeChange = null
  } = options;

  return function MapViewWrapper(props) {
    const { t } = useTranslation();
    const { data = [], ...restProps } = props;
    
    // Initialize view mode from storage or default
    const [viewMode, setViewMode] = useState(() => {
      if (persistViewMode && typeof window !== 'undefined') {
        const saved = localStorage.getItem(storageKey);
        if (saved && ['table', 'map'].includes(saved)) {
          return saved;
        }
      }
      return defaultView;
    });

    // Transform data for map visualization
    const mapData = useMemo(() => {
      if (!data || data.length === 0) return [];
      
      return data.map((row, index) => {
        let lat, lng;
        
        // Extract coordinates using provided functions or default logic
        if (getLatitude && getLongitude) {
          lat = getLatitude(row);
          lng = getLongitude(row);
        } else {
          // Default coordinate extraction logic
          // Try common field names
          lat = row.latitude || row.lat || row.geoPoint?.[1] || row.geoPoint?.lat;
          lng = row.longitude || row.lng || row.lon || row.geoPoint?.[0] || row.geoPoint?.lng;
        }
        
        // Skip rows without valid coordinates
        if (typeof lat !== 'number' || typeof lng !== 'number') {
          return null;
        }
        
        return {
          id: row.id || index,
          lat: lat,
          lng: lng,
          // Include all original data for popup content
          ...row,
          // Add index for reference
          _originalIndex: index
        };
      }).filter(Boolean); // Remove null entries
    }, [data, getLatitude, getLongitude]);

    // Get boundary data if function provided
    const boundaryData = useMemo(() => {
      if (getBoundaryData) {
        return getBoundaryData(data, props);
      }
      return null;
    }, [data, props, getBoundaryData]);

    // Custom popup content function
    const customPopupContent = useMemo(() => {
      if (getMapPopupContent) {
        return (visit, index) => getMapPopupContent(visit, index, data);
      }
      
      // Default popup content
      return (visit, index) => {
        const originalData = data[visit._originalIndex] || visit;
        
        return `
          <div style="padding: 12px; min-width: 200px; font-family: 'Inter', sans-serif;">
            <h4 style="margin: 0 0 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">
              📍 Data Point #${visit.id || index + 1}
            </h4>
            <div style="font-size: 13px; line-height: 1.5; color: #374151;">
              ${originalData.name ? `<div><strong>Name:</strong> ${originalData.name}</div>` : ''}
              ${originalData.deliveredBy ? `<div><strong>Delivered By:</strong> ${originalData.deliveredBy}</div>` : ''}
              ${originalData.quantity ? `<div><strong>Quantity:</strong> ${originalData.quantity.toLocaleString()}</div>` : ''}
              ${originalData.deliveryStatus ? `<div><strong>Status:</strong> ${originalData.deliveryStatus}</div>` : ''}
              ${originalData.deliveryDate ? `<div><strong>Date:</strong> ${originalData.deliveryDate}</div>` : ''}
              ${originalData.productName ? `<div><strong>Product:</strong> ${originalData.productName}</div>` : ''}
              <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
                <strong>Location:</strong> ${visit.lat.toFixed(4)}, ${visit.lng.toFixed(4)}
              </div>
            </div>
          </div>
        `;
      };
    }, [getMapPopupContent, data]);

    // Handle view mode changes
    const handleViewModeChange = (newMode) => {
      setViewMode(newMode);
      
      // Persist to localStorage if enabled
      if (persistViewMode && typeof window !== 'undefined') {
        localStorage.setItem(storageKey, newMode);
      }
      
      // Call external handler if provided
      if (onViewModeChange) {
        onViewModeChange(newMode, data);
      }
    };

    // Data summary for display
    const dataSummary = useMemo(() => {
      const totalRecords = data.length;
      const mappableRecords = mapData.length;
      const mappablePercentage = totalRecords > 0 ? ((mappableRecords / totalRecords) * 100).toFixed(1) : 0;
      
      return {
        totalRecords,
        mappableRecords,
        mappablePercentage,
        hasValidCoordinates: mappableRecords > 0
      };
    }, [data, mapData]);

    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {showMapToggle && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 20px',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#f8f9fa'
          }}>
            <div>
              <h4 style={{ 
                margin: 0, 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#374151' 
              }}>
                Data Visualization ({dataSummary.totalRecords.toLocaleString()} records)
              </h4>
              <div style={{ 
                fontSize: '13px', 
                color: '#6b7280', 
                marginTop: '2px' 
              }}>
                {viewMode === 'table' ? (
                  'Tabular view with filtering and sorting'
                ) : (
                  `Map view • ${dataSummary.mappableRecords.toLocaleString()} mappable (${dataSummary.mappablePercentage}%)`
                )}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* Data summary badge */}
              {dataSummary.mappableRecords > 0 && (
                <div style={{
                  padding: '4px 8px',
                  backgroundColor: '#ecfdf5',
                  color: '#059669',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  📍 {dataSummary.mappableRecords.toLocaleString()} with coordinates
                </div>
              )}
              
              {/* View toggle buttons */}
              <Button
                type="button"
                variation={viewMode === 'table' ? 'primary' : 'secondary'}
                label="📊 Table"
                onClick={() => handleViewModeChange('table')}
                style={{
                  minWidth: '90px',
                  fontSize: '14px'
                }}
              />
              
              <Button
                type="button"
                variation={viewMode === 'map' ? 'primary' : 'secondary'}
                label="🗺️ Map"
                onClick={() => handleViewModeChange('map')}
                isDisabled={!dataSummary.hasValidCoordinates}
                style={{
                  minWidth: '90px',
                  fontSize: '14px',
                  opacity: dataSummary.hasValidCoordinates ? 1 : 0.6
                }}
                title={!dataSummary.hasValidCoordinates ? 'No valid coordinates found in data' : 'Switch to map view'}
              />
            </div>
          </div>
        )}
        
        {/* Content area */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {viewMode === 'table' ? (
            // Table view - render the wrapped component
            <WrappedComponent 
              {...restProps} 
              data={data}
              // Add map view context to props
              mapViewContext={{
                hasValidCoordinates: dataSummary.hasValidCoordinates,
                mappableRecords: dataSummary.mappableRecords,
                totalRecords: dataSummary.totalRecords,
                switchToMap: () => handleViewModeChange('map')
              }}
            />
          ) : (
            // Map view
            <div style={{ height: '100%', position: 'relative' }}>
              {dataSummary.hasValidCoordinates ? (
                <MapViewSafe
                  visits={mapData}
                  shapefileData={boundaryData}
                  boundaryStyle={boundaryStyle}
                  showConnectingLines={showConnectingLines}
                  customPopupContent={customPopupContent}
                  customMarkerStyle={customMarkerStyle}
                  mapContainerId={mapContainerId}
                  showBaseLayer={showBaseLayer}
                />
              ) : (
                // No coordinates available
                <div style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f9fafb',
                  color: '#6b7280',
                  padding: '40px'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
                  <h3 style={{ 
                    margin: '0 0 8px 0', 
                    fontSize: '18px', 
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    No Mappable Data
                  </h3>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '14px', 
                    textAlign: 'center',
                    lineHeight: '1.5',
                    maxWidth: '400px'
                  }}>
                    The current dataset doesn't contain valid coordinate data (latitude/longitude) required for map visualization.
                  </p>
                  <Button
                    type="button"
                    variation="primary"
                    label="📊 View as Table"
                    onClick={() => handleViewModeChange('table')}
                    style={{
                      marginTop: '16px'
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };
};

/**
 * Hook version of withMapView for functional components
 * Provides map view state management without the HOC wrapper
 */
export const useMapView = (data = [], options = {}) => {
  const { defaultView = 'table', persistViewMode = true, storageKey = 'mapViewMode' } = options;
  
  const [viewMode, setViewMode] = useState(() => {
    if (persistViewMode && typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      if (saved && ['table', 'map'].includes(saved)) {
        return saved;
      }
    }
    return defaultView;
  });

  const updateViewMode = (newMode) => {
    setViewMode(newMode);
    if (persistViewMode && typeof window !== 'undefined') {
      localStorage.setItem(storageKey, newMode);
    }
  };

  const dataSummary = useMemo(() => {
    const totalRecords = data.length;
    const mappableRecords = data.filter(row => {
      const lat = row.latitude || row.lat || row.geoPoint?.[1] || row.geoPoint?.lat;
      const lng = row.longitude || row.lng || row.lon || row.geoPoint?.[0] || row.geoPoint?.lng;
      return typeof lat === 'number' && typeof lng === 'number';
    }).length;
    
    return {
      totalRecords,
      mappableRecords,
      mappablePercentage: totalRecords > 0 ? ((mappableRecords / totalRecords) * 100).toFixed(1) : 0,
      hasValidCoordinates: mappableRecords > 0
    };
  }, [data]);

  return {
    viewMode,
    updateViewMode,
    dataSummary,
    isMapView: viewMode === 'map',
    isTableView: viewMode === 'table'
  };
};

export default withMapView;