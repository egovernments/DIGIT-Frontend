/**
 * Utility functions for boundary filtering operations
 */

export const applyBoundaryFilters = (data, filters) => {
  if (!data || !Array.isArray(data)) return [];
  if (!filters || Object.keys(filters).length === 0) return data;

  return data.filter(item => {
    const boundary = item.boundaryHierarchy;
    if (!boundary || typeof boundary !== 'object') return false;
    for (const [filterType, filterValue] of Object.entries(filters)) {
      if (filterValue && boundary[filterType] !== filterValue) return false;
    }
    return true;
  });
};

export const discoverBoundaryFields = (data) => {
  if (!data || !Array.isArray(data)) return [];
  const allFields = new Set();
  data.forEach(row => {
    const boundaryHierarchy = row.boundaryHierarchy;
    if (boundaryHierarchy && typeof boundaryHierarchy === 'object') {
      Object.keys(boundaryHierarchy).forEach(field => {
        if (boundaryHierarchy[field]) allFields.add(field);
      });
    }
  });
  return Array.from(allFields).sort();
};

export const extractBoundaryOptions = (data, boundaryTypes = null) => {
  if (!data || !Array.isArray(data)) return {};
  const fieldsToExtract = boundaryTypes || discoverBoundaryFields(data);
  if (fieldsToExtract.length === 0) return {};

  const options = fieldsToExtract.reduce((acc, type) => ({ ...acc, [type]: new Set() }), {});
  data.forEach(row => {
    const boundaryHierarchy = row.boundaryHierarchy;
    if (boundaryHierarchy && typeof boundaryHierarchy === 'object') {
      fieldsToExtract.forEach(type => {
        if (boundaryHierarchy[type]) options[type].add(boundaryHierarchy[type]);
      });
    }
  });

  return fieldsToExtract.reduce((acc, type) => {
    const uniqueValues = Array.from(options[type]).sort();
    if (uniqueValues.length > 1) acc[type] = uniqueValues;
    return acc;
  }, {});
};

export const getBoundaryStats = (data) => {
  if (!data || !Array.isArray(data)) {
    return { totalRecords: 0, recordsWithBoundary: 0, boundaryFields: {}, coveragePercentage: 0 };
  }

  const options = extractBoundaryOptions(data);
  const allFields = discoverBoundaryFields(data);
  const recordsWithBoundary = data.filter(row =>
    row.boundaryHierarchy && typeof row.boundaryHierarchy === 'object'
  ).length;

  const boundaryFieldStats = {};
  allFields.forEach(field => {
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
    availableFilters: Object.keys(options),
    allDiscoveredFields: allFields,
    coveragePercentage: data.length > 0 ? Math.round((recordsWithBoundary / data.length) * 100) : 0
  };
};

export const createBoundaryElasticsearchQuery = (filters) => {
  if (!filters || Object.keys(filters).length === 0) return { match_all: {} };
  const conditions = [];
  Object.entries(filters).forEach(([boundaryType, value]) => {
    if (value) {
      conditions.push({ term: { [`Data.boundaryHierarchy.${boundaryType}.keyword`]: value } });
    }
  });
  if (conditions.length === 0) return { match_all: {} };
  if (conditions.length === 1) return conditions[0];
  return { bool: { must: conditions } };
};
