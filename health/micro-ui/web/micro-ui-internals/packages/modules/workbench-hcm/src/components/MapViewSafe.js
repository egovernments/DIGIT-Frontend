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

// Simple clustering for large datasets
const createSimpleClusters = (markers, clusterRadius = 0.01) => {
  if (markers.length <= 100) return markers.map(m => [m]);
  
  const clusters = [];
  const processed = new Set();
  
  markers.forEach((marker, i) => {
    if (processed.has(i)) return;
    
    const cluster = [marker];
    processed.add(i);
    
    // Find nearby markers (simple distance check)
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

        // Handle markers
        const validVisits = visits.filter(isValidCoord);
        if (validVisits.length > 0 && markersRef.current) {
          if (validVisits.length > 1000) {
            // Use clustering for large datasets
            const clusters = createSimpleClusters(validVisits);
            
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
                
                const clusterIcon = L.divIcon({
                  className: 'cluster-marker',
                  html: `<div style="
                    background: #ff6b6b;
                    color: white;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                  ">${cluster.length}</div>`,
                  iconSize: [30, 30]
                });
                
                L.marker([centerLat, centerLng], { icon: clusterIcon })
                  .bindPopup(`<div style="padding: 10px;"><strong>${cluster.length} items</strong><br/>Zoom in to see details</div>`)
                  .addTo(markersRef.current);
              }
            });
          } else {
            // Regular markers for smaller datasets
            validVisits.slice(0, 500).forEach((v, i) => {
              const popupContent = customPopupContent ? customPopupContent(v, i) : createVisitPopup(v, i);
              
              L.circleMarker([v.lat, v.lng], {
                radius: 6,
                fillColor: customMarkerStyle?.fill || '#F47738',
                fillOpacity: 0.8,
                weight: 2,
                color: '#fff'
              })
              .bindPopup(popupContent)
              .addTo(markersRef.current);
            });
          }
          
          // Add connecting lines if requested
          if (showConnectingLines && validVisits.length > 1 && validVisits.length < 100) {
            const positions = validVisits.map(v => [v.lat, v.lng]);
            L.polyline(positions, { color: "blue", weight: 2 }).addTo(markersRef.current);
          }
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

  }, [visits, shapefileData, boundaryStyle, showConnectingLines, customPopupContent, customMarkerStyle, mapContainerId, showBaseLayer]);

  return (
    <div style={{ display: "flex", height: "100%", position: "relative" }}>
      <div 
        id={mapContainerId} 
        style={{ 
          flex: 1, 
          minHeight: "400px",
          minWidth: "300px",
          position: "relative",
          backgroundColor: showBaseLayer ? 'transparent' : '#f8f9fa'
        }}
      />
      {visits.length > 1000 && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '6px 10px',
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: 1000
        }}>
          📊 {visits.length.toLocaleString()} records (clustered)
        </div>
      )}
    </div>
  );
};

export default MapViewSafe;