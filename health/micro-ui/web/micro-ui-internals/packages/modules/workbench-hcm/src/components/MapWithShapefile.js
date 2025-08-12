import React, { useState, useEffect } from "react";
import MapView from "./MapView";
import { 
  loadGeoJSONFromURL, 
  loadGeoJSONFromFile, 
  shapefileToGeoJSON,
  isShapefileSupported 
} from "../utils/shapefileHelper";

/**
 * Example component showing how to use MapView with shapefile/GeoJSON data
 * 
 * Usage:
 * 1. With a GeoJSON URL:
 *    <MapWithShapefile geoJsonUrl="https://example.com/boundaries.geojson" />
 * 
 * 2. With static GeoJSON data:
 *    <MapWithShapefile geoJsonData={myGeoJsonObject} />
 * 
 * 3. With file upload:
 *    <MapWithShapefile enableFileUpload={true} />
 */
const MapWithShapefile = ({ 
  visits = [], 
  geoJsonUrl = null,
  geoJsonData = null,
  enableFileUpload = false,
  customBoundaryStyle = {}
}) => {
  const [shapefileData, setShapefileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Default boundary styling
  const defaultBoundaryStyle = {
    color: '#FF0000',           // Red outline
    weight: 2,                  // Line thickness
    opacity: 0.8,               // Line opacity
    fillColor: '#FF0000',       // Fill color
    fillOpacity: 0.1,           // Fill opacity (transparent)
    dashArray: null,            // Solid line (use '5, 10' for dashed)
    showPopup: true,            // Show popup on click
    enableHover: true,          // Enable hover effects
    fitBounds: true             // Fit map to boundary bounds
  };
  
  // Merge custom styles with defaults
  const boundaryStyle = { ...defaultBoundaryStyle, ...customBoundaryStyle };
  
  // Load GeoJSON from URL if provided
  useEffect(() => {
    if (geoJsonUrl) {
      setLoading(true);
      setError(null);
      
      loadGeoJSONFromURL(geoJsonUrl)
        .then(data => {
          setShapefileData(data);
          setLoading(false);
        })
        .catch(err => {
          setError(`Failed to load GeoJSON: ${err.message}`);
          setLoading(false);
        });
    }
  }, [geoJsonUrl]);
  
  // Use provided GeoJSON data directly
  useEffect(() => {
    if (geoJsonData) {
      setShapefileData(geoJsonData);
    }
  }, [geoJsonData]);
  
  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setLoading(true);
    setError(null);
    
    try {
      if (file.name.endsWith('.geojson') || file.name.endsWith('.json')) {
        // Handle GeoJSON file
        const data = await loadGeoJSONFromFile(file);
        setShapefileData(data);
      } else if (file.name.endsWith('.zip')) {
        // Handle shapefile .zip files
        if (!isShapefileSupported()) {
          setError('Shapefile .zip upload requires shpjs library. Install with: npm install shpjs');
        } else {
          const data = await shapefileToGeoJSON(file);
          setShapefileData(data);
        }
      } else {
        setError('Please upload a .geojson, .json, or .zip (shapefile) file');
      }
    } catch (err) {
      setError(`Failed to load file: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      {enableFileUpload && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#f5f5f5',
          borderBottom: '1px solid #ddd'
        }}>
          <h3>Upload Boundary File</h3>
          <input 
            type="file" 
            accept=".geojson,.json,.zip"
            onChange={handleFileUpload}
            disabled={loading}
          />
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
            Supported formats: GeoJSON (.geojson, .json)
            {isShapefileSupported() && ', Shapefile (.zip)'}
            {!isShapefileSupported() && ' | Install shpjs for shapefile support'}
          </p>
        </div>
      )}
      
      {loading && (
        <div style={{ padding: '1rem', textAlign: 'center' }}>
          Loading boundary data...
        </div>
      )}
      
      {error && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#ffebee',
          color: '#c62828',
          borderBottom: '1px solid #ffcdd2'
        }}>
          Error: {error}
        </div>
      )}
      
      <MapView 
        visits={visits}
        shapefileData={shapefileData}
        boundaryStyle={boundaryStyle}
      />
    </div>
  );
};

export default MapWithShapefile;

/**
 * Example usage with sample GeoJSON data:
 * 
 * const sampleGeoJSON = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *       "type": "Feature",
 *       "properties": {
 *         "name": "District 1",
 *         "population": 50000
 *       },
 *       "geometry": {
 *         "type": "Polygon",
 *         "coordinates": [[
 *           [77.5946, 12.9716],
 *           [77.6100, 12.9716],
 *           [77.6100, 12.9816],
 *           [77.5946, 12.9816],
 *           [77.5946, 12.9716]
 *         ]]
 *       }
 *     }
 *   ]
 * };
 * 
 * <MapWithShapefile geoJsonData={sampleGeoJSON} />
 */