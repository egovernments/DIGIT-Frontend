/**
 * Utility functions for boundary filtering operations
 */

/**
 * Filters data array based on boundary hierarchy filters
 * @param {Array} data - Array of data objects with boundaryHierarchy property
 * @param {Object} filters - Object with filter keys and values
 * @returns {Array} Filtered data array
 */
export const applyBoundaryFilters = (data, filters) => {
  if (!data || !Array.isArray(data)) {
    return [];
  }

  if (!filters || Object.keys(filters).length === 0) {
    return data;
  }

  return data.filter(item => {
    const boundary = item.boundaryHierarchy;
    if (!boundary || typeof boundary !== 'object') {
      return false;
    }

    // Check each filter condition
    for (const [filterType, filterValue] of Object.entries(filters)) {
      if (filterValue && boundary[filterType] !== filterValue) {
        return false;
      }
    }
    
    return true;
  });
};

/**
 * Dynamically discovers all boundary field names from the data
 * @param {Array} data - Array of data objects with boundaryHierarchy property
 * @returns {Array} Array of discovered boundary field names
 */
export const discoverBoundaryFields = (data) => {
  if (!data || !Array.isArray(data)) {
    return [];
  }

  const allFields = new Set();

  // Scan all records to discover boundary fields
  data.forEach(row => {
    const boundaryHierarchy = row.boundaryHierarchy;
    if (boundaryHierarchy && typeof boundaryHierarchy === 'object') {
      Object.keys(boundaryHierarchy).forEach(field => {
        if (boundaryHierarchy[field]) { // Only include fields with values
          allFields.add(field);
        }
      });
    }
  });

  return Array.from(allFields).sort();
};

/**
 * Extracts unique boundary values from data array
 * @param {Array} data - Array of data objects with boundaryHierarchy property
 * @param {Array} boundaryTypes - Array of boundary types to extract (default: auto-discovered)
 * @returns {Object} Object with arrays of unique values for each boundary type
 */
export const extractBoundaryOptions = (data, boundaryTypes = null) => {
  if (!data || !Array.isArray(data)) {
    return {};
  }

  // Auto-discover boundary types if not provided
  const fieldsToExtract = boundaryTypes || discoverBoundaryFields(data);
  if (fieldsToExtract.length === 0) {
    return {};
  }

  const options = fieldsToExtract.reduce((acc, type) => ({ ...acc, [type]: new Set() }), {});

  // Extract boundary values from each data row
  data.forEach(row => {
    const boundaryHierarchy = row.boundaryHierarchy;
    
    if (boundaryHierarchy && typeof boundaryHierarchy === 'object') {
      fieldsToExtract.forEach(type => {
        if (boundaryHierarchy[type]) {
          options[type].add(boundaryHierarchy[type]);
        }
      });
    }
  });

  // Convert sets to sorted arrays and filter out fields with only one option
  return fieldsToExtract.reduce((acc, type) => {
    const uniqueValues = Array.from(options[type]).sort();
    // Only include fields that have more than one unique value
    if (uniqueValues.length > 1) {
      acc[type] = uniqueValues;
    }
    return acc;
  }, {});
};

/**
 * Gets statistics about boundary data distribution
 * @param {Array} data - Array of data objects with boundaryHierarchy property
 * @returns {Object} Statistics object with counts for each boundary level
 */
export const getBoundaryStats = (data) => {
  if (!data || !Array.isArray(data)) {
    return {
      totalRecords: 0,
      recordsWithBoundary: 0,
      boundaryFields: {},
      coveragePercentage: 0
    };
  }

  // Get all available boundary options (includes filtering for multiple values)
  const options = extractBoundaryOptions(data);
  
  // Get all discovered fields (includes single-value fields)
  const allFields = discoverBoundaryFields(data);
  
  const recordsWithBoundary = data.filter(row => 
    row.boundaryHierarchy && typeof row.boundaryHierarchy === 'object'
  ).length;

  // Create dynamic stats object
  const boundaryFieldStats = {};
  allFields.forEach(field => {
    // Count total unique values (even if filtered out by extractBoundaryOptions)
    const uniqueValues = new Set();
    data.forEach(row => {
      if (row.boundaryHierarchy && row.boundaryHierarchy[field]) {
        uniqueValues.add(row.boundaryHierarchy[field]);
      }
    });
    boundaryFieldStats[field] = uniqueValues.size;
  });

  return {
    totalRecords: data.length,
    recordsWithBoundary,
    boundaryFields: boundaryFieldStats,
    availableFilters: Object.keys(options), // Only fields with multiple values
    allDiscoveredFields: allFields, // All fields found in data
    coveragePercentage: data.length > 0 ? Math.round((recordsWithBoundary / data.length) * 100) : 0
  };
};

/**
 * Validates if a data object has proper boundary hierarchy structure
 * @param {Object} dataItem - Single data object to validate
 * @returns {Object} Validation result with isValid flag and missing fields
 */
export const validateBoundaryHierarchy = (dataItem) => {
  const requiredFields = ['country', 'state', 'lga', 'ward', 'healthFacility'];
  const boundary = dataItem.boundaryHierarchy;
  
  if (!boundary || typeof boundary !== 'object') {
    return {
      isValid: false,
      hasBoundary: false,
      missingFields: requiredFields,
      message: 'No boundaryHierarchy object found'
    };
  }

  const missingFields = requiredFields.filter(field => !boundary[field]);
  
  return {
    isValid: missingFields.length === 0,
    hasBoundary: true,
    missingFields,
    presentFields: requiredFields.filter(field => boundary[field]),
    message: missingFields.length > 0 ? `Missing fields: ${missingFields.join(', ')}` : 'Valid boundary hierarchy'
  };
};

/**
 * Creates a hierarchical structure from boundary data for dropdown cascading
 * @param {Array} data - Array of data objects with boundaryHierarchy property
 * @returns {Object} Nested object representing the hierarchy
 */
export const createBoundaryHierarchy = (data) => {
  if (!data || !Array.isArray(data)) {
    return {};
  }

  const hierarchy = {};

  data.forEach(row => {
    const boundary = row.boundaryHierarchy;
    if (!boundary || typeof boundary !== 'object') return;

    const { country, state, lga, ward, healthFacility } = boundary;
    if (!country) return;

    // Initialize country level
    if (!hierarchy[country]) {
      hierarchy[country] = {};
    }

    if (state) {
      // Initialize state level
      if (!hierarchy[country][state]) {
        hierarchy[country][state] = {};
      }

      if (lga) {
        // Initialize LGA level
        if (!hierarchy[country][state][lga]) {
          hierarchy[country][state][lga] = {};
        }

        if (ward) {
          // Initialize ward level
          if (!hierarchy[country][state][lga][ward]) {
            hierarchy[country][state][lga][ward] = new Set();
          }

          if (healthFacility) {
            // Add health facility
            hierarchy[country][state][lga][ward].add(healthFacility);
          }
        }
      }
    }
  });

  // Convert Sets to Arrays for health facilities
  const processHierarchy = (obj) => {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value instanceof Set) {
        result[key] = Array.from(value).sort();
      } else if (typeof value === 'object') {
        result[key] = processHierarchy(value);
      }
    }
    return result;
  };

  return processHierarchy(hierarchy);
};

/**
 * Creates a search query for Elasticsearch based on boundary filters
 * @param {Object} filters - Active boundary filters
 * @returns {Object} Elasticsearch query object
 */
export const createBoundaryElasticsearchQuery = (filters) => {
  if (!filters || Object.keys(filters).length === 0) {
    return { match_all: {} };
  }

  const conditions = [];

  Object.entries(filters).forEach(([boundaryType, value]) => {
    if (value) {
      conditions.push({
        term: {
          [`Data.boundaryHierarchy.${boundaryType}.keyword`]: value
        }
      });
    }
  });

  if (conditions.length === 0) {
    return { match_all: {} };
  } else if (conditions.length === 1) {
    return conditions[0];
  } else {
    return {
      bool: {
        must: conditions
      }
    };
  }
};