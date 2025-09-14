# Dynamic Elasticsearch Usage Guide

## Overview
The Elasticsearch worker has been enhanced to support dynamic queries, indices, and output parsing. This allows different components to request different types of data with custom configurations.

## Key Features
- Dynamic index selection
- Configurable query fields and types
- Custom source field selection
- Flexible field mapping
- Support for additional filters and sorting
- Progressive data loading with batch processing

## Configuration Structure

### Basic Configuration Object
```javascript
const config = {
  index: 'your-index-name',           // Elasticsearch index
  queryField: 'fieldToQuery',         // Field to query on
  dataPrefix: 'Data',                  // Prefix for data fields (null for direct access)
  sourceFields: [...],                 // Fields to retrieve from ES
  fieldMappings: {...},               // Map ES fields to output fields
  queryType: 'term',                   // 'term' or 'match'
  sort: [...],                        // Sorting configuration
  additionalFilters: [...]            // Additional query filters
}
```

## Using Predefined Configurations

### 1. Import Configuration
```javascript
import { projectStaffConfig, projectTaskConfig } from "../configs/elasticsearchConfigs";
```

### 2. Use in Component
```javascript
const kibanaConfig = {
  kibanaPath: getKibanaDetails('kibanaPath'),
  projectTaskIndex: projectStaffConfig.index,
  username: getKibanaDetails('username'),
  password: getKibanaDetails('password'),
  ...projectStaffConfig
};
```

## Available Configurations

### Project Task Configuration (Map Data)
```javascript
projectTaskConfig = {
  index: 'od-project-task-index-v1',
  queryField: 'projectName',
  dataPrefix: 'Data',
  sourceFields: [
    "Data.geoPoint",
    "Data.@timestamp",
    "Data.productName",
    // ... more fields
  ]
}
```

### Project Staff Configuration (Employee Data)
```javascript
projectStaffConfig = {
  index: 'od-project-staff-index-v1',
  queryField: 'projectId',
  dataPrefix: null,
  fieldMappings: {
    employeeId: 'userId',
    employeeName: 'userName',
    // ... more mappings
  }
}
```

## Creating Custom Configurations

### Simple Custom Config
```javascript
import { createCustomConfig } from "../configs/elasticsearchConfigs";

const myConfig = createCustomConfig({
  index: 'my-custom-index',
  queryField: 'myField',
  sourceFields: ['field1', 'field2'],
  fieldMappings: {
    outputField1: 'sourceField1',
    outputField2: 'nested.field.path'
  }
});
```

### Complex Queries with Filters
```javascript
import { buildComplexQuery, createDateRangeFilter } from "../configs/elasticsearchConfigs";

const configWithFilters = buildComplexQuery(baseConfig, [
  createDateRangeFilter('timestamp', '2024-01-01', '2024-12-31'),
  { term: { status: 'active' } }
]);
```

## Worker Message Flow

### 1. Authentication
```javascript
workerRef.current?.postMessage({
  type: 'AUTHENTICATE_KIBANA',
  payload: { 
    origin: window.location.origin,
    kibanaConfig
  }
});
```

### 2. Data Fetching
```javascript
workerRef.current?.postMessage({
  type: 'FETCH_ELASTICSEARCH_DATA',
  payload: {
    projectName: queryValue,
    page: 0,
    pageSize: 10000,
    origin: window.location.origin,
    batchSize: 1000,
    kibanaConfig,
    authKey: AUTH_KEY
  }
});
```

### 3. Handling Responses
```javascript
workerRef.current.onmessage = (e) => {
  switch (e.data.type) {
    case 'FETCH_SUCCESS':
      const data = e.data.payload.data;
      // Process data
      break;
    case 'FETCH_PROGRESS':
      const progress = e.data.payload.progress;
      // Update progress
      break;
    case 'FETCH_ERROR':
      // Handle error
      break;
  }
};
```

## Field Mapping Examples

### Using Field Mappings
Field mappings allow you to transform Elasticsearch field names to your desired output structure:

```javascript
fieldMappings: {
  // Simple mapping
  employeeId: 'userId',
  
  // Nested field access
  latitude: 'geoLocation.lat',
  longitude: 'geoLocation.lon',
  
  // Deep nested access
  age: 'demographicData.personalInfo.age'
}
```

## Query Types

### Term Query (Exact Match)
```javascript
queryType: 'term'
// Generates: { "term": { "field.keyword": value } }
```

### Match Query (Full Text Search)
```javascript
queryType: 'match'
// Generates: { "match": { "field": value } }
```

## Sorting

Add sorting to your configuration:
```javascript
sort: [
  { "timestamp": { "order": "desc" } },
  { "score": { "order": "asc" } }
]
```

## Performance Considerations

1. **Batch Size**: Default is 1000 records per batch. Adjust based on data size:
   ```javascript
   batchSize: 500  // Smaller batches for large documents
   ```

2. **Page Size**: Total records to fetch:
   ```javascript
   pageSize: 10000  // Adjust based on expected data volume
   ```

3. **Source Fields**: Only request fields you need:
   ```javascript
   sourceFields: ['id', 'name', 'status']  // Minimal field set
   ```

## Example: Complete Component Implementation

```javascript
import { useState, useEffect, useRef } from "react";
import { elasticsearchWorkerString } from "../workers/elasticsearchWorkerString";
import { projectStaffConfig } from "../configs/elasticsearchConfigs";

const MyComponent = ({ projectId }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const workerRef = useRef(null);

  useEffect(() => {
    // Initialize worker
    const blob = new Blob([elasticsearchWorkerString], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    workerRef.current = new Worker(workerUrl);

    // Handle messages
    workerRef.current.onmessage = (e) => {
      switch (e.data.type) {
        case 'FETCH_SUCCESS':
          setData(e.data.payload.data);
          setIsLoading(false);
          break;
        case 'FETCH_START':
          setIsLoading(true);
          break;
      }
    };

    // Fetch data
    const kibanaConfig = {
      ...projectStaffConfig,
      kibanaPath: 'your-kibana-path'
    };

    workerRef.current.postMessage({
      type: 'FETCH_ELASTICSEARCH_DATA',
      payload: {
        projectName: projectId,
        page: 0,
        pageSize: 10000,
        origin: window.location.origin,
        batchSize: 1000,
        kibanaConfig,
        authKey: 'your-auth-key'
      }
    });

    return () => {
      workerRef.current?.terminate();
      URL.revokeObjectURL(workerUrl);
    };
  }, [projectId]);

  return (
    <div>
      {isLoading ? <div>Loading...</div> : <div>Data: {JSON.stringify(data)}</div>}
    </div>
  );
};
```

## Troubleshooting

1. **Authentication Issues**: Ensure kibanaPath and credentials are correct
2. **No Data Returned**: Check index name and query field
3. **Field Mapping Issues**: Verify field paths match your Elasticsearch document structure
4. **Performance Issues**: Reduce batch size or limit source fields

## Adding New Index Configurations

1. Add configuration to `elasticsearchConfigs.js`:
```javascript
export const myNewConfig = {
  index: 'my-new-index',
  queryField: 'id',
  // ... rest of config
};
```

2. Import and use in your component:
```javascript
import { myNewConfig } from "../configs/elasticsearchConfigs";
```

## Best Practices

1. Always specify only the fields you need in `sourceFields`
2. Use field mappings for consistent data structure across components
3. Implement proper error handling for failed queries
4. Show loading states during data fetching
5. Consider pagination for large datasets
6. Cache configurations if they don't change frequently