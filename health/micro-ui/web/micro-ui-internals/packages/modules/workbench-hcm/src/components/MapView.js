
import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { createVisitPopup } from "./MapPointsPopup";

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

// Custom popup formatter for boundary shapes (wards, LGAs, etc.)
const createCustomBoundaryPopup = (properties) => {
  if (!properties) return "No data available";

  // Define priority fields and their display names
  const priorityFields = [
    { key: 'wardname', label: '🏘️ Ward Name', priority: 1 },
    { key: 'wardcode', label: '🏷️ Ward Code', priority: 1 },
    { key: 'lganame', label: '🏛️ LGA Name', priority: 2 },
    { key: 'lgacode', label: '📋 LGA Code', priority: 2 },
    { key: 'statename', label: '🌍 State', priority: 2 },
    { key: 'statecode', label: '🏴 State Code', priority: 2 },
    { key: 'status', label: '📊 Status', priority: 3 },
    { key: 'urban', label: '🏙️ Urban Area', priority: 3 },
    { key: 'source', label: '📚 Data Source', priority: 4 },
    { key: 'Shape__Area', label: '📏 Area (sq units)', priority: 4 },
    { key: 'Shape__Length', label: '📐 Perimeter', priority: 4 }
  ];

  // Extract and format fields
  const formattedFields = [];
  const processedKeys = new Set();

  // First, process priority fields
  priorityFields.forEach(fieldDef => {
    const value = properties[fieldDef.key];
    if (value !== undefined && value !== null && value !== '') {
      formattedFields.push({
        ...fieldDef,
        value: formatPropertyValue(fieldDef.key, value)
      });
      processedKeys.add(fieldDef.key);
    }
  });

  // Then, process any remaining fields that weren't in the priority list
  Object.keys(properties).forEach(key => {
    if (!processedKeys.has(key) && properties[key] !== undefined && properties[key] !== null && properties[key] !== '') {
      // Skip technical fields that are not useful to display
      const skipFields = ['globalid', 'FID', 'OBJECTID', 'timestamp', 'editor', 'amapcode'];
      if (!skipFields.some(skipField => key.toLowerCase().includes(skipField.toLowerCase()))) {
        formattedFields.push({
          key,
          label: formatFieldLabel(key),
          value: formatPropertyValue(key, properties[key]),
          priority: 5
        });
      }
    }
  });

  // Sort by priority and create HTML
  formattedFields.sort((a, b) => a.priority - b.priority);

  // Group fields by priority for better visual organization
  const priorityGroups = {
    1: formattedFields.filter(f => f.priority === 1),
    2: formattedFields.filter(f => f.priority === 2),
    3: formattedFields.filter(f => f.priority === 3),
    4: formattedFields.filter(f => f.priority >= 4)
  };

  let htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 280px;">
      <div style="background: linear-gradient(135deg, #7B1FA2 0%, #9C27B0 100%); color: white; padding: 14px; margin: -9px -9px 14px -9px; border-radius: 8px 8px 0 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="margin: 0; font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 20px;">📍</span>
          ${properties.wardname || properties.name || properties.WARDNAME || 'Boundary Information'}
        </h3>
        ${properties.lganame ? `<p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">${properties.lganame}, ${properties.statename || ''}</p>` : ''}
      </div>
  `;

  // Add priority groups with visual separation
  Object.keys(priorityGroups).forEach((priority, index) => {
    const fields = priorityGroups[priority];
    if (fields.length === 0) return;

    if (index > 0 && priorityGroups[Object.keys(priorityGroups)[index-1]].length > 0) {
      htmlContent += `<div style="border-top: 1px solid #e5e7eb; margin: 12px -9px 12px -9px;"></div>`;
    }

    fields.forEach(field => {
      const isImportant = field.priority <= 2;
      htmlContent += `
        <div style="margin-bottom: 8px; display: flex; align-items: flex-start; gap: 8px;">
          <span style="font-weight: 600; color: ${isImportant ? '#7B1FA2' : '#6b7280'}; min-width: 120px; display: inline-block; font-size: ${isImportant ? '14px' : '13px'};">
            ${field.label}:
          </span>
          <span style="color: #374151; font-weight: ${isImportant ? '600' : 'normal'}; flex: 1; font-size: ${isImportant ? '14px' : '13px'}; word-break: break-word;">
            ${field.value}
          </span>
        </div>
      `;
    });
  });

  htmlContent += `
      <div style="margin-top: 14px; padding-top: 10px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af; text-align: center; font-style: italic;">
        ${formattedFields.length} data field${formattedFields.length !== 1 ? 's' : ''} available
      </div>
    </div>
  `;

  return htmlContent;
};

// Helper function to format field labels
const formatFieldLabel = (key) => {
  // Convert camelCase or snake_case to readable labels
  return key
    .replace(/([A-Z])/g, ' $1') // camelCase
    .replace(/_/g, ' ') // snake_case
    .replace(/\b\w/g, l => l.toUpperCase()) // capitalize words
    .trim();
};

// Helper function to format property values
const formatPropertyValue = (key, value) => {
  if (value === null || value === undefined) return 'N/A';
  
  // Format specific field types
  if (key.toLowerCase().includes('area') && typeof value === 'number') {
    return value.toFixed(6) + ' sq units';
  }
  
  if (key.toLowerCase().includes('length') && typeof value === 'number') {
    return value.toFixed(3) + ' units';
  }
  
  if (key.toLowerCase().includes('timestamp') || key.toLowerCase().includes('date')) {
    try {
      const date = new Date(value);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch (e) {
      return value;
    }
  }

  // Format yes/no values
  if (key.toLowerCase().includes('urban')) {
    return value.toLowerCase() === 'yes' ? '✅ Yes' : value.toLowerCase() === 'no' ? '❌ No' : value;
  }

  return String(value);
};

// Enhanced popup content function using common MapPointsPopup component
const createEnhancedTaskPopup = (dataPoint, index) => {
  return createVisitPopup(dataPoint, index);
};

const MapView = ({ visits = [], shapefileData = null, boundaryStyle = {}, showConnectingLines = false, customPopupContent = null, customMarkerStyle = null, mapContainerId = "map" }) => {
  const mapRef = useRef(null);
  const markersRef = useRef(null); // L.LayerGroup for markers+polyline
  const boundaryLayerRef = useRef(null); // L.GeoJSON layer for shapefile boundaries

  useEffect(() => {
    // Initialize map once
    if (!mapRef.current) {
      // Default to Ondo State, Nigeria coordinates
      const ONDO_STATE_CENTER = [7.25, 5.2];
      const initialCenter = isValidCoord(visits[0]) ? [visits[0].lat, visits[0].lng] : ONDO_STATE_CENTER;

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

          /* Custom Boundary Popup Styles */
          .leaflet-popup.custom-boundary-popup .leaflet-popup-content-wrapper {
            border-radius: 8px !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15) !important;
            border: 1px solid rgba(123, 31, 162, 0.2) !important;
            padding: 0 !important;
            background: white !important;
          }
          
          .leaflet-popup.custom-boundary-popup .leaflet-popup-content {
            margin: 0 !important;
            line-height: 1.5 !important;
          }
          
          .leaflet-popup.custom-boundary-popup .leaflet-popup-tip {
            background: white !important;
            border: 1px solid rgba(123, 31, 162, 0.2) !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
          }

          .leaflet-popup.custom-boundary-popup .leaflet-popup-close-button {
            color: #7B1FA2 !important;
            font-size: 18px !important;
            font-weight: bold !important;
            padding: 8px !important;
            background: rgba(255, 255, 255, 0.9) !important;
            border-radius: 50% !important;
            width: 26px !important;
            height: 26px !important;
            text-align: center !important;
            line-height: 10px !important;
            right: 8px !important;
            top: 8px !important;
          }

          .leaflet-popup.custom-boundary-popup .leaflet-popup-close-button:hover {
            background: rgba(123, 31, 162, 0.1) !important;
            color: #4A148C !important;
          }

          /* Enhanced Task Marker Popup Styles */
          .leaflet-popup.enhanced-task-popup .leaflet-popup-content-wrapper {
            border-radius: 8px !important;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2) !important;
            border: 1px solid rgba(0, 0, 0, 0.1) !important;
            padding: 0 !important;
            background: white !important;
            max-width: 400px !important;
            min-width: 320px !important;
            overflow: hidden !important;
          }
          
          .leaflet-popup.enhanced-task-popup .leaflet-popup-content {
            margin: 0 !important;
            line-height: 1.5 !important;
            width: auto !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          }
          
          .leaflet-popup.enhanced-task-popup .leaflet-popup-tip {
            background: white !important;
            border: 1px solid rgba(0, 0, 0, 0.1) !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          }

          .leaflet-popup.enhanced-task-popup .leaflet-popup-close-button {
            color: #ffffff !important;
            font-size: 18px !important;
            font-weight: bold !important;
            padding: 6px !important;
            background: rgba(0, 0, 0, 0.3) !important;
            border-radius: 50% !important;
            width: 28px !important;
            height: 28px !important;
            text-align: center !important;
            line-height: 16px !important;
            right: 12px !important;
            top: 12px !important;
            transition: all 0.3s ease !important;
            z-index: 1000 !important;
          }

          .leaflet-popup.enhanced-task-popup .leaflet-popup-close-button:hover {
            background: rgba(0, 0, 0, 0.5) !important;
            color: #ffffff !important;
            transform: scale(1.1) !important;
          }

          /* Additional fallback styles for all task popups */
          .leaflet-popup-content-wrapper {
            border-radius: 8px !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15) !important;
            border: 1px solid rgba(0, 0, 0, 0.1) !important;
            padding: 0 !important;
            background: white !important;
          }
          
          .leaflet-popup-content {
            margin: 0 !important;
            line-height: 1.5 !important;
            width: auto !important;
          }
          
          .leaflet-popup-tip {
            background: white !important;
            border: 1px solid rgba(0, 0, 0, 0.1) !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
          }

          /* Default Enhanced Popup Styles for MapView */
          .leaflet-popup.enhanced-task-popup .leaflet-popup-content-wrapper {
            border-radius: 8px !important;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2) !important;
            border: 1px solid rgba(0, 0, 0, 0.1) !important;
            padding: 0 !important;
            background: white !important;
            max-width: 400px !important;
            min-width: 320px !important;
            overflow: hidden !important;
          }
          
          .leaflet-popup.enhanced-task-popup .leaflet-popup-content {
            margin: 0 !important;
            line-height: 1.5 !important;
            width: auto !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          }
          
          .leaflet-popup.enhanced-task-popup .leaflet-popup-tip {
            background: white !important;
            border: 1px solid rgba(0, 0, 0, 0.1) !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          }

          .leaflet-popup.enhanced-task-popup .leaflet-popup-close-button {
            color: #ffffff !important;
            font-size: 18px !important;
            font-weight: bold !important;
            padding: 6px !important;
            background: rgba(0, 0, 0, 0.3) !important;
            border-radius: 50% !important;
            width: 28px !important;
            height: 28px !important;
            text-align: center !important;
            line-height: 16px !important;
            right: 12px !important;
            top: 12px !important;
            transition: all 0.3s ease !important;
            z-index: 1000 !important;
          }

          .leaflet-popup.enhanced-task-popup .leaflet-popup-close-button:hover {
            background: rgba(0, 0, 0, 0.5) !important;
            color: #ffffff !important;
            transform: scale(1.1) !important;
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

      mapRef.current = L.map(mapContainerId, {
        center: initialCenter,
        zoom: 8, // State-level zoom for Ondo State
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
      position: 'topright',   // move to bottom left
      collapsed: false,          // collapsed by default
    }).addTo(mapRef.current);

// const layersControl = document.querySelector('.leaflet-control-layers');
// if (layersControl) {
//   const label = document.createElement('div');
//   label.innerText = 'Layers';
//   label.style.fontWeight = 'bold';
//   label.style.textAlign = 'center';
//   layersControl.prepend(label);
// }

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
                const popupContent = createCustomBoundaryPopup(feature.properties);
                layer.bindPopup(popupContent, {
                  maxWidth: 350,
                  className: 'custom-boundary-popup'
                });
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

        // Use custom popup content if provided, otherwise use enhanced popup
        let popupContent;
        if (customPopupContent && typeof customPopupContent === 'function') {
          popupContent = customPopupContent(v, i);
        } else {
          // Use enhanced popup as default
          popupContent = createEnhancedTaskPopup(v, i);
        }

        // Use custom marker style if provided, otherwise use default
        const markerIcon = customMarkerStyle ? createCustomMarker(customMarkerStyle) : createCustomMarker();
        
        L.marker([lat, lng], { icon: markerIcon })
          .bindPopup(popupContent, {
            maxWidth: 400,
            minWidth: 320,
            className: customPopupContent ? 'custom-task-popup' : 'enhanced-task-popup'
          })
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

    // Cleanup: remove map entirely on unmount to free resources and prevent conflicts
    return () => {
      if (mapRef.current && typeof mapRef.current.remove === "function") {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (markersRef.current) {
        markersRef.current = null;
      }
      if (boundaryLayerRef.current) {
        boundaryLayerRef.current = null;
      }
    };

    // keep effect dependencies simple
  }, [visits, shapefileData, boundaryStyle, showConnectingLines, customPopupContent, customMarkerStyle]);

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div id={mapContainerId} style={{ flex: 2, minHeight: "100%" }}></div>
      {/* <div style={{ flex: 1, padding: "1rem", overflowY: "auto", background: "#fafafa" }}>
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
      </div> */}
    </div>
  );
};

export default MapView;
