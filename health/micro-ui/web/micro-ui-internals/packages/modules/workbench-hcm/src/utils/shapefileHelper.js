// Optional import - will be null if shpjs is not installed
let shp = null;
try {
  shp = require("shpjs");
} catch (e) {
  // shpjs is not installed, shapefile conversion will not be available
  console.warn("shpjs library not found. Shapefile conversion will not be available.");
}

/**
 * Converts a shapefile to GeoJSON format
 * Note: Requires 'shpjs' library to be installed
 * @param {File|ArrayBuffer|string} input - Shapefile data (can be .zip file, ArrayBuffer, or URL)
 * @returns {Promise<Object>} GeoJSON object
 */
export const shapefileToGeoJSON = async (input) => {
  if (!shp) {
    throw new Error('shpjs library is not installed. Please install it with: npm install shpjs');
  }

  try {
    let geoJsonData;
    
    if (input instanceof File) {
      // If it's a file, read it as ArrayBuffer
      const buffer = await input.arrayBuffer();
      geoJsonData = await shp(buffer);
    } else if (typeof input === 'string') {
      // If it's a URL string
      geoJsonData = await shp(input);
    } else if (input instanceof ArrayBuffer) {
      // If it's already an ArrayBuffer
      geoJsonData = await shp(input);
    } else {
      throw new Error('Invalid input type for shapefile conversion');
    }
    
    // shpjs returns either a single GeoJSON object or an array of them
    // Normalize to always work with a FeatureCollection
    if (Array.isArray(geoJsonData)) {
      // If multiple layers, combine them
      const features = geoJsonData.reduce((acc, layer) => {
        if (layer.features) {
          return acc.concat(layer.features);
        }
        return acc;
      }, []);
      
      return {
        type: "FeatureCollection",
        features: features
      };
    } else if (geoJsonData.type === "FeatureCollection") {
      return geoJsonData;
    } else {
      // Wrap single feature in FeatureCollection
      return {
        type: "FeatureCollection",
        features: [geoJsonData]
      };
    }
  } catch (error) {
    console.error("Error converting shapefile to GeoJSON:", error);
    throw error;
  }
};

/**
 * Load GeoJSON from a URL
 * @param {string} url - URL to GeoJSON file
 * @returns {Promise<Object>} GeoJSON object
 */
export const loadGeoJSONFromURL = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const geoJsonData = await response.json();
    return geoJsonData;
  } catch (error) {
    console.error("Error loading GeoJSON from URL:", error);
    throw error;
  }
};

/**
 * Load GeoJSON from a file
 * @param {File} file - GeoJSON file
 * @returns {Promise<Object>} GeoJSON object
 */
export const loadGeoJSONFromFile = async (file) => {
  try {
    const text = await file.text();
    const geoJsonData = JSON.parse(text);
    return geoJsonData;
  } catch (error) {
    console.error("Error loading GeoJSON from file:", error);
    throw error;
  }
};

/**
 * Check if shpjs library is available
 * @returns {boolean} True if shpjs is available
 */
export const isShapefileSupported = () => {
  return shp !== null;
};

/**
 * Validate GeoJSON structure
 * @param {Object} geoJson - GeoJSON object to validate
 * @returns {boolean} True if valid GeoJSON
 */
export const isValidGeoJSON = (geoJson) => {
  try {
    if (!geoJson || typeof geoJson !== 'object') {
      return false;
    }

    const validTypes = [
      'Point', 'MultiPoint', 'LineString', 'MultiLineString',
      'Polygon', 'MultiPolygon', 'GeometryCollection',
      'Feature', 'FeatureCollection'
    ];

    if (!validTypes.includes(geoJson.type)) {
      return false;
    }

    if (geoJson.type === 'FeatureCollection') {
      return Array.isArray(geoJson.features) && 
             geoJson.features.every(feature => 
               feature.type === 'Feature' && feature.geometry
             );
    }

    if (geoJson.type === 'Feature') {
      return geoJson.geometry && validTypes.includes(geoJson.geometry.type);
    }

    // For geometry types, check coordinates exist
    if (geoJson.coordinates) {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error validating GeoJSON:', error);
    return false;
  }
};

/**
 * Simplify GeoJSON geometry (reduce number of points)
 * This is useful for large shapefiles to improve performance
 * @param {Object} geoJson - GeoJSON object
 * @param {number} tolerance - Simplification tolerance (higher = more simplification)
 * @returns {Object} Simplified GeoJSON
 */
export const simplifyGeoJSON = (geoJson, tolerance = 0.01) => {
  // This is a basic implementation
  // For production, consider using libraries like turf.js for better simplification
  
  const simplifyCoords = (coords, isPolygon = false) => {
    if (!Array.isArray(coords) || coords.length < 3) return coords;
    
    // Simple Douglas-Peucker-like algorithm
    const simplified = [coords[0]];
    let lastPoint = coords[0];
    
    for (let i = 1; i < coords.length - 1; i++) {
      const point = coords[i];
      const distance = Math.sqrt(
        Math.pow(point[0] - lastPoint[0], 2) + 
        Math.pow(point[1] - lastPoint[1], 2)
      );
      
      if (distance > tolerance) {
        simplified.push(point);
        lastPoint = point;
      }
    }
    
    // Always keep the last point
    simplified.push(coords[coords.length - 1]);
    
    return simplified;
  };
  
  const simplifyGeometry = (geometry) => {
    if (!geometry || !geometry.type) return geometry;
    
    const type = geometry.type;
    let coordinates = geometry.coordinates;
    
    switch (type) {
      case 'Point':
      case 'MultiPoint':
        return geometry;
        
      case 'LineString':
        coordinates = simplifyCoords(coordinates);
        break;
        
      case 'MultiLineString':
        coordinates = coordinates.map(line => simplifyCoords(line));
        break;
        
      case 'Polygon':
        coordinates = coordinates.map(ring => simplifyCoords(ring, true));
        break;
        
      case 'MultiPolygon':
        coordinates = coordinates.map(polygon => 
          polygon.map(ring => simplifyCoords(ring, true))
        );
        break;
        
      default:
        return geometry;
    }
    
    return {
      ...geometry,
      coordinates
    };
  };
  
  if (!isValidGeoJSON(geoJson)) {
    console.warn('Invalid GeoJSON provided to simplifyGeoJSON');
    return geoJson;
  }
  
  if (geoJson.type === 'FeatureCollection') {
    return {
      ...geoJson,
      features: geoJson.features.map(feature => ({
        ...feature,
        geometry: simplifyGeometry(feature.geometry)
      }))
    };
  } else if (geoJson.type === 'Feature') {
    return {
      ...geoJson,
      geometry: simplifyGeometry(geoJson.geometry)
    };
  } else {
    // Direct geometry
    return simplifyGeometry(geoJson);
  }
};

/**
 * Calculate bounds of GeoJSON
 * @param {Object} geoJson - GeoJSON object
 * @returns {Array} [[minLat, minLng], [maxLat, maxLng]]
 */
export const getGeoJSONBounds = (geoJson) => {
  let minLat = Infinity, minLng = Infinity;
  let maxLat = -Infinity, maxLng = -Infinity;
  
  const processCoordinates = (coords) => {
    if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
      // Single coordinate pair [lng, lat]
      minLng = Math.min(minLng, coords[0]);
      maxLng = Math.max(maxLng, coords[0]);
      minLat = Math.min(minLat, coords[1]);
      maxLat = Math.max(maxLat, coords[1]);
    } else if (Array.isArray(coords)) {
      // Nested coordinates
      coords.forEach(processCoordinates);
    }
  };
  
  const processGeometry = (geometry) => {
    if (geometry && geometry.coordinates) {
      processCoordinates(geometry.coordinates);
    }
  };
  
  if (!isValidGeoJSON(geoJson)) {
    console.warn('Invalid GeoJSON provided to getGeoJSONBounds');
    return [[0, 0], [0, 0]];
  }
  
  if (geoJson.type === 'FeatureCollection') {
    geoJson.features.forEach(feature => {
      processGeometry(feature.geometry);
    });
  } else if (geoJson.type === 'Feature') {
    processGeometry(geoJson.geometry);
  } else {
    // Direct geometry
    processGeometry(geoJson);
  }
  
  // Return in Leaflet format [lat, lng]
  if (minLat === Infinity || maxLat === -Infinity) {
    return [[0, 0], [0, 0]];
  }
  
  return [[minLat, minLng], [maxLat, maxLng]];
};

/**
 * Convert coordinates from one format to another
 * @param {Array} coords - Coordinate array
 * @param {string} from - Source format ('latlng' or 'lnglat')
 * @param {string} to - Target format ('latlng' or 'lnglat')
 * @returns {Array} Converted coordinates
 */
export const convertCoordinates = (coords, from = 'lnglat', to = 'latlng') => {
  if (from === to) return coords;
  
  if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
    // Single coordinate pair
    return from === 'latlng' ? [coords[1], coords[0]] : [coords[1], coords[0]];
  }
  
  // Nested coordinates
  return coords.map(coord => convertCoordinates(coord, from, to));
};