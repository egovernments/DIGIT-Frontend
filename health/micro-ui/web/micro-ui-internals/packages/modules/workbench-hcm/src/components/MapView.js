
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
  const size = style.size || 32;
  const center = size / 2;
  const outerRadius = (size * 0.75) / 2;
  const innerRadius = (size * 0.375) / 2;
  
  // Build inner circle only if innerFill is provided and not null
  const innerCircle = style.innerFill !== null ? 
    `<circle cx="${center}" cy="${center}" r="${innerRadius}" fill="${style.innerFill || '#FFFFFF'}"/>` : '';
  
  const svgHtml = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${center}" cy="${center}" r="${outerRadius}" fill="${style.fill || '#F47738'}" stroke="${style.stroke || '#FFFFFF'}" stroke-width="2"/>
      ${innerCircle}
    </svg>
  `;

  return L.divIcon({
    className: "custom-svg-icon",
    html: svgHtml,
    iconAnchor: [center, size],
    iconSize: [size, size],
  });
};

const isValidCoord = (v) =>
  v && typeof v.lat === "number" && typeof v.lng === "number";

const MapView = ({ visits = [], shapefileData = null, boundaryStyle = {}, showConnectingLines = false, customPopupContent = null, customMarkerStyle = null }) => {
  const mapRef = useRef(null);
  const markersRef = useRef(null); // L.LayerGroup for markers+polyline
  const boundaryLayerRef = useRef(null); // L.GeoJSON layer for shapefile boundaries

  useEffect(() => {
    // Initialize map once
    if (!mapRef.current) {
      const initialCenter = isValidCoord(visits[0]) ? [visits[0].lat, visits[0].lng] : [0, 0];

      // Add custom marker styles and layer control styles
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

          /* Layer control styling */
          .leaflet-control-layers {
            background: rgba(255, 255, 255, 0.95) !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
            border: 1px solid rgba(0, 0, 0, 0.1) !important;
            padding: 8px 12px !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            font-size: 14px !important;
            min-width: 140px !important;
            margin-top: 10px !important;
            margin-right: 10px !important;
          }
          
          .leaflet-control-layers-base label {
            font-weight: 500 !important;
            color: #495057 !important;
            padding: 4px 0 !important;
            display: flex !important;
            align-items: center !important;
            cursor: pointer !important;
          }
          
          .leaflet-control-layers input[type="radio"] {
            margin-right: 8px !important;
            accent-color: #4CAF50 !important;
          }
          
          .leaflet-control-layers-base label:hover {
            background-color: rgba(76, 175, 80, 0.1) !important;
            border-radius: 4px !important;
            padding-left: 4px !important;
            padding-right: 4px !important;
          }
          
          .leaflet-control-layers-separator {
            border-top: 1px solid rgba(0, 0, 0, 0.1) !important;
            margin: 8px -12px !important;
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

      // Define base layers
      const openStreetMap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
        maxZoom: 19,
      });

      // High-resolution satellite layer from Google (higher quality)
      const satelliteLayer = L.tileLayer("https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
        attribution: 'Imagery &copy; Google',
        maxZoom: 20,
      });

      // Alternative: Bing satellite imagery (good quality backup)
      const bingSatelliteLayer = L.tileLayer("https://ecn.t3.tiles.virtualearth.net/tiles/a{q}.jpeg?g=1", {
        attribution: '&copy; <a href="https://www.bing.com/maps/">Microsoft Bing Maps</a>',
        maxZoom: 19,
        subdomains: '0123',
        tms: false,
        // Custom tile loading for Bing quadkey system
        getTileUrl: function(coords) {
          const quadkey = this._coordsToQuadKey(coords);
          return `https://ecn.t3.tiles.virtualearth.net/tiles/a${quadkey}.jpeg?g=1`;
        },
        _coordsToQuadKey: function(coords) {
          let quadkey = "";
          for (let i = coords.z; i > 0; i--) {
            let digit = 0;
            const mask = 1 << (i - 1);
            if ((coords.x & mask) !== 0) digit += 1;
            if ((coords.y & mask) !== 0) digit += 2;
            quadkey += digit.toString();
          }
          return quadkey;
        }
      });

      // ESRI World Imagery (fallback option, updated URL)
      const esriSatelliteLayer = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 19,
      });

      const hybridLayer = L.tileLayer("https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
        attribution: 'Imagery &copy; Google, Map data &copy; Google',
        maxZoom: 20,
      });

      const hybridLabels = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}", {
        attribution: '',
        maxZoom: 19,
      });

      // Add default layer (OpenStreetMap)
      openStreetMap.addTo(mapRef.current);

      // Define base layers for layer control
      const baseLayers = {
        "Street Map": openStreetMap,
        "Satellite (Google)": satelliteLayer,
        "Satellite (ESRI)": esriSatelliteLayer,
        "Hybrid (Google)": hybridLayer,
      };

      // Add layer control
      L.control.layers(baseLayers, null, {
        position: 'topright',
        collapsed: false
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
        const time = v && v.time ? String(new Date(v.time).toGMTString()) : "Unknown time";

        // Use custom popup content if provided, otherwise use default
        let popupContent;
        if (customPopupContent && typeof customPopupContent === 'function') {
          popupContent = customPopupContent(v, i);
        } else {
          popupContent = `<b>Visit ${i + 1}</b><br/>Time: ${time}<br/> Bednets Delivered: ${v.quantity || "N/A"} <br/> `;
        }

        // Use custom marker style if provided, otherwise use default
        const markerIcon = customMarkerStyle ? createCustomMarker(customMarkerStyle) : createCustomMarker();
        
        L.marker([lat, lng], { icon: markerIcon })
          .bindPopup(popupContent)
          .addTo(layerGroup);
      });

      // Add polyline if more than 1 point and showConnectingLines is true
      if (showConnectingLines && positions.length > 1 && typeof L.polyline === "function") {
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
  }, [visits, shapefileData, boundaryStyle, showConnectingLines, customPopupContent, customMarkerStyle]);

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
            const time = v && v.time ? String(new Date(v.time).toGMTString()) : "Unknown time";

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
