/**
 * Utility functions for generic field filtering operations
 */

export const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
};

export const extractFieldOptions = (data, fieldNames = []) => {
  if (!data || !Array.isArray(data) || fieldNames.length === 0) {
    return fieldNames.reduce((acc, field) => ({ ...acc, [field]: [] }), {});
  }
  const options = fieldNames.reduce((acc, field) => ({ ...acc, [field]: new Set() }), {});
  data.forEach(row => {
    fieldNames.forEach(field => {
      const value = getNestedValue(row, field);
      if (value !== null && value !== undefined && value !== '' && value !== 'N/A') {
        options[field].add(value);
      }
    });
  });
  return fieldNames.reduce((acc, field) => {
    const uniqueValues = Array.from(options[field]).sort();
    if (uniqueValues.length > 1) acc[field] = uniqueValues;
    return acc;
  }, {});
};

export const applyGenericFilters = (data, filters) => {
  if (!data || !Array.isArray(data)) return [];
  if (!filters || Object.keys(filters).length === 0) return data;
  return data.filter(item => {
    if (filters.searchText && filters.searchText.trim()) {
      const searchTerm = filters.searchText.toLowerCase().trim();
      if (!searchInAllFields(item, searchTerm)) return false;
    }
    for (const [fieldPath, filterValue] of Object.entries(filters)) {
      if (fieldPath === 'searchText') continue;
      if (filterValue) {
        const itemValue = getNestedValue(item, fieldPath);
        if (itemValue !== filterValue) return false;
      }
    }
    return true;
  });
};

export const getGenericFieldStats = (data, fieldNames = []) => {
  if (!data || !Array.isArray(data) || fieldNames.length === 0) {
    return { totalRecords: 0, fieldStats: {}, availableFilters: [], allFieldNames: fieldNames };
  }
  const options = extractFieldOptions(data, fieldNames);
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
  return { totalRecords: data.length, fieldStats, availableFilters: Object.keys(options), allFieldNames: fieldNames };
};

export const validateFieldPaths = (data, fieldPaths) => {
  if (!data || !Array.isArray(data) || data.length === 0) return { valid: [], invalid: fieldPaths };
  const valid = [];
  const invalid = [];
  fieldPaths.forEach(path => {
    const exists = data.some(row => {
      const value = getNestedValue(row, path);
      return value !== null && value !== undefined;
    });
    if (exists) valid.push(path);
    else invalid.push(path);
  });
  return { valid, invalid };
};

export const searchInAllFields = (obj, searchTerm) => {
  if (!obj || !searchTerm) return false;
  const getAllValues = (object, visited = new Set()) => {
    if (visited.has(object)) return [];
    visited.add(object);
    const values = [];
    for (const [key, value] of Object.entries(object)) {
      if (value === null || value === undefined) continue;
      if (typeof value === 'object' && !Array.isArray(value)) {
        values.push(...getAllValues(value, visited));
      } else if (Array.isArray(value)) {
        value.forEach(item => {
          if (typeof item === 'object') values.push(...getAllValues(item, visited));
          else values.push(String(item).toLowerCase());
        });
      } else {
        values.push(String(value).toLowerCase());
      }
    }
    return values;
  };
  const allValues = getAllValues(obj);
  return allValues.some(value => value.includes(searchTerm));
};
