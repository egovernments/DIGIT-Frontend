# Staff Component Multiple Query Parameters Examples

Based on your actual staff index data structure with fields like `boundaryHierarchy`, `role`, `projectType`, etc.

## Staff Data Structure
```json
{
  "boundaryHierarchy": {
    "country": "NIGERIA",
    "lga": "AKOKO NORTH WEST",
    "ward": "AJOWA/IGASI/GEDEGEDE",
    "state": "ONDO",
    "healthFacility": "OLURO PALACE (AJOWA/IGASI/GEDEGEDE )"
  },
  "role": "HEALTH_FACILITY_SUPERVISOR",
  "projectType": "LLIN",
  "localityCode": "OD_01_02_02_16_OLURO_PALACE__A",
  "nameOfUser": "Lateef Rita",
  "userName": "IT-OND-DHS-0118",
  "userId": "d232dca0-cdf9-4028-aa62-245623035675",
  "projectTypeId": "a6907f0c-7a91-4c76-afc2-a279d8a7b76a",
  "isDeleted": false,
  "createdBy": "47cb4ca0-a9e2-409c-a189-592615f72d4e",
  "createdTime": 1757230885778,
  "id": "PTS-2025-09-07-063113",
  "projectId": "dab470a8-3e71-42fd-9bf1-ac51145eb51b"
}
```

## Example 1: Basic Multiple Query Parameters

### Query by Project, Role, and State
```javascript
const queryStaffByMultipleFields = () => {
  const queryParams = {
    projectId: "dab470a8-3e71-42fd-9bf1-ac51145eb51b",
    role: "HEALTH_FACILITY_SUPERVISOR",
    "boundaryHierarchy.state": "ONDO",
    isDeleted: false
  };

  workerRef.current.postMessage({
    type: 'FETCH_ELASTICSEARCH_DATA',
    payload: {
      queryParams,
      page: 0,
      pageSize: 1000,
      origin: window.location.origin,
      batchSize: 500,
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
```

### Generated Elasticsearch Query
```json
{
  "query": {
    "bool": {
      "must": [
        { "term": { "projectId.keyword": "dab470a8-3e71-42fd-9bf1-ac51145eb51b" } },
        { "term": { "role.keyword": "HEALTH_FACILITY_SUPERVISOR" } },
        { "term": { "boundaryHierarchy.state.keyword": "ONDO" } },
        { "term": { "isDeleted": false } }
      ]
    }
  }
}
```

## Example 2: Query by Geographic Hierarchy

### Query by State, LGA, and Ward
```javascript
const queryStaffByGeography = () => {
  const queryParams = {
    "boundaryHierarchy.country": "NIGERIA",
    "boundaryHierarchy.state": "ONDO", 
    "boundaryHierarchy.lga": "AKOKO NORTH WEST",
    "boundaryHierarchy.ward": "AJOWA/IGASI/GEDEGEDE"
  };

  workerRef.current.postMessage({
    type: 'FETCH_ELASTICSEARCH_DATA',
    payload: {
      queryParams,
      page: 0,
      pageSize: 1000,
      origin: window.location.origin,
      batchSize: 500,
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
```

## Example 3: Query with Partial Health Facility Name

### Using Match Query for Health Facility
```javascript
const queryStaffByFacilityName = () => {
  const queryParams = {
    "boundaryHierarchy.healthFacility": "OLURO PALACE",  // Partial name
    projectType: "LLIN",
    isDeleted: false
  };

  const kibanaConfig = {
    ...projectStaffConfig,
    fieldConfigs: {
      ...projectStaffConfig.fieldConfigs,
      "boundaryHierarchy.healthFacility": { queryType: "match" }  // Use match for partial searches
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
      pageSize: 1000,
      origin: window.location.origin,
      batchSize: 500,
      kibanaConfig,
      authKey: AUTH_KEY
    }
  });
};
```

## Example 4: Query by Date Range

### Query Staff Created in a Date Range
```javascript
const queryStaffByDateRange = () => {
  const queryParams = {
    projectId: "dab470a8-3e71-42fd-9bf1-ac51145eb51b",
    createdTime: {
      gte: 1725667200000,  // September 1, 2024
      lte: 1757203200000   // September 1, 2025
    },
    isDeleted: false
  };

  workerRef.current.postMessage({
    type: 'FETCH_ELASTICSEARCH_DATA',
    payload: {
      queryParams,
      page: 0,
      pageSize: 1000,
      origin: window.location.origin,
      batchSize: 500,
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
```

## Example 5: Query by Multiple Roles (Terms Query)

### Query Staff with Multiple Roles
```javascript
const queryStaffByMultipleRoles = () => {
  const queryParams = {
    projectId: "dab470a8-3e71-42fd-9bf1-ac51145eb51b",
    role: ["HEALTH_FACILITY_SUPERVISOR", "FIELD_COORDINATOR", "DATA_COLLECTOR"]  // Array for multiple values
  };

  const kibanaConfig = {
    ...projectStaffConfig,
    fieldConfigs: {
      ...projectStaffConfig.fieldConfigs,
      role: { queryType: "terms" }  // Use terms for multiple values
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
      pageSize: 1000,
      origin: window.location.origin,
      batchSize: 500,
      kibanaConfig,
      authKey: AUTH_KEY
    }
  });
};
```

## Example 6: Complex Query with User Name Pattern

### Query with Wildcard User Name Search
```javascript
const queryStaffByUserPattern = () => {
  const queryParams = {
    projectId: "dab470a8-3e71-42fd-9bf1-ac51145eb51b",
    userName: "IT-OND-DHS-*",  // Wildcard pattern
    "boundaryHierarchy.state": "ONDO",
    isDeleted: false
  };

  const kibanaConfig = {
    ...projectStaffConfig,
    fieldConfigs: {
      ...projectStaffConfig.fieldConfigs,
      userName: { queryType: "wildcard" }  // Use wildcard for pattern matching
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
      pageSize: 1000,
      origin: window.location.origin,
      batchSize: 500,
      kibanaConfig,
      authKey: AUTH_KEY
    }
  });
};
```

## Example 7: Updated EmployeesComponent with Multiple Query Parameters

```javascript
const EmployeesComponent = ({ projectId }) => {
  const [filters, setFilters] = useState({
    projectId: projectId,
    role: '',
    state: '',
    lga: '',
    projectType: '',
    isDeleted: false
  });

  const executeQuery = () => {
    // Remove empty filters
    const queryParams = Object.keys(filters).reduce((acc, key) => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        if (key === 'state') {
          acc['boundaryHierarchy.state'] = filters[key];
        } else if (key === 'lga') {
          acc['boundaryHierarchy.lga'] = filters[key];
        } else {
          acc[key] = filters[key];
        }
      }
      return acc;
    }, {});

    const kibanaConfig = {
      ...projectStaffConfig,
      kibanaPath: getKibanaDetails('kibanaPath'),
      username: getKibanaDetails('username'),
      password: getKibanaDetails('password')
    };

    workerRef.current.postMessage({
      type: 'FETCH_ELASTICSEARCH_DATA',
      payload: {
        queryParams,
        page: 0,
        pageSize: 1000,
        origin: window.location.origin,
        batchSize: 500,
        kibanaConfig,
        authKey: AUTH_KEY
      }
    });
  };

  return (
    <div>
      {/* Filter UI */}
      <select value={filters.role} onChange={(e) => setFilters(prev => ({...prev, role: e.target.value}))}>
        <option value="">All Roles</option>
        <option value="HEALTH_FACILITY_SUPERVISOR">Health Facility Supervisor</option>
        <option value="FIELD_COORDINATOR">Field Coordinator</option>
        <option value="DATA_COLLECTOR">Data Collector</option>
      </select>
      
      <select value={filters.state} onChange={(e) => setFilters(prev => ({...prev, state: e.target.value}))}>
        <option value="">All States</option>
        <option value="ONDO">Ondo</option>
        <option value="LAGOS">Lagos</option>
        {/* More states */}
      </select>
      
      <button onClick={executeQuery}>Search</button>
      {/* Results display */}
    </div>
  );
};
```

## Field Query Type Reference for Staff Data

| Field | Query Type | Example | Use Case |
|-------|------------|---------|----------|
| `projectId` | `term` | `"dab470a8-3e71-..."` | Exact project match |
| `role` | `term` or `terms` | `"HEALTH_FACILITY_SUPERVISOR"` | Exact role match |
| `projectType` | `term` | `"LLIN"` | Exact project type |
| `nameOfUser` | `match` | `"Lateef Rita"` | Name search |
| `userName` | `wildcard` | `"IT-OND-*"` | Pattern matching |
| `boundaryHierarchy.state` | `term` | `"ONDO"` | Exact state match |
| `boundaryHierarchy.lga` | `term` | `"AKOKO NORTH WEST"` | Exact LGA match |
| `boundaryHierarchy.healthFacility` | `match` | `"OLURO PALACE"` | Facility name search |
| `createdTime` | `range` | `{"gte": 1725667200000}` | Date range |
| `isDeleted` | `term` | `false` | Boolean match |

## Testing Multiple Queries

### Test Script for Different Query Combinations
```javascript
// Test 1: Geographic filtering
queryParams = {
  "boundaryHierarchy.state": "ONDO",
  "boundaryHierarchy.lga": "AKOKO NORTH WEST"
};

// Test 2: Role and project type
queryParams = {
  role: "HEALTH_FACILITY_SUPERVISOR",
  projectType: "LLIN"
};

// Test 3: Date range with role
queryParams = {
  role: "HEALTH_FACILITY_SUPERVISOR",
  createdTime: {
    gte: 1725667200000,
    lte: 1757203200000
  }
};

// Test 4: Multiple roles and specific project
queryParams = {
  projectId: "dab470a8-3e71-42fd-9bf1-ac51145eb51b",
  role: ["HEALTH_FACILITY_SUPERVISOR", "FIELD_COORDINATOR"],
  isDeleted: false
};
```

This approach allows you to combine any of these fields to create precise queries for your staff data, enabling powerful filtering capabilities in both the Staff and Employee components.