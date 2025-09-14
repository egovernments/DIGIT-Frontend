/**
 * Elasticsearch configuration objects for different data types
 * These configurations can be used with the elasticsearchWorker for dynamic queries
 */

// Configuration for Project Task data (Map Component)
export const projectTaskConfig = {
  index: 'od-project-task-index-v1',
  queryField: 'projectName',
  dataPrefix: 'Data',
  sourceFields: [
    "Data.geoPoint",
    "Data.@timestamp", 
    "Data.productName",
    "Data.memberCount",
    "Data.administrativeArea",
    "Data.quantity",
    "Data.userName",
    "Data.userId"
  ],
  // Field mappings for standardized output
  fieldMappings: null, // Uses default mapping
  queryType: 'term', // 'term' or 'match'
  // Field-specific query configurations
  fieldConfigs: {
    projectName: { queryType: 'term' },
    productName: { queryType: 'match' },  // Allow partial product name searches
    administrativeArea: { queryType: 'term' },
    userName: { queryType: 'wildcard' },  // Pattern matching for names
    userId: { queryType: 'term' },
    '@timestamp': { queryType: 'range' },  // Date range queries
    quantity: { queryType: 'range' },      // Numeric range queries
    memberCount: { queryType: 'range' }    // Numeric range queries
  },
  sort: [
    { "Data.@timestamp": { "order": "desc" } }
  ],
  additionalFilters: null
};

// Configuration for Project Staff/Employees data
export const projectStaffConfig = {
  index: 'od-project-staff-index-v1',
  queryField: 'projectId',
  dataPrefix: 'Data', // Use Data prefix for source fields
  sourceFields: [
    "Data.id",
    "Data.userId",
    "Data.userName",
    "Data.nameOfUser",
    "Data.role",
    "Data.projectType",
    "Data.projectTypeId",
    "Data.localityCode",
    "Data.boundaryHierarchy",
    "Data.isDeleted",
    "Data.createdBy",
    "Data.createdTime",
    "Data.projectId"
  ],
  // Custom field mappings based on actual data structure
  fieldMappings: {
    employeeId: 'id',
    employeeName: 'nameOfUser',
    userName: 'userName',
    userId: 'userId',
    role: 'role',
    projectType: 'projectType',
    localityCode: 'localityCode',
    status: 'isDeleted',
    country: 'boundaryHierarchy.country',
    state: 'boundaryHierarchy.state',
    lga: 'boundaryHierarchy.lga',
    ward: 'boundaryHierarchy.ward',
    healthFacility: 'boundaryHierarchy.healthFacility',
    createdTime: 'createdTime',
    createdBy: 'createdBy'
  },
  queryType: 'term',
  // Field-specific query configurations based on actual data structure
  fieldConfigs: {
    projectId: { queryType: 'term' },
    userId: { queryType: 'term' },
    userName: { queryType: 'term' },  // Exact match for structured usernames
    nameOfUser: { queryType: 'match' },  // Allow partial name searches
    role: { queryType: 'term' },
    projectType: { queryType: 'term' },
    projectTypeId: { queryType: 'term' },
    localityCode: { queryType: 'term' },
    isDeleted: { queryType: 'term' },
    // Boundary hierarchy fields (these will be prefixed with Data. automatically)
    'boundaryHierarchy.country': { queryType: 'term' },
    'boundaryHierarchy.state': { queryType: 'term' },
    'boundaryHierarchy.lga': { queryType: 'term' },
    'boundaryHierarchy.ward': { queryType: 'term' },
    'boundaryHierarchy.healthFacility': { queryType: 'match' },  // Allow partial facility name searches
    // Date range for creation time
    createdTime: { queryType: 'range' },
    createdBy: { queryType: 'term' }
  },
  sort: [
    // { "createdTime": { "order": "desc" } }
  ],
  additionalFilters: null
};

// Configuration for Facility data
export const facilityConfig = {
  index: 'od-facility-index-v1',
  queryField: 'projectId',
  dataPrefix: 'Data',
  sourceFields: [
    "Data.facilityId",
    "Data.facilityName",
    "Data.facilityType",
    "Data.address",
    "Data.geoLocation",
    "Data.capacity",
    "Data.operatingHours",
    "Data.contact"
  ],
  fieldMappings: {
    facilityId: 'facilityId',
    facilityName: 'facilityName',
    facilityType: 'facilityType',
    address: 'address',
    latitude: 'geoLocation.lat',
    longitude: 'geoLocation.lon',
    capacity: 'capacity',
    operatingHours: 'operatingHours',
    contactNumber: 'contact.phone',
    contactEmail: 'contact.email'
  },
  queryType: 'term',
  sort: null,
  additionalFilters: null
};

// Configuration for Stock/Inventory data
export const stockConfig = {
  index: 'od-stock-index-v1',
  queryField: 'projectId',
  dataPrefix: 'Data',
  sourceFields: [
    "Data.stockId",
    "Data.productId",
    "Data.productName",
    "Data.quantity",
    "Data.warehouse",
    "Data.lastUpdated",
    "Data.status"
  ],
  fieldMappings: {
    stockId: 'stockId',
    productId: 'productId',
    productName: 'productName',
    quantity: 'quantity',
    warehouse: 'warehouse',
    lastUpdated: 'lastUpdated',
    status: 'status'
  },
  queryType: 'term',
  sort: [
    { "Data.lastUpdated": { "order": "desc" } }
  ],
  additionalFilters: null
};

// Configuration for Beneficiary data
export const beneficiaryConfig = {
  index: 'od-beneficiary-index-v1',
  queryField: 'projectId',
  dataPrefix: 'Data',
  sourceFields: [
    "Data.beneficiaryId",
    "Data.beneficiaryName",
    "Data.beneficiaryType",
    "Data.registrationDate",
    "Data.status",
    "Data.demographicData",
    "Data.contactInfo"
  ],
  fieldMappings: {
    beneficiaryId: 'beneficiaryId',
    beneficiaryName: 'beneficiaryName',
    beneficiaryType: 'beneficiaryType',
    registrationDate: 'registrationDate',
    status: 'status',
    age: 'demographicData.age',
    gender: 'demographicData.gender',
    phoneNumber: 'contactInfo.phone',
    address: 'contactInfo.address'
  },
  queryType: 'term',
  sort: [
    { "Data.registrationDate": { "order": "desc" } }
  ],
  additionalFilters: null
};

// Function to create custom query configuration
export const createCustomConfig = (options) => {
  const {
    index,
    queryField,
    dataPrefix = 'Data',
    sourceFields = [],
    fieldMappings = null,
    queryType = 'term',
    sort = null,
    additionalFilters = null,
    customQuery = null
  } = options;

  return {
    index,
    queryField,
    dataPrefix,
    sourceFields,
    fieldMappings,
    queryType,
    sort,
    additionalFilters,
    customQuery
  };
};

// Function to build complex Elasticsearch queries
export const buildComplexQuery = (baseConfig, additionalConditions) => {
  return {
    ...baseConfig,
    additionalFilters: [
      ...(baseConfig.additionalFilters || []),
      ...additionalConditions
    ]
  };
};

// Example of a date range filter
export const createDateRangeFilter = (field, startDate, endDate) => {
  const filter = {
    range: {
      [field]: {}
    }
  };
  
  if (startDate) {
    filter.range[field].gte = startDate;
  }
  
  if (endDate) {
    filter.range[field].lte = endDate;
  }
  
  return filter;
};

// Example of a terms filter for multiple values
export const createTermsFilter = (field, values) => {
  return {
    terms: {
      [field]: values
    }
  };
};

// Example of a wildcard filter
export const createWildcardFilter = (field, pattern) => {
  return {
    wildcard: {
      [field]: pattern
    }
  };
};

// Export all configurations
export default {
  projectTaskConfig,
  projectStaffConfig,
  facilityConfig,
  stockConfig,
  beneficiaryConfig,
  createCustomConfig,
  buildComplexQuery,
  createDateRangeFilter,
  createTermsFilter,
  createWildcardFilter
};