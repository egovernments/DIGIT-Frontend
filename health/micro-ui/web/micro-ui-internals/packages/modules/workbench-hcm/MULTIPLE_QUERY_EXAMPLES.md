# Multiple Query Parameters Examples

## Overview
The enhanced Elasticsearch worker now supports multiple query parameters, allowing you to search by multiple criteria simultaneously. This document provides practical examples for both Staff and Map components.

## Basic Usage

### Single Query Parameter (Backward Compatible)
```javascript
// Old way - still works
workerRef.current.postMessage({
  type: 'FETCH_ELASTICSEARCH_DATA',
  payload: {
    projectName: 'PROJECT-123',  // Single parameter
    page: 0,
    pageSize: 10000,
    origin: window.location.origin,
    batchSize: 1000,
    kibanaConfig,
    authKey: AUTH_KEY
  }
});
```

### Multiple Query Parameters (New Feature)
```javascript
// New way - multiple parameters
workerRef.current.postMessage({
  type: 'FETCH_ELASTICSEARCH_DATA',
  payload: {
    queryParams: {
      projectId: 'PROJECT-123',
      status: 'ACTIVE',
      userId: 'user-456',
      administrativeArea: 'District-1'
    },
    page: 0,
    pageSize: 10000,
    origin: window.location.origin,
    batchSize: 1000,
    kibanaConfig,
    authKey: AUTH_KEY
  }
});
```

## Staff/Employee Component Examples

### Example 1: Query by Project and Status
```javascript
const queryStaffByProjectAndStatus = (projectId, status) => {
  const queryParams = {
    projectId: projectId,
    isDeleted: status === 'ACTIVE' ? false : true
  };

  workerRef.current.postMessage({
    type: 'FETCH_ELASTICSEARCH_DATA',
    payload: {
      queryParams,
      page: 0,
      pageSize: 10000,
      origin: window.location.origin,
      batchSize: 1000,
      kibanaConfig: {
        ...projectStaffConfig,
        kibanaPath: getKibanaDetails('kibanaPath'),
        username: getKibanaDetails('username'),
        password: getKibanaDetails('password')
      },
      authKey: AUTH_KEY
    }
  });
};

// Usage
queryStaffByProjectAndStatus('PROJECT-123', 'ACTIVE');
```

### Example 2: Query by Project, User Role, and Date Range
```javascript
const queryStaffWithFilters = (projectId, userRole, startDate, endDate) => {
  const queryParams = {
    projectId: projectId,
    'additionalDetails.userRole': userRole,
    startDate: {
      gte: startDate,
      lte: endDate
    }
  };

  const kibanaConfig = {
    ...projectStaffConfig,
    fieldConfigs: {
      'additionalDetails.userRole': { queryType: 'term' },
      startDate: { queryType: 'range' }  // Special handling for date ranges
    },
    kibanaPath: getKibanaDetails('kibanaPath'),
    username: getKibanaDetails('username'),
    password: getKibanaDetails('password')
  };

  workerRef.current.postMessage({
    type: 'FETCH_ELASTICSEARCH_DATA',
    payload: {
      queryParams,
      page: 0,
      pageSize: 10000,
      origin: window.location.origin,
      batchSize: 1000,
      kibanaConfig,
      authKey: AUTH_KEY
    }
  });
};

// Usage
queryStaffWithFilters('PROJECT-123', 'SUPERVISOR', '2024-01-01', '2024-12-31');
```

## Map Component Examples

### Example 3: Query by Project and Administrative Area
```javascript
const queryMapDataByAreaAndProject = (projectName, administrativeArea, productName) => {
  const queryParams = {
    projectName: projectName,
    administrativeArea: administrativeArea,
    productName: productName
  };

  const kibanaConfig = {
    ...projectTaskConfig,
    kibanaPath: getKibanaDetails('kibanaPath'),
    username: getKibanaDetails('username'),
    password: getKibanaDetails('password')
  };

  workerRef.current.postMessage({
    type: 'FETCH_ELASTICSEARCH_DATA',
    payload: {
      queryParams,
      page: 0,
      pageSize: 10000,
      origin: window.location.origin,
      batchSize: 1000,
      kibanaConfig,
      authKey: AUTH_KEY
    }
  });
};

// Usage
queryMapDataByAreaAndProject('Malaria Campaign', 'District-North', 'ITN Nets');
```

### Example 4: Query with Wildcard Search
```javascript
const queryMapDataWithWildcard = (projectPattern, userPattern) => {
  const queryParams = {
    projectName: projectPattern,  // e.g., "Malaria*"
    userName: userPattern         // e.g., "*John*"
  };

  const kibanaConfig = {
    ...projectTaskConfig,
    fieldConfigs: {
      projectName: { queryType: 'wildcard' },
      userName: { queryType: 'wildcard' }
    },
    kibanaPath: getKibanaDetails('kibanaPath'),
    username: getKibanaDetails('username'),
    password: getKibanaDetails('password')
  };

  workerRef.current.postMessage({
    type: 'FETCH_ELASTICSEARCH_DATA',
    payload: {
      queryParams,
      page: 0,
      pageSize: 10000,
      origin: window.location.origin,
      batchSize: 1000,
      kibanaConfig,
      authKey: AUTH_KEY
    }
  });
};

// Usage
queryMapDataWithWildcard('Malaria*', '*John*');
```

## Advanced Examples

### Example 5: Multiple Values for One Field (Terms Query)
```javascript
const queryByMultipleStatuses = (projectId, statusList) => {
  const queryParams = {
    projectId: projectId,
    status: statusList  // Array: ['ACTIVE', 'PENDING', 'COMPLETED']
  };

  const kibanaConfig = {
    ...projectStaffConfig,
    fieldConfigs: {
      status: { queryType: 'terms' }  // Uses 'terms' query for arrays
    },
    kibanaPath: getKibanaDetails('kibanaPath'),
    username: getKibanaDetails('username'),
    password: getKibanaDetails('password')
  };

  workerRef.current.postMessage({
    type: 'FETCH_ELASTICSEARCH_DATA',
    payload: {
      queryParams,
      page: 0,
      pageSize: 10000,
      origin: window.location.origin,
      batchSize: 1000,
      kibanaConfig,
      authKey: AUTH_KEY
    }
  });
};

// Usage
queryByMultipleStatuses('PROJECT-123', ['ACTIVE', 'PENDING']);
```

### Example 6: Complex Query with Date Range and Multiple Conditions
```javascript
const queryComplexStaffData = (projectId, startDate, endDate, roles, isActive) => {
  const queryParams = {
    projectId: projectId,
    startDate: {
      gte: startDate
    },
    endDate: {
      lte: endDate
    },
    'additionalDetails.roles': roles,  // Array of roles
    isDeleted: !isActive
  };

  const kibanaConfig = {
    ...projectStaffConfig,
    fieldConfigs: {
      startDate: { queryType: 'range' },
      endDate: { queryType: 'range' },
      'additionalDetails.roles': { queryType: 'terms' },
      isDeleted: { queryType: 'term' }
    },
    kibanaPath: getKibanaDetails('kibanaPath'),
    username: getKibanaDetails('username'),
    password: getKibanaDetails('password')
  };

  workerRef.current.postMessage({
    type: 'FETCH_ELASTICSEARCH_DATA',
    payload: {
      queryParams,
      page: 0,
      pageSize: 10000,
      origin: window.location.origin,
      batchSize: 1000,
      kibanaConfig,
      authKey: AUTH_KEY
    }
  });
};

// Usage
queryComplexStaffData(
  'PROJECT-123', 
  '2024-01-01', 
  '2024-12-31', 
  ['SUPERVISOR', 'FIELD_WORKER'], 
  true
);
```

## Configuration Examples

### Field-Specific Query Types
```javascript
const customFieldConfig = {
  ...baseConfig,
  fieldConfigs: {
    // Exact match
    projectId: { queryType: 'term' },
    status: { queryType: 'term' },
    
    // Full-text search
    description: { queryType: 'match' },
    notes: { queryType: 'match' },
    
    // Pattern matching
    userName: { queryType: 'wildcard' },
    email: { queryType: 'wildcard' },
    
    // Multiple values
    categories: { queryType: 'terms' },
    tags: { queryType: 'terms' },
    
    // Date/number ranges
    createdDate: { queryType: 'range' },
    lastModified: { queryType: 'range' },
    priority: { queryType: 'range' }
  }
};
```

## Component Integration Examples

### Enhanced Staff Component with Multiple Filters
```javascript
const EnhancedStaffComponent = ({ projectId }) => {
  const [filters, setFilters] = useState({
    projectId: projectId,
    status: '',
    userRole: '',
    startDate: '',
    endDate: ''
  });

  const fetchStaffData = useCallback(() => {
    // Remove empty filters
    const queryParams = Object.keys(filters).reduce((acc, key) => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        acc[key] = filters[key];
      }
      return acc;
    }, {});

    // Handle date range
    if (filters.startDate && filters.endDate) {
      queryParams.startDate = {
        gte: filters.startDate,
        lte: filters.endDate
      };
      delete queryParams.endDate;
    }

    const kibanaConfig = {
      ...projectStaffConfig,
      fieldConfigs: {
        startDate: { queryType: 'range' },
        status: { queryType: 'term' },
        userRole: { queryType: 'term' }
      },
      kibanaPath: getKibanaDetails('kibanaPath'),
      username: getKibanaDetails('username'),
      password: getKibanaDetails('password')
    };

    workerRef.current.postMessage({
      type: 'FETCH_ELASTICSEARCH_DATA',
      payload: {
        queryParams,
        page: 0,
        pageSize: 10000,
        origin: window.location.origin,
        batchSize: 1000,
        kibanaConfig,
        authKey: AUTH_KEY
      }
    });
  }, [filters]);

  return (
    <div>
      {/* Filter UI */}
      <input 
        value={filters.status}
        onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))}
        placeholder="Status"
      />
      {/* More filter inputs */}
      
      <button onClick={fetchStaffData}>Search</button>
      {/* Results display */}
    </div>
  );
};
```

## Query Types Reference

| Query Type | Use Case | Example Value | Generated ES Query |
|------------|----------|---------------|-------------------|
| `term` | Exact match | `"ACTIVE"` | `{"term": {"field.keyword": "ACTIVE"}}` |
| `match` | Full-text search | `"john smith"` | `{"match": {"field": "john smith"}}` |
| `terms` | Multiple values | `["ACTIVE", "PENDING"]` | `{"terms": {"field.keyword": ["ACTIVE", "PENDING"]}}` |
| `range` | Number/date ranges | `{"gte": "2024-01-01"}` | `{"range": {"field": {"gte": "2024-01-01"}}}` |
| `wildcard` | Pattern matching | `"John*"` | `{"wildcard": {"field.keyword": "John*"}}` |

## Best Practices

1. **Filter Empty Values**: Always filter out null, undefined, or empty string values
2. **Use Appropriate Query Types**: Choose the right query type for each field
3. **Performance**: Limit the number of query parameters for better performance
4. **Date Ranges**: Use range queries for date filtering
5. **Arrays**: Use terms queries when searching for multiple values
6. **Wildcards**: Use sparingly as they can be performance-intensive

## Troubleshooting

1. **No Results**: Check if field names match your ES index structure
2. **Wrong Query Type**: Ensure you're using the correct query type for your data
3. **Date Issues**: Make sure date formats match your ES mapping
4. **Performance**: Reduce query complexity if experiencing slowdowns