import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { createVisitPopup } from "./MapPointsPopup";

// Override Leaflet's default icon to prevent 404 errors
if (typeof L !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNCA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRhdGggZD0iTTEyIDJDMjAuNTQ5IDIgMjcgOC40NTEgMjcgMTdDMjcgMzEuNSAxMiA0MSAxMiA0MUMxMiA0MSAtMyAzMS41IC0zIDE3Qy0zIDguNDUxIDMuNTUxIDIgMTIgMloiIGZpbGw9IiNGNDc3MzgiLz4KPGRhdGggZD0iTTEyIDExQzE0LjIwOTEgMTEgMTYgMTIuNzkwOSAxNiAxNUMxNiAxNy4yMDkxIDE0LjIwOTEgMTkgMTIgMTlDOS43OTA5IDE5IDggMTcuMjA5MSA4IDE1QzggMTIuNzkwOSA5Ljc5MDkgMTEgMTIgMTFaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNCA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRhdGggZD0iTTEyIDJDMjAuNTQ5IDIgMjcgOC40NTEgMjcgMTdDMjcgMzEuNSAxMiA0MSAxMiA0MUMxMiA0MSAtMyAzMS41IC0zIDE3Qy0zIDguNDUxIDMuNTUxIDIgMTIgMloiIGZpbGw9IiNGNDc3MzgiLz4KPGRhdGggZD0iTTEyIDExQzE0LjIwOTEgMTEgMTYgMTIuNzkwOSAxNiAxNUMxNiAxNy4yMDkxIDE0LjIwOTEgMTkgMTIgMTlDOS43OTA5IDE5IDggMTcuMjA5MSA4IDE1QzggMTIuNzkwOSA5Ljc5MDkgMTEgMTIgMTFaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
    shadowUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDEiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCA0MSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAuNSIgY3k9IjIwLjUiIHI9IjE4LjUiIGZpbGw9ImJsYWNrIiBvcGFjaXR5PSIwLjIiLz4KPC9zdmc+Cg=='
  });
}

const isValidCoord = (v) => v && typeof v.lat === "number" && typeof v.lng === "number";

// Dynamic clustering based on viewport and zoom level
const createViewportAwareClusters = (markers, map) => {
  if (!map || markers.length <= 100) {
    return markers.map(m => [m]);
  }
  
  const zoom = map.getZoom();
  const bounds = map.getBounds();
  
  // Filter markers to only those visible in current viewport
  const visibleMarkers = markers.filter(marker => {
    return bounds.contains([marker.lat, marker.lng]);
  });
  
  // If viewport has <= 100 visible markers, show all individually
  if (visibleMarkers.length <= 100) {
    return markers.map(m => [m]);
  }
  
  // Dynamic cluster radius based on zoom level
  // Higher zoom = smaller cluster radius (more individual points)
  // Lower zoom = larger cluster radius (more clustering)
  let clusterRadius;
  if (zoom >= 15) clusterRadius = 0.0001;      // Very tight clustering at high zoom
  else if (zoom >= 12) clusterRadius = 0.001;  // Tight clustering
  else if (zoom >= 10) clusterRadius = 0.005;  // Medium clustering  
  else if (zoom >= 8) clusterRadius = 0.01;    // Loose clustering
  else clusterRadius = 0.05;                   // Very loose clustering at low zoom
  
  const clusters = [];
  const processed = new Set();
  
  markers.forEach((marker, i) => {
    if (processed.has(i)) return;
    
    const cluster = [marker];
    processed.add(i);
    
    // Find nearby markers within cluster radius
    markers.forEach((other, j) => {
      if (i === j || processed.has(j)) return;
      
      const distance = Math.abs(marker.lat - other.lat) + Math.abs(marker.lng - other.lng);
      if (distance < clusterRadius) {
        cluster.push(other);
        processed.add(j);
      }
    });
    
    clusters.push(cluster);
  });
  
  return clusters;
};

const MapViewSafe = ({ 
  visits = [], 
  shapefileData = null, 
  boundaryStyle = {}, 
  showConnectingLines = false, 
  customPopupContent = null, 
  customMarkerStyle = null, 
  mapContainerId = "map", 
  showBaseLayer = true 
}) => {
  const mapRef = useRef(null);
  const markersRef = useRef(null);
  const boundaryLayerRef = useRef(null);
  const initializationRef = useRef(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'map'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  // Filters are now handled at parent level (BoundariesMapWrapper)

  useEffect(() => {
    // Only initialize map when in map view mode
    if (viewMode !== 'map') return;
    
    // Prevent multiple initializations
    if (initializationRef.current) return;
    
    const initMap = () => {
      try {
        const container = document.getElementById(mapContainerId);
        if (!container) {
          console.error(`Container ${mapContainerId} not found`);
          return;
        }

        // Clean up existing map
        if (container._leaflet_id) {
          const existingMap = L.DomUtil.get(mapContainerId);
          if (existingMap && existingMap._leaflet) {
            existingMap._leaflet.remove();
          }
        }

        initializationRef.current = true;

        // Create map with minimal options for safety
        mapRef.current = L.map(mapContainerId, {
          center: [7.25, 5.2], // Ondo State center
          zoom: 8,
          zoomControl: true,
          attributionControl: showBaseLayer,
          // Keep essential zoom but disable problematic features
          scrollWheelZoom: 'center', // Use center-based zoom instead of mouse position
          doubleClickZoom: 'center',
          touchZoom: 'center',
          boxZoom: false,
          keyboard: false,
          zoomAnimation: false,
          fadeAnimation: false,
          markerZoomAnimation: false
        });

        console.log('✅ Map initialized safely');

        // Add base layer if requested
        if (showBaseLayer) {
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; OpenStreetMap',
            maxZoom: 18
          }).addTo(mapRef.current);
        } else {
          container.style.backgroundColor = '#f8f9fa';
        }

        // Create layer groups
        markersRef.current = L.layerGroup().addTo(mapRef.current);
        boundaryLayerRef.current = L.layerGroup().addTo(mapRef.current);

        // Handle boundaries
        if (shapefileData && boundaryLayerRef.current) {
          try {
            const geoJsonLayer = L.geoJSON(shapefileData, {
              style: {
                color: boundaryStyle.color || '#3388ff',
                weight: boundaryStyle.weight || 2,
                opacity: boundaryStyle.opacity || 0.8,
                fillColor: boundaryStyle.fillColor || '#3388ff',
                fillOpacity: boundaryStyle.fillOpacity || 0.1
              },
              onEachFeature: function(feature, layer) {
                if (feature.properties && boundaryStyle.showPopup !== false) {
                  const popupContent = `<div style="padding: 10px;"><strong>${feature.properties.wardname || feature.properties.name || 'Boundary'}</strong></div>`;
                  layer.bindPopup(popupContent);
                }
              }
            });
            geoJsonLayer.addTo(boundaryLayerRef.current);
          } catch (err) {
            console.error("Boundary rendering failed:", err);
          }
        }

        // Function to render markers with dynamic clustering
        const renderMarkers = () => {
          if (!markersRef.current || !mapRef.current) return;
          
          // Clear existing markers
          markersRef.current.clearLayers();
          
          const validVisits = visits.filter(isValidCoord);
          if (validVisits.length === 0) return;
          
          // Use viewport-aware clustering
          const clusters = createViewportAwareClusters(validVisits, mapRef.current);
          
          clusters.forEach(cluster => {
            if (cluster.length === 1) {
              // Single marker
              const v = cluster[0];
              const popupContent = customPopupContent ? customPopupContent(v, 0) : createVisitPopup(v, 0);
              
              L.circleMarker([v.lat, v.lng], {
                radius: 6,
                fillColor: customMarkerStyle?.fill || '#F47738',
                fillOpacity: 0.8,
                weight: 2,
                color: '#fff'
              })
              .bindPopup(popupContent)
              .addTo(markersRef.current);
            } else {
              // Cluster marker
              const centerLat = cluster.reduce((sum, m) => sum + m.lat, 0) / cluster.length;
              const centerLng = cluster.reduce((sum, m) => sum + m.lng, 0) / cluster.length;
              
              // Dynamic cluster icon size based on cluster size
              const clusterSize = Math.min(50, Math.max(25, 20 + Math.log(cluster.length) * 5));
              
              const clusterIcon = L.divIcon({
                className: 'cluster-marker',
                html: `<div style="
                  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
                  color: white;
                  border-radius: 50%;
                  width: ${clusterSize}px;
                  height: ${clusterSize}px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: bold;
                  font-size: ${Math.max(10, clusterSize * 0.3)}px;
                  border: 2px solid white;
                  box-shadow: 0 3px 6px rgba(0,0,0,0.3);
                  cursor: pointer;
                ">${cluster.length}</div>`,
                iconSize: [clusterSize, clusterSize]
              });
              
              const clusterMarker = L.marker([centerLat, centerLng], { icon: clusterIcon })
                .bindPopup(`<div style="padding: 10px;"><strong>${cluster.length} items clustered</strong><br/>Zoom in to see individual points</div>`)
                .addTo(markersRef.current);
              
              // Add click handler to zoom into cluster
              clusterMarker.on('click', () => {
                const group = new L.featureGroup(cluster.map(item => 
                  L.circleMarker([item.lat, item.lng])
                ));
                mapRef.current.fitBounds(group.getBounds().pad(0.1));
              });
            }
          });
        };
        
        // Initial marker rendering
        renderMarkers();
        
        // Add event listeners for dynamic clustering on zoom/pan
        let updateTimeout;
        const handleViewChange = () => {
          // Debounce updates to avoid excessive re-rendering
          clearTimeout(updateTimeout);
          updateTimeout = setTimeout(() => {
            renderMarkers();
          }, 300);
        };
        
        mapRef.current.on('zoomend', handleViewChange);
        mapRef.current.on('moveend', handleViewChange);
        
        // Add connecting lines if requested (only for small datasets)
        const validVisits = visits.filter(isValidCoord);
        if (showConnectingLines && validVisits.length > 1 && validVisits.length < 100) {
          const positions = validVisits.map(v => [v.lat, v.lng]);
          L.polyline(positions, { color: "blue", weight: 2 }).addTo(markersRef.current);
        }

        // Safely invalidate size
        setTimeout(() => {
          if (mapRef.current && mapRef.current.invalidateSize) {
            mapRef.current.invalidateSize();
          }
        }, 100);

      } catch (error) {
        console.error('Map initialization failed:', error);
        initializationRef.current = false;
      }
    };

    // Initialize with delay
    setTimeout(initMap, 100);

    // Cleanup
    return () => {
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch (error) {
          console.warn('Cleanup error:', error);
        }
        mapRef.current = null;
      }
      initializationRef.current = false;
    };

  }, [viewMode, visits, shapefileData, boundaryStyle, showConnectingLines, customPopupContent, customMarkerStyle, mapContainerId, showBaseLayer]);

  // Table view functions
  const validVisits = visits.filter(isValidCoord);
  
  // Excel download function
  const downloadAsExcel = () => {
    try {
      // Create CSV content (Excel can open CSV files)
      const headers = columns.join(',');
      const csvData = filteredData.map(row => 
        columns.map(col => {
          const value = formatValue(row[col], col);
          // Escape quotes and wrap in quotes if contains comma
          return value.includes(',') || value.includes('"') ? `"${value.replace(/"/g, '""')}"` : value;
        }).join(',')
      ).join('\n');
      
      const csvContent = headers + '\n' + csvData;
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `data_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('✅ Excel file downloaded successfully');
    } catch (error) {
      console.error('❌ Excel download failed:', error);
      alert('Download failed. Please try again.');
    }
  };
  
  // Create table data - if no visits but we have boundary data, show boundary features
  const tableData = validVisits.length === 0 && shapefileData && shapefileData.features 
    ? shapefileData.features.map((feature, index) => {
        const props = feature.properties || {};
        return {
          id: index + 1,
          name: props.wardname || props.lganame || props.name || `Feature ${index + 1}`,
          type: 'boundary',
          ...props,
          // Standardize field names
          wardname: props.wardname || props.WARDNAME || props.ward_name,
          lganame: props.lganame || props.LGANAME || props.lga_name,
          statename: props.statename || props.STATENAME || props.state_name
        };
      })
    : validVisits;
  
  // Filtering is now handled at parent level - use visits data directly
  const filteredData = tableData;
  
  // Get unique values for filter dropdowns
  const getUniqueValues = (columnName) => {
    let uniqueValues = [];
    
    // Get values from visits data
    if (validVisits.length > 0) {
      const visitValues = validVisits.map(row => formatValue(row[columnName], columnName))
        .filter(value => value && value !== 'N/A');
      uniqueValues = [...uniqueValues, ...visitValues];
    }
    
    // Get values from boundary/shapefile data properties
    if (shapefileData && shapefileData.features) {
      const boundaryValues = shapefileData.features
        .map(feature => {
          const props = feature.properties || {};
          // Try different property name variations
          const possibleKeys = [
            columnName,
            columnName.toLowerCase(),
            columnName.toUpperCase(),
            columnName === 'lga' ? 'lganame' : columnName,
            columnName === 'ward' ? 'wardname' : columnName,
            columnName === 'name' ? 'wardname' : columnName,
            columnName === 'name' ? 'lganame' : columnName,
            columnName === 'status' ? 'status' : columnName,
            columnName === 'type' ? 'type' : columnName
          ];
          
          for (const key of possibleKeys) {
            if (props[key]) {
              return formatValue(props[key], columnName);
            }
          }
          return null;
        })
        .filter(value => value && value !== 'N/A');
      
      uniqueValues = [...uniqueValues, ...boundaryValues];
    }
    
    // Remove duplicates and sort
    const deduped = [...new Set(uniqueValues)].sort();
    return deduped.slice(0, 50); // Limit to 50 options for performance
  };
  
  // Sort filtered data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const formatValue = (value, key) => {
    if (value === null || value === undefined) return 'N/A';
    
    if (key === 'lat' || key === 'lng') {
      return typeof value === 'number' ? value.toFixed(6) : value;
    }
    
    if (key === 'time' || key.includes('date') || key.includes('Date')) {
      try {
        return new Date(value).toLocaleDateString() + ' ' + new Date(value).toLocaleTimeString();
      } catch (e) {
        return value;
      }
    }
    
    return String(value);
  };
  
  // Get table columns from first item of tableData
  const getTableColumns = () => {
    if (tableData.length === 0) return [];
    
    const firstItem = tableData[0];
    const priorityColumns = ['id', 'name', 'wardname', 'lganame', 'statename', 'lat', 'lng', 'time', 'status', 'type'];
    const allColumns = Object.keys(firstItem);
    
    // Sort columns with priority first
    return [...priorityColumns.filter(col => allColumns.includes(col)),
            ...allColumns.filter(col => !priorityColumns.includes(col))];
  };
  
  const columns = getTableColumns();
  
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fff" }}>
      {/* Header with view toggle */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        borderBottom: '1px solid #e5e7eb',
        background: '#f8f9fa'
      }}>
        <div>
          <h3 style={{ margin: 0, color: '#374151', fontSize: '18px' }}>
            Data View ({tableData.length.toLocaleString()} records)
          </h3>
          <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
            {viewMode === 'table' ? 'Table view with sorting, filtering, and Excel export' : 'Interactive map with clustering'}
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setViewMode('table')}
            style={{
              padding: '8px 16px',
              border: viewMode === 'table' ? '2px solid #3b82f6' : '1px solid #d1d5db',
              borderRadius: '6px',
              background: viewMode === 'table' ? '#eff6ff' : '#fff',
              color: viewMode === 'table' ? '#1d4ed8' : '#374151',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: viewMode === 'table' ? '600' : '400',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            📊 Table View
          </button>
          <button
            onClick={() => setViewMode('map')}
            style={{
              padding: '8px 16px',
              border: viewMode === 'map' ? '2px solid #10b981' : '1px solid #d1d5db',
              borderRadius: '6px',
              background: viewMode === 'map' ? '#ecfdf5' : '#fff',
              color: viewMode === 'map' ? '#047857' : '#374151',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: viewMode === 'map' ? '600' : '400',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            🗺️ Map View
          </button>
        </div>
      </div>
      
      {/* Content area */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {viewMode === 'table' ? (
          /* Table View */
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Filters are now handled at parent level (BoundariesMapWrapper) */}
            <div style={{
              padding: '12px 20px',
              borderBottom: '1px solid #e5e7eb',
              background: '#e3f2fd'
            }}>
              <div style={{ 
                fontSize: '14px',
                color: '#1976d2',
                fontStyle: 'italic',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                📊 Data filtered at parent level - showing {tableData.length.toLocaleString()} records
              </div>
            </div>
            
            {/* Table controls */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 20px',
              borderBottom: '1px solid #e5e7eb',
              background: '#fafafa'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '14px', color: '#374151' }}>Show:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>entries</span>
                
                {/* Excel Download Button */}
                <button
                  onClick={downloadAsExcel}
                  style={{
                    marginLeft: '16px',
                    padding: '6px 12px',
                    border: '1px solid #059669',
                    borderRadius: '4px',
                    background: '#ecfdf5',
                    color: '#059669',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  title="Download filtered data as Excel file"
                >
                  📊 Download Excel
                </button>
              </div>
              
              <div style={{ fontSize: '14px', color: '#374151' }}>
                Showing {startIndex + 1} to {Math.min(startIndex + pageSize, sortedData.length)} of {sortedData.length} entries
              </div>
            </div>
            
            {/* Table */}
            <div style={{ flex: 1, overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#f3f4f6', position: 'sticky', top: 0, zIndex: 10 }}>
                    {columns.map(column => (
                      <th
                        key={column}
                        onClick={() => handleSort(column)}
                        style={{
                          padding: '12px 16px',
                          textAlign: 'left',
                          borderBottom: '2px solid #e5e7eb',
                          cursor: 'pointer',
                          userSelect: 'none',
                          position: 'relative',
                          fontWeight: '600',
                          color: '#374151',
                          fontSize: '13px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        {column}
                        {sortField === column && (
                          <span style={{ marginLeft: '4px', fontSize: '12px' }}>
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((row, index) => (
                    <tr
                      key={index}
                      style={{
                        borderBottom: '1px solid #e5e7eb',
                        ':hover': { background: '#f9fafb' }
                      }}
                      onMouseEnter={(e) => e.target.parentElement.style.background = '#f9fafb'}
                      onMouseLeave={(e) => e.target.parentElement.style.background = 'transparent'}
                    >
                      {columns.map(column => (
                        <td
                          key={column}
                          style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid #f3f4f6',
                            color: '#374151',
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                          title={formatValue(row[column], column)}
                        >
                          {formatValue(row[column], column)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {paginatedData.length === 0 && (
                <div style={{
                  padding: '40px',
                  textAlign: 'center',
                  color: '#6b7280',
                  fontSize: '16px'
                }}>
                  {filteredData.length === 0 && tableData.length > 0 ? (
                    <div>
                      <div style={{ fontSize: '18px', marginBottom: '8px' }}>🔍 No matching results</div>
                      <div style={{ fontSize: '14px' }}>Try adjusting your search terms or filters</div>
                    </div>
                  ) : tableData.length === 0 ? (
                    <div>
                      <div style={{ fontSize: '18px', marginBottom: '8px' }}>📊 No data available</div>
                      <div style={{ fontSize: '14px' }}>No valid coordinate data found</div>
                    </div>
                  ) : (
                    <div>No data available</div>
                  )}
                </div>
              )}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '16px',
                borderTop: '1px solid #e5e7eb',
                background: '#fafafa',
                gap: '8px'
              }}>
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: '6px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    background: currentPage === 1 ? '#f3f4f6' : '#fff',
                    color: currentPage === 1 ? '#9ca3af' : '#374151',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontSize: '14px'
                  }}
                >
                  ← Previous
                </button>
                
                <span style={{ fontSize: '14px', color: '#374151', margin: '0 16px' }}>
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '6px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    background: currentPage === totalPages ? '#f3f4f6' : '#fff',
                    color: currentPage === totalPages ? '#9ca3af' : '#374151',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Map View */
          <div style={{ position: "relative", height: "100%" }}>
            <div 
              id={mapContainerId} 
              style={{ 
                width: '100%',
                height: '100%',
                position: "relative",
                backgroundColor: showBaseLayer ? 'transparent' : '#f8f9fa'
              }}
            />
            {visits.length > 100 && (
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                background: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '500',
                zIndex: 1000,
                maxWidth: '250px',
                lineHeight: '1.4'
              }}>
                📊 {visits.length.toLocaleString()} records
                <br />
                <span style={{ fontSize: '11px', opacity: '0.9' }}>
                  🔍 Zoom in to see individual points (≤100 visible)
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapViewSafe;