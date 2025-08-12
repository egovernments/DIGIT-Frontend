
import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Override Leaflet's default icon to prevent 404 errors
if (typeof L !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNCA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDMjAuNTQ5IDIgMjcgOC40NTEgMjcgMTdDMjcgMzEuNSAxMiA0MSAxMiA0MUMxMiA0MSAtMyAzMS41IC0zIDE3Qy0zIDguNDUxIDMuNTUxIDIgMTIgMloiIGZpbGw9IiNGNDc3MzgiLz4KPHBhdGggZD0iTTEyIDExQzE0LjIwOTEgMTEgMTYgMTIuNzkwOSAxNiAxNUMxNiAxNy4yMDkxIDE0LjIwOTEgMTkgMTIgMTlDOS43OTA5IDE5IDggMTcuMjA5MSA4IDE1QzggMTIuNzkwOSA5Ljc5MDkgMTEgMTIgMTFaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNCA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDMjAuNTQ5IDIgMjcgOC40NTEgMjcgMTdDMjcgMzEuNSAxMiA0MSAxMiA0MUMxMiA0MSAtMyAzMS41IC0zIDE3Qy0zIDguNDUxIDMuNTUxIDIgMTIgMloiIGZpbGw9IiNGNDc3MzgiLz4KPHBhdGggZD0iTTEyIDExQzE0LjIwOTEgMTEgMTYgMTIuNzkwOSAxNiAxNUMxNiAxNy4yMDkxIDE0LjIwOTEgMTkgMTIgMTlDOS43OTA5IDE5IDggMTcuMjA5MSA4IDE1QzggMTIuNzkwOSA5Ljc5MDkgMTEgMTIgMTFaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
    shadowUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDEiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCA0MSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAuNSIgY3k9IjIwLjUiIHI9IjE4LjUiIGZpbGw9ImJsYWNrIiBvcGFjaXR5PSIwLjIiLz4KPC9zdmc+Cg=='
  });
}

// Custom marker function
const createCustomMarker = (style = {}) => {
  const svgHtml = `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="12" fill="${style.fill || '#F47738'}" stroke="${style.stroke || '#FFFFFF'}" stroke-width="2"/>
      <circle cx="16" cy="16" r="6" fill="${style.innerFill || '#FFFFFF'}"/>
    </svg>
  `;

  return L.divIcon({
    className: "custom-svg-icon",
    html: svgHtml,
    iconAnchor: [16, 32],
    iconSize: [32, 32],
  });
};

const isValidCoord = (v) =>
  v && typeof v.lat === "number" && typeof v.lng === "number";

const MapView = ({ visits = [], shapefileData = null, boundaryStyle = {} }) => {
  const mapRef = useRef(null);
  const markersRef = useRef(null); // L.LayerGroup for markers+polyline
  const boundaryLayerRef = useRef(null); // L.GeoJSON layer for shapefile boundaries

  useEffect(() => {
    // Initialize map once
    if (!mapRef.current) {
      const initialCenter = isValidCoord(visits[0]) ? [visits[0].lat, visits[0].lng] : [0, 0];

      // Add custom marker styles
      const markerStyles = `
        <style>
          .custom-svg-icon {
            background: transparent !important;
            border: none !important;
          }
          .custom-svg-icon svg {
            display: block;
            width: 100%;
            height: 100%;
          }
          .leaflet-marker-icon {
            background: transparent !important;
          }
          
          /* Override all marker icons in the marker pane */
          .leaflet-pane.leaflet-marker-pane img.leaflet-marker-icon {
            display: none !important;
          }
          
          /* Force all markers to use our custom styling */
          .leaflet-marker-icon[src*="marker-icon"] {
            display: none !important;
          }
          
          /* Hide any default marker images */
          .leaflet-marker-icon[src*="marker-icon-2x.png"],
          .leaflet-marker-icon[src*="marker-icon.png"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
          }
          
          /* Ensure our custom markers are visible */
          .leaflet-marker-icon.custom-svg-icon {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
          }
          
          /* Override any remaining default markers */
          .leaflet-marker-icon:not(.custom-svg-icon) {
            display: none !important;
          }
        </style>
      `;

      // Inject styles into the map container
      const mapContainer = document.getElementById("map");
      if (mapContainer) {
        mapContainer.insertAdjacentHTML('beforeend', markerStyles);
        
        // Function to replace default markers with custom ones
        const replaceDefaultMarkers = () => {
          const defaultMarkers = document.querySelectorAll('.leaflet-marker-icon[src*="marker-icon"]');
          defaultMarkers.forEach(marker => {
            if (!marker.classList.contains('custom-svg-icon')) {
              marker.style.display = 'none';
              marker.style.visibility = 'hidden';
              marker.style.opacity = '0';
            }
          });
        };

        // Set up a mutation observer to watch for new markers
        const observer = new MutationObserver(replaceDefaultMarkers);
        observer.observe(mapContainer, { 
          childList: true, 
          subtree: true,
          attributes: true,
          attributeFilter: ['src', 'class']
        });
      }

      mapRef.current = L.map("map", {
        center: initialCenter,
        zoom: 13,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(mapRef.current);

      // layer group to hold visit markers and polyline
      markersRef.current = L.layerGroup().addTo(mapRef.current);
      
      // layer group to hold boundary/shapefile data
      boundaryLayerRef.current = L.layerGroup().addTo(mapRef.current);
    }

    const map = mapRef.current;
    const layerGroup = markersRef.current;
    const boundaryLayer = boundaryLayerRef.current;

    // Defensive: ensure layerGroup exists
    if (layerGroup && typeof layerGroup.clearLayers === "function") {
      layerGroup.clearLayers();
    }
    
    // Handle shapefile/GeoJSON boundary data
    if (boundaryLayer && typeof boundaryLayer.clearLayers === "function") {
      boundaryLayer.clearLayers();
      
      if (shapefileData) {
        try {
          // Create GeoJSON layer with custom styling
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
              // Add popup with feature properties if needed
              if (feature.properties && boundaryStyle.showPopup !== false) {
                const popupContent = Object.keys(feature.properties)
                  .map(key => `<b>${key}:</b> ${feature.properties[key]}`)
                  .join('<br/>');
                layer.bindPopup(popupContent);
              }
              
              // Add hover effects if enabled
              if (boundaryStyle.enableHover !== false) {
                layer.on({
                  mouseover: function(e) {
                    const layer = e.target;
                    layer.setStyle({
                      weight: (boundaryStyle.weight || 2) + 1,
                      opacity: 1,
                      fillOpacity: (boundaryStyle.fillOpacity || 0.1) + 0.1
                    });
                  },
                  mouseout: function(e) {
                    geoJsonLayer.resetStyle(e.target);
                  }
                });
              }
            }
          });
          
          geoJsonLayer.addTo(boundaryLayer);
          
          // Optionally fit map to boundary bounds
          if (boundaryStyle.fitBounds !== false && !visits?.length) {
            const bounds = geoJsonLayer.getBounds();
            if (bounds.isValid()) {
              map.fitBounds(bounds, { padding: [50, 50] });
            }
          }
        } catch (err) {
          console.error("Error rendering shapefile data:", err);
        }
      }
    }

    // Prepare valid positions
    const positions = (visits || [])
      .filter(isValidCoord)
      .map((v) => [v.lat, v.lng]);

    if (positions.length) {
      // Add markers for valid visits
      (visits || []).forEach((v, i) => {
        if (!isValidCoord(v)) return;

        const lat = Number(v.lat);
        const lng = Number(v.lng);
        const time = v && v.time ? String(v.time) : "Unknown time";

        L.marker([lat, lng], { icon: createCustomMarker() })
          .bindPopup(`<b>Visit ${i + 1}</b><br/>Time: ${time}`)
          .addTo(layerGroup);
      });

      // Add polyline if more than 1 point
      if (positions.length > 1 && typeof L.polyline === "function") {
        L.polyline(positions, { color: "blue" }).addTo(layerGroup);
      }

      // Fit bounds (with small padding) only if map exists
      if (map && typeof map.fitBounds === "function") {
        try {
          map.fitBounds(positions, { padding: [30, 30] });
        } catch (err) {
          // ignore if fitBounds fails
          // console.warn("fitBounds failed", err);
        }
      }
    }

    // If container was hidden/resized, ensure leaflet recalculates
    setTimeout(() => {
      if (map && typeof map.invalidateSize === "function") {
        map.invalidateSize();
      }
    }, 100);

    // Optional cleanup: remove map entirely on unmount to free resources
    // Uncomment if you prefer full teardown on unmount
    /*
    return () => {
      if (map && typeof map.remove === "function") {
        map.remove();
        mapRef.current = null;
        markersRef.current = null;
      }
    };
    */

    // keep effect dependencies simple
  }, [visits, shapefileData, boundaryStyle]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div id="map" style={{ flex: 2, minHeight: "100%" }}></div>
      <div style={{ flex: 1, padding: "1rem", overflowY: "auto", background: "#fafafa" }}>
        <h3>Visits</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {(visits || []).map((v, i) => {
            const hasCoords = isValidCoord(v);
            const lat = hasCoords ? Number(v.lat).toFixed(6) : "N/A";
            const lng = hasCoords ? Number(v.lng).toFixed(6) : "N/A";
            const time = v && v.time ? String(v.time) : "Unknown time";

            return (
              <li key={i} style={{ marginBottom: "0.5rem" }}>
                <b>{i + 1}.</b> ({lat}, {lng})
                <br />
                <small>{time}</small>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default MapView;
