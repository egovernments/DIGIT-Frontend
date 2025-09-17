import React, { useEffect, useRef, useState, useMemo } from "react";
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

// Enhanced clustering implementation for very large datasets (10k+ records)
const createAggressiveCluster = (markers, zoom = 8) => {
  if (markers.length <= 50) return markers.map(m => [m]);
  
  // Grid-based clustering for performance with large datasets
  const gridSize = zoom > 12 ? 0.001 : zoom > 10 ? 0.005 : zoom > 8 ? 0.01 : 0.05;
  const grid = new Map();
  
  markers.forEach(marker => {
    const gridX = Math.floor(marker.lat / gridSize);
    const gridY = Math.floor(marker.lng / gridSize);
    const key = `${gridX},${gridY}`;
    
    if (!grid.has(key)) {
      grid.set(key, []);
    }
    grid.get(key).push(marker);
  });
  
  return Array.from(grid.values());
};

// Simplified marker for performance
const createClusterIcon = (count, size = 40) => {
  const color = count > 1000 ? '#e74c3c' : count > 100 ? '#f39c12' : count > 10 ? '#f1c40f' : '#2ecc71';
  const displayCount = count > 999 ? '999+' : count.toString();
  
  return L.divIcon({
    className: 'marker-cluster-large',
    html: `<div style="
      background: ${color};
      color: white;
      border-radius: 50%;
      width: ${size}px;
      height: ${size}px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: ${size > 40 ? '16px' : '12px'};
      border: 3px solid white;
      box-shadow: 0 3px 10px rgba(0,0,0,0.4);
      cursor: pointer;
    ">${displayCount}</div>`,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2]
  });
};

// Simple circle marker for canvas rendering
const createSimpleMarker = (lat, lng, color = '#F47738') => {
  return L.circleMarker([lat, lng], {
    radius: 4,
    fillColor: color,
    fillOpacity: 0.8,
    weight: 1,
    color: '#fff',
    opacity: 1
  });
};

const MapViewOptimized = ({ 
  visits = [], 
  shapefileData = null, 
  boundaryStyle = {}, 
  showConnectingLines = false, 
  customPopupContent = null, 
  customMarkerStyle = null, 
  mapContainerId = "map", 
  showBaseLayer = true,
  enableClustering = true,
  maxMarkersBeforeClustering = 50,
  useCanvasRenderer = true,
  maxVisibleMarkers = 100 // Much lower for large datasets
}) => {
  const mapRef = useRef(null);
  const markersRef = useRef(null);
  const boundaryLayerRef = useRef(null);
  const zoomTimeoutRef = useRef(null);
  const [currentZoom, setCurrentZoom] = useState(8);
  
  // Memoize processed visits for performance
  const processedVisits = useMemo(() => {
    return visits.filter(isValidCoord);
  }, [visits]);

  // Performance settings based on data size
  const performanceMode = useMemo(() => {
    const count = processedVisits.length;
    return {
      isLargeDataset: count > 1000,
      isVeryLargeDataset: count > 5000,
      useAggressive: count > 1000000,
      maxVisible: count > 1000000 ? 50 : count > 5000 ? 100 : count > 1000 ? 200 : maxVisibleMarkers,
      clusterThreshold: count > 5000 ? 10 : count > 1000 ? 25 : maxMarkersBeforeClustering
    };
  }, [processedVisits.length, maxMarkersBeforeClustering, maxVisibleMarkers]);

  useEffect(() => {
    const initializeMap = setTimeout(() => {
      if (!mapRef.current) {
        const ONDO_STATE_CENTER = [7.25, 5.2];
        const initialCenter = isValidCoord(visits[0]) ? [visits[0].lat, visits[0].lng] : ONDO_STATE_CENTER;

        const mapContainer = document.getElementById(mapContainerId);
        if (!mapContainer) {
          console.error(`Map container with id '${mapContainerId}' not found`);
          return;
        }

        if (mapContainer._leaflet_id) {
          console.warn(`Map already initialized on container '${mapContainerId}'. Cleaning up first.`);
          const existingMap = L.DomUtil.get(mapContainerId);
          if (existingMap && existingMap._leaflet) {
            existingMap._leaflet.remove();
          }
        }

        try {
          // Create map optimized for large datasets
          mapRef.current = L.map(mapContainerId, {
            center: initialCenter,
            zoom: 8,
            zoomControl: true,
            attributionControl: showBaseLayer,
            preferCanvas: true, // Force canvas for better performance
            renderer: L.canvas({ padding: 0.2 }), // Smaller padding for performance
            // Performance optimizations and zoom safety
            wheelDebounceTime: 200, // Increase debounce for stability
            wheelPxPerZoomLevel: 120, // Reduce zoom sensitivity
            zoomAnimation: false, // Disable all zoom animations for stability
            fadeAnimation: false,
            markerZoomAnimation: false,
            doubleClickZoom: false, // Disable double-click zoom
            boxZoom: false, // Disable box zoom
            keyboard: false, // Disable keyboard zoom
            scrollWheelZoom: false, // Disable default scroll wheel zoom - we'll implement custom
            touchZoom: false // Disable touch zoom to prevent DomUtil errors
          });

          // Track zoom changes for dynamic clustering with error handling
          mapRef.current.on('zoomend', () => {
            try {
              if (mapRef.current && mapRef.current.getZoom) {
                setCurrentZoom(mapRef.current.getZoom());
              }
            } catch (error) {
              console.warn('Zoom tracking failed:', error);
            }
          });
          
          // Disable ALL problematic zoom features to prevent DomUtil errors
          mapRef.current.off('dblclick');
          mapRef.current.doubleClickZoom.disable();
          mapRef.current.scrollWheelZoom.disable();
          
          // Implement custom safe scroll wheel zoom
          mapRef.current.getContainer().addEventListener('wheel', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Debounce zoom operations
            if (zoomTimeoutRef.current) {
              clearTimeout(zoomTimeoutRef.current);
            }
            
            zoomTimeoutRef.current = setTimeout(() => {
              try {
                if (!mapRef.current || !mapRef.current.getZoom) return;
                
                const currentZoom = mapRef.current.getZoom();
                const delta = e.deltaY > 0 ? -1 : 1;
                const newZoom = Math.max(1, Math.min(18, currentZoom + delta));
                
                if (newZoom !== currentZoom) {
                  // Use simple setZoom instead of setZoomAround to avoid DomUtil errors
                  mapRef.current.setZoom(newZoom, { animate: false });
                }
              } catch (error) {
                console.warn('Custom zoom failed:', error);
              }
            }, 50); // Debounce zoom operations
          }, { passive: false });

          console.log(`🚀 Map initialized in ${performanceMode.useAggressive ? 'AGGRESSIVE' : performanceMode.isLargeDataset ? 'HIGH' : 'NORMAL'} performance mode for ${processedVisits.length} records`);

        } catch (error) {
          console.error('Failed to initialize Leaflet map:', error);
          return;
        }

        if (!showBaseLayer) {
          const mapContainer = document.getElementById(mapContainerId);
          if (mapContainer) {
            mapContainer.style.backgroundColor = '#f8f9fa';
          }
        }

        if (showBaseLayer) {
          // Lightweight tile layer only
          const openStreetMap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; OpenStreetMap',
            maxZoom: 18,
            updateWhenIdle: true,
            updateWhenZooming: false, // Reduce updates during zoom
            keepBuffer: 1
          });

          openStreetMap.addTo(mapRef.current);
        }

        markersRef.current = L.layerGroup().addTo(mapRef.current);
        boundaryLayerRef.current = L.layerGroup().addTo(mapRef.current);
      }

      const map = mapRef.current;
      const layerGroup = markersRef.current;
      const boundaryLayer = boundaryLayerRef.current;

      if (layerGroup && typeof layerGroup.clearLayers === "function") {
        layerGroup.clearLayers();
      }
      
      // Handle shapefile/GeoJSON boundary data
      if (boundaryLayer && typeof boundaryLayer.clearLayers === "function") {
        boundaryLayer.clearLayers();
        
        if (shapefileData) {
          try {
            const geoJsonLayer = L.geoJSON(shapefileData, {
              style: function(feature) {
                return {
                  color: boundaryStyle.color || '#3388ff',
                  weight: boundaryStyle.weight || 2,
                  opacity: boundaryStyle.opacity || 0.8,
                  fillColor: boundaryStyle.fillColor || '#3388ff',
                  fillOpacity: boundaryStyle.fillOpacity || 0.1,
                  dashArray: boundaryStyle.dashArray || null
                };
              },
              onEachFeature: function(feature, layer) {
                if (feature.properties && boundaryStyle.showPopup !== false) {
                  // Lazy loading for boundary popups
                  layer.on('click', function() {
                    const popupContent = `<div style="padding: 10px;"><strong>${feature.properties.wardname || feature.properties.name || 'Boundary'}</strong></div>`;
                    layer.bindPopup(popupContent, {
                      maxWidth: 250
                    }).openPopup();
                  });
                }
              }
            });
            
            geoJsonLayer.addTo(boundaryLayer);
          } catch (err) {
            console.error("Error rendering shapefile data:", err);
          }
        }
      }

      // Handle markers with aggressive optimization for large datasets
      if (processedVisits.length > 0) {
        
        if (performanceMode.useAggressive) {
          // For 10k+ records: Super aggressive clustering
          console.log(`⚡ Using aggressive clustering for ${processedVisits.length} records`);
          
          const clusters = createAggressiveCluster(processedVisits, currentZoom);
          
          // Only render a subset of clusters to prevent browser freeze
          const maxClusters = 50;
          const clustersToRender = clusters.slice(0, maxClusters);
          
          clustersToRender.forEach(cluster => {
            if (cluster.length === 1) {
              // Single marker as simple circle
              const v = cluster[0];
              const marker = createSimpleMarker(v.lat, v.lng, customMarkerStyle?.fill || '#F47738');
              marker.bindPopup(`<div style="padding: 8px;"><strong>Data Point</strong><br/>Lat: ${v.lat.toFixed(4)}, Lng: ${v.lng.toFixed(4)}</div>`);
              marker.addTo(layerGroup);
            } else {
              // Cluster marker
              const centerLat = cluster.reduce((sum, m) => sum + m.lat, 0) / cluster.length;
              const centerLng = cluster.reduce((sum, m) => sum + m.lng, 0) / cluster.length;
              
              const clusterIcon = createClusterIcon(cluster.length, cluster.length > 100 ? 50 : 40);
              
              const clusterMarker = L.marker([centerLat, centerLng], { icon: clusterIcon })
                .bindPopup(`
                  <div style="padding: 10px; text-align: center;">
                    <h4 style="margin: 0 0 8px 0; color: #e74c3c;">📍 ${cluster.length} Records</h4>
                    <p style="margin: 0; font-size: 12px; color: #666;">Zoom in to see individual points</p>
                  </div>
                `)
                .addTo(layerGroup);
              
              // Zoom in on cluster click with safe zoom method
              clusterMarker.on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                try {
                  const currentZoom = map.getZoom();
                  const newZoom = Math.min(currentZoom + 3, 16);
                  
                  // Use setTimeout to avoid DOM issues
                  setTimeout(() => {
                    try {
                      if (map && map.setZoom && map.panTo) {
                        // Split into two separate operations to avoid setZoomAround
                        map.panTo([centerLat, centerLng], { animate: false });
                        setTimeout(() => {
                          map.setZoom(newZoom, { animate: false });
                        }, 50);
                      }
                    } catch (zoomError) {
                      console.warn('Zoom operation failed:', zoomError);
                    }
                  }, 100);
                } catch (error) {
                  console.warn('Cluster click failed:', error);
                }
              });
            }
          });
          
          if (clusters.length > maxClusters) {
            // Show notification about limited display
            const notification = L.control({ position: 'topright' });
            notification.onAdd = function() {
              const div = L.DomUtil.create('div', 'leaflet-control-custom');
              div.innerHTML = `
                <div style="
                  background: rgba(231, 76, 60, 0.9);
                  color: white;
                  padding: 8px 12px;
                  border-radius: 4px;
                  font-size: 12px;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                ">
                  ⚡ Showing ${maxClusters} of ${clusters.length} clusters<br/>
                  <small>Zoom in for more detail</small>
                </div>
              `;
              return div;
            };
            notification.addTo(map);
          }
          
        } else if (performanceMode.isLargeDataset && enableClustering) {
          // Regular clustering for 1k-10k records
          const clusters = createAggressiveCluster(processedVisits, currentZoom);
          
          clusters.forEach(cluster => {
            if (cluster.length === 1) {
              const v = cluster[0];
              const marker = createSimpleMarker(v.lat, v.lng);
              const popupContent = customPopupContent ? customPopupContent(v, 0) : createVisitPopup(v, 0);
              marker.bindPopup(popupContent);
              marker.addTo(layerGroup);
            } else {
              const centerLat = cluster.reduce((sum, m) => sum + m.lat, 0) / cluster.length;
              const centerLng = cluster.reduce((sum, m) => sum + m.lng, 0) / cluster.length;
              
              const clusterIcon = createClusterIcon(cluster.length);
              
              const clusterMarker = L.marker([centerLat, centerLng], { icon: clusterIcon })
                .bindPopup(`<div style="padding: 10px;"><strong>${cluster.length} items</strong><br/>Click to zoom in</div>`)
                .addTo(layerGroup);
              
              clusterMarker.on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                try {
                  const currentZoom = map.getZoom();
                  const newZoom = Math.min(currentZoom + 2, 15);
                  
                  // Use setTimeout to avoid DOM issues
                  setTimeout(() => {
                    try {
                      if (map && map.setZoom && map.panTo) {
                        // Split into two separate operations to avoid setZoomAround
                        map.panTo([centerLat, centerLng], { animate: false });
                        setTimeout(() => {
                          map.setZoom(newZoom, { animate: false });
                        }, 50);
                      }
                    } catch (zoomError) {
                      console.warn('Zoom operation failed:', zoomError);
                    }
                  }, 100);
                } catch (error) {
                  console.warn('Cluster click failed:', error);
                }
              });
            }
          });
          
        } else {
          // Normal rendering for smaller datasets
          const markersToRender = processedVisits.slice(0, performanceMode.maxVisible);
          
          markersToRender.forEach((v, i) => {
            const marker = createSimpleMarker(v.lat, v.lng);
            const popupContent = customPopupContent ? customPopupContent(v, i) : createVisitPopup(v, i);
            marker.bindPopup(popupContent);
            marker.addTo(layerGroup);
          });
        }

        // Center on data if not too many points - use safer method
        if (processedVisits.length <= 1000) {
          setTimeout(() => {
            try {
              const firstMarker = processedVisits[0];
              if (firstMarker && firstMarker.lat && firstMarker.lng && map && map.setView) {
                map.setView([firstMarker.lat, firstMarker.lng], 10, { animate: false });
              }
            } catch (err) {
              console.warn("setView failed", err);
            }
          }, 200);
        }
      }

      // Invalidate size after render
      setTimeout(() => {
        if (map && typeof map.invalidateSize === "function") {
          map.invalidateSize();
        }
      }, 100);
    }, 50);

    // Cleanup
    return () => {
      clearTimeout(initializeMap);
      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current);
      }
      if (mapRef.current && typeof mapRef.current.remove === "function") {
        try {
          // Remove custom wheel event listener before removing map
          const container = mapRef.current.getContainer();
          if (container) {
            container.removeEventListener('wheel', null);
          }
          mapRef.current.remove();
        } catch (error) {
          console.error('Error removing map:', error);
        }
        mapRef.current = null;
      }
      if (markersRef.current) {
        markersRef.current = null;
      }
      if (boundaryLayerRef.current) {
        boundaryLayerRef.current = null;
      }
    };
  }, [
    processedVisits, 
    shapefileData, 
    boundaryStyle, 
    showConnectingLines, 
    customPopupContent, 
    customMarkerStyle, 
    mapContainerId, 
    showBaseLayer,
    enableClustering,
    maxMarkersBeforeClustering,
    useCanvasRenderer,
    maxVisibleMarkers,
    currentZoom,
    performanceMode
  ]);

  // Custom zoom controls to replace disabled default zoom
  const handleZoomIn = () => {
    if (mapRef.current && mapRef.current.getZoom) {
      const currentZoom = mapRef.current.getZoom();
      const newZoom = Math.min(currentZoom + 1, 18);
      mapRef.current.setZoom(newZoom, { animate: false });
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current && mapRef.current.getZoom) {
      const currentZoom = mapRef.current.getZoom();
      const newZoom = Math.max(currentZoom - 1, 1);
      mapRef.current.setZoom(newZoom, { animate: false });
    }
  };

  return (
    <div style={{ display: "flex", height: "100%", position: "relative" }}>
      <div id={mapContainerId} style={{ flex: 1, minHeight: "100%" }}></div>
      
      {/* Custom Safe Zoom Controls */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        zIndex: 1000
      }}>
        <button
          onClick={handleZoomIn}
          style={{
            width: '32px',
            height: '32px',
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          style={{
            width: '32px',
            height: '32px',
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
          title="Zoom Out"
        >
          −
        </button>
      </div>
      
      {performanceMode.useAggressive && (
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: 1000,
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
        }}>
          ⚡ High Performance Mode: {processedVisits.length.toLocaleString()} records
        </div>
      )}
    </div>
  );
};

export default MapViewOptimized;