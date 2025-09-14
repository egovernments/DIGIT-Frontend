import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Header, Button } from "@egovernments/digit-ui-react-components";
import { getKibanaDetails } from "../utils/getProjectServiceUrl";
import { elasticsearchWorkerString } from "../workers/elasticsearchWorkerString";
import { projectStaffConfig, projectTaskConfig } from "../configs/elasticsearchConfigs";

/**
 * Example component demonstrating multiple query parameters
 * Shows how to query both Staff and Map data with multiple criteria
 */
const MultiQueryExample = ({ projectId }) => {
  const { t } = useTranslation();
  const [staffData, setStaffData] = useState([]);
  const [mapData, setMapData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const workerRef = useRef(null);
  
  // Filter states
  const [staffFilters, setStaffFilters] = useState({
    projectId: projectId,
    isDeleted: false,
    userName: '',
    userRole: ''
  });
  
  const [mapFilters, setMapFilters] = useState({
    projectName: '',
    administrativeArea: '',
    productName: '',
    minQuantity: '',
    maxQuantity: ''
  });

  useEffect(() => {
    // Initialize worker
    const blob = new Blob([elasticsearchWorkerString], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    workerRef.current = new Worker(workerUrl);

    workerRef.current.onmessage = (e) => {
      const { type, payload } = e.data;
      
      switch (type) {
        case 'FETCH_SUCCESS':
          // Determine which query this response is for based on payload
          if (payload.queryType === 'staff') {
            setStaffData(payload.data);
          } else if (payload.queryType === 'map') {
            setMapData(payload.data);
          }
          setIsLoading(false);
          break;
        case 'FETCH_START':
          setIsLoading(true);
          break;
        case 'FETCH_ERROR':
          console.error('Fetch error:', payload);
          setIsLoading(false);
          break;
      }
    };

    return () => {
      workerRef.current?.terminate();
      URL.revokeObjectURL(workerUrl);
    };
  }, []);

  // Query staff data with multiple parameters
  const queryStaffData = () => {
    const queryParams = {};
    
    // Add non-empty filter values
    if (staffFilters.projectId) queryParams.projectId = staffFilters.projectId;
    if (typeof staffFilters.isDeleted === 'boolean') queryParams.isDeleted = staffFilters.isDeleted;
    if (staffFilters.userName) queryParams.userName = staffFilters.userName;
    if (staffFilters.userRole) queryParams['additionalDetails.userRole'] = staffFilters.userRole;

    const kibanaConfig = {
      ...projectStaffConfig,
      kibanaPath: getKibanaDetails('kibanaPath'),
      username: getKibanaDetails('username'),
      password: getKibanaDetails('password')
    };

    const username = getKibanaDetails('BasicUsername');
    const password = getKibanaDetails('BasicPassword');
    const auth = btoa(`${username}:${password}`);
    const API_TOKEN = getKibanaDetails('token');
    const AUTH_KEY = getKibanaDetails('sendBasicAuthHeader') ? `Basic ${auth}` : `ApiKey ${API_TOKEN}`;

    workerRef.current?.postMessage({
      type: 'FETCH_ELASTICSEARCH_DATA',
      payload: {
        queryParams,
        page: 0,
        pageSize: 1000,
        origin: window.location.origin,
        batchSize: 500,
        kibanaConfig: {
          ...kibanaConfig,
          queryType: 'staff'  // Mark query type for response handling
        },
        authKey: AUTH_KEY
      }
    });
  };

  // Query map data with multiple parameters
  const queryMapData = () => {
    const queryParams = {};
    
    // Add non-empty filter values
    if (mapFilters.projectName) queryParams.projectName = mapFilters.projectName;
    if (mapFilters.administrativeArea) queryParams.administrativeArea = mapFilters.administrativeArea;
    if (mapFilters.productName) queryParams.productName = mapFilters.productName;
    
    // Handle quantity range
    if (mapFilters.minQuantity || mapFilters.maxQuantity) {
      queryParams.quantity = {};
      if (mapFilters.minQuantity) queryParams.quantity.gte = parseFloat(mapFilters.minQuantity);
      if (mapFilters.maxQuantity) queryParams.quantity.lte = parseFloat(mapFilters.maxQuantity);
    }

    const kibanaConfig = {
      ...projectTaskConfig,
      kibanaPath: getKibanaDetails('kibanaPath'),
      username: getKibanaDetails('username'),
      password: getKibanaDetails('password')
    };

    const username = getKibanaDetails('BasicUsername');
    const password = getKibanaDetails('BasicPassword');
    const auth = btoa(`${username}:${password}`);
    const API_TOKEN = getKibanaDetails('token');
    const AUTH_KEY = getKibanaDetails('sendBasicAuthHeader') ? `Basic ${auth}` : `ApiKey ${API_TOKEN}`;

    workerRef.current?.postMessage({
      type: 'FETCH_ELASTICSEARCH_DATA',
      payload: {
        queryParams,
        page: 0,
        pageSize: 1000,
        origin: window.location.origin,
        batchSize: 500,
        kibanaConfig: {
          ...kibanaConfig,
          queryType: 'map'  // Mark query type for response handling
        },
        authKey: AUTH_KEY
      }
    });
  };

  // Query with complex conditions (staff with date range and multiple roles)
  const queryComplexStaffData = () => {
    const queryParams = {
      projectId: projectId,
      startDate: {
        gte: '2024-01-01',
        lte: '2024-12-31'
      },
      'additionalDetails.skills': ['SUPERVISION', 'DATA_COLLECTION', 'TRAINING'],  // Multiple skills
      isDeleted: false
    };

    const kibanaConfig = {
      ...projectStaffConfig,
      kibanaPath: getKibanaDetails('kibanaPath'),
      username: getKibanaDetails('username'),
      password: getKibanaDetails('password')
    };

    const username = getKibanaDetails('BasicUsername');
    const password = getKibanaDetails('BasicPassword');
    const auth = btoa(`${username}:${password}`);
    const API_TOKEN = getKibanaDetails('token');
    const AUTH_KEY = getKibanaDetails('sendBasicAuthHeader') ? `Basic ${auth}` : `ApiKey ${API_TOKEN}`;

    workerRef.current?.postMessage({
      type: 'FETCH_ELASTICSEARCH_DATA',
      payload: {
        queryParams,
        page: 0,
        pageSize: 1000,
        origin: window.location.origin,
        batchSize: 500,
        kibanaConfig: {
          ...kibanaConfig,
          queryType: 'staff'
        },
        authKey: AUTH_KEY
      }
    });
  };

  return (
    <div className="multi-query-example">
      <Header className="works-header-view">{t("Multi-Query Example")}</Header>
      
      {/* Staff Query Section */}
      <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>Staff Query Filters</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label>Project ID:</label>
            <input 
              value={staffFilters.projectId}
              onChange={(e) => setStaffFilters(prev => ({...prev, projectId: e.target.value}))}
              placeholder="PROJECT-123"
            />
          </div>
          
          <div>
            <label>User Name (wildcard):</label>
            <input 
              value={staffFilters.userName}
              onChange={(e) => setStaffFilters(prev => ({...prev, userName: e.target.value}))}
              placeholder="John*"
            />
          </div>
          
          <div>
            <label>User Role:</label>
            <select 
              value={staffFilters.userRole}
              onChange={(e) => setStaffFilters(prev => ({...prev, userRole: e.target.value}))}
            >
              <option value="">All Roles</option>
              <option value="SUPERVISOR">Supervisor</option>
              <option value="FIELD_WORKER">Field Worker</option>
              <option value="DATA_ENTRY">Data Entry</option>
            </select>
          </div>
          
          <div>
            <label>Status:</label>
            <select 
              value={staffFilters.isDeleted}
              onChange={(e) => setStaffFilters(prev => ({...prev, isDeleted: e.target.value === 'true'}))}
            >
              <option value={false}>Active</option>
              <option value={true}>Inactive</option>
            </select>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button 
            label="Query Staff Data"
            variation="primary"
            onClick={queryStaffData}
            isDisabled={isLoading}
          />
          
          <Button 
            label="Complex Staff Query"
            variation="secondary"
            onClick={queryComplexStaffData}
            isDisabled={isLoading}
          />
        </div>
        
        <div style={{ marginTop: '1rem' }}>
          <strong>Staff Results: {staffData.length} records</strong>
          <div style={{ maxHeight: '200px', overflow: 'auto', marginTop: '0.5rem' }}>
            {staffData.slice(0, 5).map((staff, index) => (
              <div key={index} style={{ padding: '0.5rem', border: '1px solid #eee', margin: '0.25rem' }}>
                ID: {staff.employeeId} | Name: {staff.employeeName} | Status: {staff.status ? 'Inactive' : 'Active'}
              </div>
            ))}
            {staffData.length > 5 && <div>... and {staffData.length - 5} more</div>}
          </div>
        </div>
      </div>
      
      {/* Map Query Section */}
      <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>Map Data Query Filters</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label>Project Name:</label>
            <input 
              value={mapFilters.projectName}
              onChange={(e) => setMapFilters(prev => ({...prev, projectName: e.target.value}))}
              placeholder="Malaria Campaign"
            />
          </div>
          
          <div>
            <label>Administrative Area:</label>
            <input 
              value={mapFilters.administrativeArea}
              onChange={(e) => setMapFilters(prev => ({...prev, administrativeArea: e.target.value}))}
              placeholder="District North"
            />
          </div>
          
          <div>
            <label>Product Name (match):</label>
            <input 
              value={mapFilters.productName}
              onChange={(e) => setMapFilters(prev => ({...prev, productName: e.target.value}))}
              placeholder="ITN Nets"
            />
          </div>
          
          <div>
            <label>Min Quantity:</label>
            <input 
              type="number"
              value={mapFilters.minQuantity}
              onChange={(e) => setMapFilters(prev => ({...prev, minQuantity: e.target.value}))}
              placeholder="100"
            />
          </div>
          
          <div>
            <label>Max Quantity:</label>
            <input 
              type="number"
              value={mapFilters.maxQuantity}
              onChange={(e) => setMapFilters(prev => ({...prev, maxQuantity: e.target.value}))}
              placeholder="1000"
            />
          </div>
        </div>
        
        <Button 
          label="Query Map Data"
          variation="primary"
          onClick={queryMapData}
          isDisabled={isLoading}
        />
        
        <div style={{ marginTop: '1rem' }}>
          <strong>Map Results: {mapData.length} records</strong>
          <div style={{ maxHeight: '200px', overflow: 'auto', marginTop: '0.5rem' }}>
            {mapData.slice(0, 5).map((item, index) => (
              <div key={index} style={{ padding: '0.5rem', border: '1px solid #eee', margin: '0.25rem' }}>
                Product: {item.productName} | Area: {item.administrativeArea} | Qty: {item.quantity}
              </div>
            ))}
            {mapData.length > 5 && <div>... and {mapData.length - 5} more</div>}
          </div>
        </div>
      </div>
      
      {isLoading && (
        <div style={{ padding: '1rem', backgroundColor: '#f0f8ff', borderRadius: '4px' }}>
          Loading data...
        </div>
      )}
    </div>
  );
};

export default MultiQueryExample;