/**
 * Utility functions for generic field filtering operations
 */

/**
 * Extracts unique values for specified fields from data array
 * @param {Array} data - Array of data objects
 * @param {Array} fieldNames - Array of field names to extract options for
 * @returns {Object} Object with arrays of unique values for each field
 */
export const extractFieldOptions = (data, fieldNames = []) => {
  if (!data || !Array.isArray(data) || fieldNames.length === 0) {
    return fieldNames.reduce((acc, field) => ({ ...acc, [field]: [] }), {});
  }

  const options = fieldNames.reduce((acc, field) => ({ ...acc, [field]: new Set() }), {});

  // Extract field values from each data row
  data.forEach(row => {
    fieldNames.forEach(field => {
      const value = getNestedValue(row, field);
      if (value !== null && value !== undefined && value !== '' && value !== 'N/A') {
        options[field].add(value);
      }
    });
  });

  // Convert sets to sorted arrays and filter out fields with only one option
  return fieldNames.reduce((acc, field) => {
    const uniqueValues = Array.from(options[field]).sort();
    // Only include fields that have more than one unique value
    if (uniqueValues.length > 1) {
      acc[field] = uniqueValues;
    }
    return acc;
  }, {});
};

/**
 * Gets nested value from object using dot notation
 * @param {Object} obj - Object to get value from
 * @param {string} path - Dot notation path (e.g., 'user.profile.name')
 * @returns {any} Value at the specified path
 */
export const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
};

/**
 * Sets nested value in object using dot notation
 * @param {Object} obj - Object to set value in
 * @param {string} path - Dot notation path (e.g., 'user.profile.name')
 * @param {any} value - Value to set
 */
export const setNestedValue = (obj, path, value) => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((current, key) => {
    current[key] = current[key] || {};
    return current[key];
  }, obj);
  target[lastKey] = value;
};

/**
 * Applies generic field filters to data array
 * @param {Array} data - Array of data objects
 * @param {Object} filters - Object with field paths as keys and filter values
 * @returns {Array} Filtered data array
 */
export const applyGenericFilters = (data, filters) => {
  if (!data || !Array.isArray(data)) {
    return [];
  }

  if (!filters || Object.keys(filters).length === 0) {
    return data;
  }

  return data.filter(item => {
    // Handle text search first
    if (filters.searchText && filters.searchText.trim()) {
      const searchTerm = filters.searchText.toLowerCase().trim();
      const matchesSearch = searchInAllFields(item, searchTerm);
      if (!matchesSearch) {
        return false;
      }
    }
    
    // Check each field filter condition
    for (const [fieldPath, filterValue] of Object.entries(filters)) {
      // Skip searchText as it's handled above
      if (fieldPath === 'searchText') continue;
      
      if (filterValue) {
        const itemValue = getNestedValue(item, fieldPath);
        if (itemValue !== filterValue) {
          return false;
        }
      }
    }
    
    return true;
  });
};

/**
 * Discovers all available field paths in data array up to specified depth
 * @param {Array} data - Array of data objects
 * @param {number} maxDepth - Maximum depth to traverse (default: 2)
 * @param {Array} excludePaths - Paths to exclude from discovery
 * @returns {Array} Array of discovered field paths
 */
export const discoverFields = (data, maxDepth = 2, excludePaths = ['boundaryHierarchy']) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return [];
  }

  const fieldPaths = new Set();

  const traverseObject = (obj, currentPath = '', depth = 0) => {
    if (depth >= maxDepth || typeof obj !== 'object' || obj === null) {
      return;
    }

    Object.keys(obj).forEach(key => {
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      
      // Skip excluded paths
      if (excludePaths.some(excluded => newPath.startsWith(excluded))) {
        return;
      }

      const value = obj[key];
      
      if (value !== null && value !== undefined) {
        // Add primitive values and arrays as potential filter fields
        if (typeof value !== 'object' || Array.isArray(value)) {
          fieldPaths.add(newPath);
        } else {
          // Continue traversing nested objects
          traverseObject(value, newPath, depth + 1);
        }
      }
    });
  };

  // Sample first few records to discover field structure
  const sampleSize = Math.min(10, data.length);
  for (let i = 0; i < sampleSize; i++) {
    traverseObject(data[i]);
  }

  return Array.from(fieldPaths).sort();
};

/**
 * Gets statistics about generic field data distribution
 * @param {Array} data - Array of data objects
 * @param {Array} fieldNames - Array of field names to analyze
 * @returns {Object} Statistics object with counts for each field
 */
export const getGenericFieldStats = (data, fieldNames = []) => {
  if (!data || !Array.isArray(data) || fieldNames.length === 0) {
    return {
      totalRecords: 0,
      fieldStats: {},
      availableFilters: [],
      allFieldNames: fieldNames
    };
  }

  const options = extractFieldOptions(data, fieldNames);
  
  // Count records with non-null values for each field
  const fieldStats = {};
  fieldNames.forEach(field => {
    const recordsWithField = data.filter(row => {
      const value = getNestedValue(row, field);
      return value !== null && value !== undefined && value !== '' && value !== 'N/A';
    }).length;
    
    fieldStats[field] = {
      recordsWithValue: recordsWithField,
      uniqueValues: options[field] ? options[field].length : 0,
      coveragePercentage: data.length > 0 ? Math.round((recordsWithField / data.length) * 100) : 0
    };
  });

  return {
    totalRecords: data.length,
    fieldStats,
    availableFilters: Object.keys(options), // Only fields with multiple values
    allFieldNames: fieldNames
  };
};

/**
 * Generates human-readable label from field path
 * @param {string} fieldPath - Field path (e.g., 'user.profile.firstName')
 * @returns {string} Human-readable label
 */
export const generateFieldLabel = (fieldPath) => {
  // Take the last part of the path and format it
  const fieldName = fieldPath.split('.').pop();
  
  return fieldName
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/[_-]/g, ' ') // Replace underscores and hyphens with spaces
    .replace(/\b\w/g, char => char.toUpperCase()) // Capitalize first letter of each word
    .trim();
};

/**
 * Validates field paths against data structure
 * @param {Array} data - Array of data objects
 * @param {Array} fieldPaths - Array of field paths to validate
 * @returns {Object} Validation result with valid and invalid paths
 */
export const validateFieldPaths = (data, fieldPaths) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return { valid: [], invalid: fieldPaths };
  }

  const valid = [];
  const invalid = [];

  fieldPaths.forEach(path => {
    // Check if field exists in at least one record
    const exists = data.some(row => {
      const value = getNestedValue(row, path);
      return value !== null && value !== undefined;
    });

    if (exists) {
      valid.push(path);
    } else {
      invalid.push(path);
    }
  });

  return { valid, invalid };
};

/**
 * Creates a compound filter query for complex filtering scenarios
 * @param {Object} filters - Object with filter configurations
 * @returns {Function} Filter function that can be applied to data
 */
export const createCompoundFilter = (filters) => {
  return (item) => {
    for (const [fieldPath, config] of Object.entries(filters)) {
      const itemValue = getNestedValue(item, fieldPath);
      
      if (typeof config === 'string' || typeof config === 'number') {
        // Simple equality filter
        if (itemValue !== config) return false;
      } else if (typeof config === 'object') {
        // Complex filter with operators
        const { operator, value, values } = config;
        
        switch (operator) {
          case 'equals':
            if (itemValue !== value) return false;
            break;
          case 'contains':
            if (!itemValue || !itemValue.toString().toLowerCase().includes(value.toLowerCase())) return false;
            break;
          case 'in':
            if (!values || !values.includes(itemValue)) return false;
            break;
          case 'range':
            const { min, max } = value;
            const numValue = Number(itemValue);
            if (isNaN(numValue) || (min !== undefined && numValue < min) || (max !== undefined && numValue > max)) return false;
            break;
          default:
            if (itemValue !== value) return false;
        }
      }
    }
    return true;
  };
};

/**
 * Searches for a term in all fields of an object (including nested objects)
 * @param {Object} obj - Object to search in
 * @param {string} searchTerm - Term to search for (should be lowercase)
 * @returns {boolean} True if search term is found anywhere in the object
 */
export const searchInAllFields = (obj, searchTerm) => {
  if (!obj || !searchTerm) return false;
  
  // Convert object to a flat string representation of all values
  const getAllValues = (object, visited = new Set()) => {
    // Prevent circular references
    if (visited.has(object)) return [];
    visited.add(object);
    
    const values = [];
    
    for (const [key, value] of Object.entries(object)) {
      if (value === null || value === undefined) continue;
      
      if (typeof value === 'object' && !Array.isArray(value)) {
        // Recursively get values from nested objects
        values.push(...getAllValues(value, visited));
      } else if (Array.isArray(value)) {
        // Handle arrays
        value.forEach(item => {
          if (typeof item === 'object') {
            values.push(...getAllValues(item, visited));
          } else {
            values.push(String(item).toLowerCase());
          }
        });
      } else {
        // Convert primitive values to strings
        values.push(String(value).toLowerCase());
      }
    }
    
    return values;
  };
  
  const allValues = getAllValues(obj);
  return allValues.some(value => value.includes(searchTerm));
};