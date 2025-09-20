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


/**
 * Pure Map View Component - Only handles map visualization
 * No table logic, no view mode switching - just a clean map component
 */
const MapViewSafe = ({ 
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

        console.log('✅ Map initialized safely');

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
          
          // Google Terrain
          const googleTerrain = L.tileLayer('https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
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
          
          // Esri World Imagery
          const esriSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          });
          
          // Add base layers to map
          baseLayers["🗺️ OpenStreetMap"] = osmLayer;
          baseLayers["🌍 Google Streets"] = googleStreets;
          baseLayers["🛰️ Google Satellite"] = googleSatellite;
          baseLayers["🗺️ Google Hybrid"] = googleHybrid;
          baseLayers["🏔️ Google Terrain"] = googleTerrain;
          baseLayers["☀️ Light Theme"] = cartoLight;
          baseLayers["🌙 Dark Theme"] = cartoDark;
          baseLayers["🛰️ Esri Satellite"] = esriSatellite;
          
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
          
          // Add layer control with both base layers and overlay layers
          const layerControl = L.control.layers(baseLayers, overlayMaps, {
            position: 'topright',
            collapsed: true
          }).addTo(mapRef.current);
          
          console.log('✅ Layer control added with', Object.keys(baseLayers).length, 'base layers');
          
          // Add custom CSS for better layer control styling
          const style = document.createElement('style');
          style.innerHTML = `
            .leaflet-control-layers {
              background: rgba(255, 255, 255, 0.95) !important;
              backdrop-filter: blur(8px);
              border-radius: 8px !important;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
              border: 1px solid rgba(255, 255, 255, 0.3) !important;
            }
            
            .leaflet-control-layers-expanded {
              min-width: 200px;
            }
            
            .leaflet-control-layers label {
              font-size: 13px;
              font-weight: 500;
              margin: 4px 0;
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 2px;
              border-radius: 4px;
              transition: background-color 0.2s;
            }
            
            .leaflet-control-layers label:hover {
              background-color: rgba(66, 165, 245, 0.1);
            }
            
            .leaflet-control-layers-separator {
              margin: 8px 0 !important;
              border-top: 1px solid rgba(0,0,0,0.1) !important;
            }
            
            .leaflet-control-layers-toggle {
              background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2'%3E%3Cpath d='M3 6h18M3 12h18M3 18h18'/%3E%3C/svg%3E") !important;
              width: 28px !important;
              height: 28px !important;
            }
          `;
          document.head.appendChild(style);
        }

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

        // Function to render individual markers (no clustering)
        const renderMarkers = () => {
          if (!markersRef.current || !mapRef.current) return;
          
          // Clear existing markers
          markersRef.current.clearLayers();
          
          const validVisits = visits.filter(isValidCoord);
          if (validVisits.length === 0) return;
          
          // Render each coordinate as an individual marker
          validVisits.forEach((visit, index) => {
            const popupContent = customPopupContent ? customPopupContent(visit, index) : createVisitPopup(visit, index);
            
            L.circleMarker([visit.lat, visit.lng], {
              radius: customMarkerStyle?.radius || 7,
              fillColor: customMarkerStyle?.fill || '#F47738',
              fillOpacity: customMarkerStyle?.fillOpacity || 0.9,
              weight: customMarkerStyle?.strokeWidth || 2,
              color: customMarkerStyle?.stroke || '#fff',
              className: 'individual-marker'
            })
            .bindPopup(popupContent)
            .addTo(markersRef.current);
          });
          
          console.log(`🗺️ Rendered: ${validVisits.length} individual markers`);
        };
        
        // Initial marker rendering
        renderMarkers();
        
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
    </div>
  );
};

export default MapViewSafe;