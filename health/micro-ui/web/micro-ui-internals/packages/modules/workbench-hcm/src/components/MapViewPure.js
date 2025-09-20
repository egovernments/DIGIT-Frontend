import React, { useEffect, useRef } from "react";
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

// Enhanced clustering with viewport awareness and performance optimization
const createViewportAwareClusters = (markers, map) => {
  if (!map || markers.length === 0) {
    return markers.map(m => [m]);
  }
  
  const zoom = map.getZoom();
  const bounds = map.getBounds();
  
  console.log(`🔍 Clustering: ${markers.length} total markers, zoom level: ${zoom}`);
  
  // Filter markers to only those visible in current viewport
  const visibleMarkers = markers.filter(marker => {
    return bounds.contains([marker.lat, marker.lng]);
  });
  
  console.log(`👁️ Visible markers in viewport: ${visibleMarkers.length}`);
  
  // Show individual points for datasets with 50 or fewer markers
  if (markers.length <= 50) {
    console.log(`📍 Small dataset (${markers.length} markers) - showing all individual points without clustering`);
    return markers.map(m => [m]);
  }
  
  // At very high zoom levels (street level), show all points without clustering
  if (zoom >= 18 && visibleMarkers.length <= 200) {
    console.log(`🔍 Max zoom level (${zoom}) - showing all ${visibleMarkers.length} visible points individually`);
    return markers.map(m => [m]);
  }
  
  // If zoomed in enough and only a few points visible, show them individually
  if (zoom >= 15 && visibleMarkers.length <= 100) {
    console.log(`🎯 High zoom (${zoom}) with ${visibleMarkers.length} visible points - showing individually`);
    return markers.map(m => [m]);
  }
  
  // Dynamic cluster radius based on zoom level - more granular for better zoom response
  let clusterRadius;
  if (zoom >= 18) clusterRadius = 0.00005;    // Ultra-fine clustering at max zoom
  else if (zoom >= 17) clusterRadius = 0.0001;  // Extremely tight clustering
  else if (zoom >= 16) clusterRadius = 0.0002;  // Very tight clustering
  else if (zoom >= 15) clusterRadius = 0.0005;  // Tight clustering
  else if (zoom >= 14) clusterRadius = 0.001;   // Moderately tight clustering
  else if (zoom >= 13) clusterRadius = 0.002;   // Moderate clustering
  else if (zoom >= 12) clusterRadius = 0.004;   // Standard clustering
  else if (zoom >= 11) clusterRadius = 0.008;   // Loose clustering
  else if (zoom >= 10) clusterRadius = 0.015;   // Looser clustering
  else if (zoom >= 9) clusterRadius = 0.03;     // Very loose clustering
  else if (zoom >= 8) clusterRadius = 0.05;     // Maximum clustering
  else clusterRadius = 0.1;                     // Super max clustering at low zoom
  
  console.log(`🎯 Using cluster radius: ${clusterRadius} at zoom ${zoom}`);
  
  // Enhanced clustering algorithm with grid-based optimization
  const clusters = [];
  const processed = new Set();
  let clusterCount = 0;
  
  markers.forEach((marker, i) => {
    if (processed.has(i)) return;
    
    const cluster = [marker];
    processed.add(i);
    
    // Find nearby markers within cluster radius using more efficient distance calculation
    markers.forEach((other, j) => {
      if (i === j || processed.has(j)) return;
      
      const latDiff = Math.abs(marker.lat - other.lat);
      const lngDiff = Math.abs(marker.lng - other.lng);
      
      // Quick distance check - if either coordinate difference is too large, skip
      if (latDiff > clusterRadius || lngDiff > clusterRadius) return;
      
      // More accurate distance calculation for close points
      const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
      if (distance < clusterRadius) {
        cluster.push(other);
        processed.add(j);
      }
    });
    
    if (cluster.length > 1) {
      clusterCount++;
    }
    
    clusters.push(cluster);
  });
  
  console.log(`🗂️ Created ${clusters.length} clusters (${clusterCount} multi-point clusters)`);
  console.log(`📊 Clustering efficiency: ${((markers.length - clusters.length) / markers.length * 100).toFixed(1)}% reduction`);
  
  return clusters;
};

/**
 * Pure Map View Component - Only handles map visualization
 * No table logic, no view mode switching - just a clean map component
 */
const MapViewPure = ({ 
  visits = [], 
  shapefileData = null, 
  boundaryStyle = {}, 
  showConnectingLines = false, 
  customPopupContent = null, 
  customMarkerStyle = null, 
  mapContainerId = "map", 
  showBaseLayer = true,
  showDataSummary = true,
  centerCoordinates = null, // Optional: [lat, lng] to center the map
  defaultZoom = 8
}) => {
  const mapRef = useRef(null);
  const markersRef = useRef(null);
  const boundaryLayerRef = useRef(null);
  const initializationRef = useRef(false);

  useEffect(() => {
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

        // Determine center coordinates
        const validVisits = visits.filter(isValidCoord);
        let center = centerCoordinates || [7.25, 5.2]; // Default: Ondo State
        
        if (!centerCoordinates && validVisits.length > 0) {
          // Calculate center from data points
          const avgLat = validVisits.reduce((sum, v) => sum + v.lat, 0) / validVisits.length;
          const avgLng = validVisits.reduce((sum, v) => sum + v.lng, 0) / validVisits.length;
          center = [avgLat, avgLng];
        }

        // Create map with minimal options for safety
        mapRef.current = L.map(mapContainerId, {
          center: center,
          zoom: defaultZoom,
          zoomControl: true,
          attributionControl: showBaseLayer,
          scrollWheelZoom: 'center',
          doubleClickZoom: 'center',
          touchZoom: 'center',
          boxZoom: false,
          keyboard: false,
          zoomAnimation: false,
          fadeAnimation: false,
          markerZoomAnimation: false
        });

        console.log('✅ Map initialized successfully');

        // Define multiple base layers
        const baseLayers = {};
        
        if (showBaseLayer) {
          // OpenStreetMap
          const osmLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
          });
          
          // Google Streets
          const googleStreets = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: '&copy; <a href="https://maps.google.com">Google Maps</a>'
          });
          
          // Google Satellite
          const googleSatellite = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: '&copy; <a href="https://maps.google.com">Google Maps</a>'
          });
          
          // Google Hybrid (Satellite + Labels)
          const googleHybrid = L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: '&copy; <a href="https://maps.google.com">Google Maps</a>'
          });
          
          // CartoDB Positron (Light theme)
          const cartoLight = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
          });
          
          // CartoDB Dark Matter (Dark theme)
          const cartoDark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
          });
          
          // Add base layers to map
          baseLayers["🗺️ OpenStreetMap"] = osmLayer;
          baseLayers["🌍 Google Streets"] = googleStreets;
          baseLayers["🛰️ Google Satellite"] = googleSatellite;
          baseLayers["🗺️ Google Hybrid"] = googleHybrid;
          baseLayers["☀️ Light Theme"] = cartoLight;
          baseLayers["🌙 Dark Theme"] = cartoDark;
          
          // Add default layer (OpenStreetMap)
          osmLayer.addTo(mapRef.current);
        } else {
          container.style.backgroundColor = '#f8f9fa';
        }

        // Create layer groups
        markersRef.current = L.layerGroup().addTo(mapRef.current);
        boundaryLayerRef.current = L.layerGroup().addTo(mapRef.current);
        
        // Add layer control if base layers are available
        if (showBaseLayer && Object.keys(baseLayers).length > 0) {
          const overlayMaps = {
            "📍 Data Points": markersRef.current,
            "🗺️ Boundaries": boundaryLayerRef.current
          };
          
          L.control.layers(baseLayers, overlayMaps, {
            position: 'topright',
            collapsed: true
          }).addTo(mapRef.current);
          
          console.log('✅ Layer control added with', Object.keys(baseLayers).length, 'base layers');
        }

        // Handle boundaries if provided
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
            console.log('✅ Boundary layer added');
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
          
          let singleMarkers = 0;
          let clusterMarkers = 0;
          
          clusters.forEach(cluster => {
            if (cluster.length === 1) {
              // Single marker
              singleMarkers++;
              const v = cluster[0];
              const popupContent = customPopupContent ? customPopupContent(v, 0) : createVisitPopup(v, 0);
              
              L.circleMarker([v.lat, v.lng], {
                radius: customMarkerStyle?.radius || 7,
                fillColor: customMarkerStyle?.fill || '#F47738',
                fillOpacity: customMarkerStyle?.fillOpacity || 0.9,
                weight: customMarkerStyle?.strokeWidth || 2,
                color: customMarkerStyle?.stroke || '#fff',
                className: 'individual-marker'
              })
              .bindPopup(popupContent)
              .addTo(markersRef.current);
            } else {
              // Cluster marker
              clusterMarkers++;
              const centerLat = cluster.reduce((sum, m) => sum + m.lat, 0) / cluster.length;
              const centerLng = cluster.reduce((sum, m) => sum + m.lng, 0) / cluster.length;
              
              // Enhanced cluster icon sizing based on cluster size
              const baseSize = 30;
              const maxSize = 60;
              const clusterSize = Math.min(maxSize, baseSize + Math.log10(cluster.length) * 15);
              
              // Color intensity based on cluster size
              const intensity = Math.min(1, cluster.length / 50);
              const red = Math.floor(255 * intensity);
              const green = Math.floor(107 * (1 - intensity * 0.5));
              const blue = Math.floor(107 * (1 - intensity * 0.7));
              
              const clusterIcon = L.divIcon({
                className: 'cluster-marker',
                html: `<div style="
                  background: linear-gradient(135deg, rgb(${red}, ${green}, ${blue}) 0%, rgb(${Math.max(red-30, 0)}, ${Math.max(green-30, 0)}, ${Math.max(blue-30, 0)}) 100%);
                  color: white;
                  border-radius: 50%;
                  width: ${clusterSize}px;
                  height: ${clusterSize}px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: bold;
                  font-size: ${Math.max(11, clusterSize * 0.25)}px;
                  border: 3px solid white;
                  box-shadow: 0 4px 8px rgba(0,0,0,0.4);
                  cursor: pointer;
                  position: relative;
                  z-index: ${1000 + cluster.length};
                ">${cluster.length}</div>`,
                iconSize: [clusterSize, clusterSize]
              });
              
              const clusterMarker = L.marker([centerLat, centerLng], { icon: clusterIcon })
                .bindPopup(`<div style="padding: 12px; min-width: 200px;">
                  <h4 style="margin: 0 0 8px 0; color: rgb(${red}, ${green}, ${blue}); font-size: 16px;">📍 Cluster Details</h4>
                  <div style="font-size: 14px; line-height: 1.6;">
                    <strong>Points:</strong> ${cluster.length}<br/>
                    <strong>Center:</strong> ${centerLat.toFixed(4)}, ${centerLng.toFixed(4)}<br/>
                    <em style="color: #666; font-size: 12px;">Click cluster or zoom in to see individual points</em>
                  </div>
                </div>`)
                .addTo(markersRef.current);
              
              // Enhanced click handler to zoom into cluster
              clusterMarker.on('click', (e) => {
                e.originalEvent.stopPropagation();
                const group = new L.featureGroup(cluster.map(item => 
                  L.circleMarker([item.lat, item.lng])
                ));
                mapRef.current.fitBounds(group.getBounds().pad(0.15));
              });
            }
          });
          
          console.log(`🗺️ Rendered: ${singleMarkers} individual markers, ${clusterMarkers} cluster markers`);
        };
        
        // Initial marker rendering
        renderMarkers();
        
        // Add event listeners for dynamic clustering on zoom/pan
        let updateTimeout;
        const handleViewChange = (eventType) => {
          console.log(`📍 Map ${eventType} detected - zoom: ${mapRef.current.getZoom()}`);
          
          // Debounce updates to avoid excessive re-rendering
          clearTimeout(updateTimeout);
          updateTimeout = setTimeout(() => {
            console.log('🔄 Re-clustering markers after view change...');
            renderMarkers();
          }, 200);
        };
        
        // Listen to both zoom and move events
        mapRef.current.on('zoomend', () => handleViewChange('zoom'));
        mapRef.current.on('moveend', () => handleViewChange('move'));
        
        // Add connecting lines if requested (only for small datasets)
        if (showConnectingLines && validVisits.length > 1 && validVisits.length < 100) {
          const positions = validVisits.map(v => [v.lat, v.lng]);
          L.polyline(positions, { color: "blue", weight: 2 }).addTo(markersRef.current);
        }

        // Fit bounds to show all markers if we have data
        if (validVisits.length > 0) {
          const group = new L.featureGroup(validVisits.map(v => 
            L.circleMarker([v.lat, v.lng])
          ));
          mapRef.current.fitBounds(group.getBounds().pad(0.1));
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

  }, [visits, shapefileData, boundaryStyle, showConnectingLines, customPopupContent, customMarkerStyle, mapContainerId, showBaseLayer, centerCoordinates, defaultZoom]);

  const validVisits = visits.filter(isValidCoord);

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <div 
        id={mapContainerId} 
        style={{ 
          width: '100%',
          height: '100%',
          position: "relative",
          backgroundColor: showBaseLayer ? 'transparent' : '#f8f9fa'
        }}
      />
      
      {/* Data Summary Overlay */}
      {showDataSummary && validVisits.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: 'rgba(0, 0, 0, 0.85)',
          color: 'white',
          padding: '10px 14px',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '500',
          zIndex: 1000,
          maxWidth: '280px',
          lineHeight: '1.5',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            📊 <strong>{validVisits.length.toLocaleString()}</strong> total records
          </div>
          {validVisits.length <= 50 ? (
            <div style={{ fontSize: '11px', opacity: '0.9', fontStyle: 'italic' }}>
              📍 Showing all individual points
            </div>
          ) : (
            <div style={{ fontSize: '11px', opacity: '0.9', fontStyle: 'italic' }}>
              🎯 Smart clustering enabled (>50 points)<br/>
              🔍 Zoom in to see individual points<br/>
              📍 Click clusters to zoom in
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapViewPure;