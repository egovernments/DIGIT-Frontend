import { useState, useEffect, useRef, useCallback } from "react";
import { getKibanaDetails } from "../utils/getProjectServiceUrl";
import { elasticsearchWorkerString } from "../workers/elasticsearchWorkerString";

/**
 * Custom hook for dynamic Elasticsearch queries
 * @param {Object} config - Configuration object
 * @param {string} config.index - Elasticsearch index name
 * @param {string} config.queryField - Field to query on
 * @param {string} config.queryValue - Value to search for
 * @param {Function} config.dataParser - Function to parse/transform the response data
 * @param {Object} config.customQuery - Custom Elasticsearch query (optional)
 * @param {boolean} config.enabled - Whether to enable the query
 * @param {number} config.pageSize - Number of results per page
 * @param {number} config.batchSize - Batch size for processing
 * @param {Object} config.defaultData - Default data to use as fallback
 * @param {boolean} config.lazyLoad - Whether to lazy load data (default: false)
 */
const useElasticsearch = (config) => {
  const {
    index,
    queryField,
    queryValue,
    dataParser,
    customQuery,
    enabled = true,
    pageSize = 1000000,
    batchSize = 1000,
    defaultData = [],
    lazyLoad = false
  } = config;

  const [data, setData] = useState(defaultData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState({ 
    progress: 0, 
    batchesCompleted: 0, 
    totalBatches: 0, 
    dataReceived: 0 
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasDataBeenFetched, setHasDataBeenFetched] = useState(false);
  const [isVisible, setIsVisible] = useState(!lazyLoad);
  
  const workerRef = useRef(null);
  const componentRef = useRef(null);
  const page = 0; // Can be made dynamic if pagination is needed

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazyLoad) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (componentRef.current) {
      observer.observe(componentRef.current);
    }

    return () => {
      if (componentRef.current) {
        observer.unobserve(componentRef.current);
      }
    };
  }, [lazyLoad]);

  // Initialize Web Worker
  useEffect(() => {
    const blob = new Blob([elasticsearchWorkerString], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    workerRef.current = new Worker(workerUrl);

    workerRef.current.onmessage = (e) => {
      const { type, payload, error: workerError } = e.data;
      
      switch (type) {
        case 'AUTHENTICATION_START':
          console.log('Authenticating with Kibana...');
          break;
        case 'AUTHENTICATION_SUCCESS':
          setIsAuthenticated(true);
          console.log('Kibana authentication successful');
          break;
        case 'AUTHENTICATION_ERROR':
          console.error('Kibana authentication failed:', workerError);
          setIsAuthenticated(false);
          setError(workerError);
          break;
        case 'AUTHENTICATION_REQUIRED':
          setIsAuthenticated(false);
          const kibanaConfig = {
            kibanaPath: getKibanaDetails('kibanaPath'),
            projectTaskIndex: index,
            username: getKibanaDetails('username'),
            password: getKibanaDetails('password'),
            queryField: queryField
          };
          workerRef.current?.postMessage({
            type: 'AUTHENTICATE_KIBANA',
            payload: { 
              origin: window.location.origin,
              kibanaConfig
            }
          });
          break;
        case 'FETCH_START':
          setIsLoading(true);
          setLoadingProgress({ progress: 0, batchesCompleted: 0, totalBatches: 0, dataReceived: 0 });
          setError(null);
          break;
        case 'FETCH_PROGRESS':
          setLoadingProgress(payload);
          console.log(`Progress: ${payload.progress.toFixed(1)}% - ${payload.dataReceived} records loaded`);
          break;
        case 'FETCH_SUCCESS':
          const processedData = dataParser ? dataParser(payload.data) : payload.data;
          setData(processedData.length > 0 ? processedData : defaultData);
          setHasDataBeenFetched(true);
          setIsLoading(false);
          setLoadingProgress({ 
            progress: 100, 
            batchesCompleted: payload.batchesProcessed, 
            totalBatches: payload.batchesProcessed, 
            dataReceived: payload.data.length 
          });
          console.log(`Data fetch completed: ${payload.data.length} records loaded`);
          break;
        case 'FETCH_ERROR':
          console.error('Elasticsearch fetch error:', workerError);
          setError(workerError);
          setData(defaultData);
          setHasDataBeenFetched(true);
          setIsLoading(false);
          break;
        case 'ERROR':
        case 'WORKER_ERROR':
          console.error('Worker error:', workerError);
          setError(workerError);
          setData(defaultData);
          setHasDataBeenFetched(true);
          setIsLoading(false);
          break;
        default:
          console.warn('Unknown worker message type:', type);
      }
    };

    workerRef.current.onerror = (error) => {
      console.error('Worker error:', error);
      setError(error);
      setData(defaultData);
      setHasDataBeenFetched(true);
      setIsLoading(false);
    };

    return () => {
      workerRef.current?.terminate();
      URL.revokeObjectURL(workerUrl);
    };
  }, [index, queryField, dataParser, defaultData]);

  // Fetch data using web worker
  const fetchData = useCallback(() => {
    if (!queryValue || !isVisible || hasDataBeenFetched || !enabled) return;
    
    const username = getKibanaDetails('BasicUsername');
    const password = getKibanaDetails('BasicPassword');
    const auth = btoa(`${username}:${password}`);
    const API_TOKEN = getKibanaDetails('token');
    const AUTH_KEY = getKibanaDetails('sendBasicAuthHeader') ? `Basic ${auth}` : `ApiKey ${API_TOKEN}`;
    
    const kibanaConfig = {
      kibanaPath: getKibanaDetails('kibanaPath'),
      projectTaskIndex: index,
      username: getKibanaDetails('username'),
      password: getKibanaDetails('password'),
      queryField: queryField,
      customQuery: customQuery
    };
    
    if (!isAuthenticated) {
      workerRef.current?.postMessage({
        type: 'AUTHENTICATE_KIBANA',
        payload: { 
          origin: window.location.origin,
          kibanaConfig
        }
      });
      
      setTimeout(() => {
        workerRef.current?.postMessage({
          type: 'FETCH_ELASTICSEARCH_DATA',
          payload: {
            projectName: queryValue,
            page,
            pageSize,
            origin: window.location.origin,
            batchSize,
            kibanaConfig,
            authKey: AUTH_KEY
          }
        });
      }, 1000);
    } else {
      workerRef.current?.postMessage({
        type: 'FETCH_ELASTICSEARCH_DATA',
        payload: {
          projectName: queryValue,
          page,
          pageSize,
          origin: window.location.origin,
          batchSize,
          kibanaConfig,
          authKey: AUTH_KEY
        }
      });
    }
  }, [queryValue, isVisible, hasDataBeenFetched, isAuthenticated, enabled, index, queryField, customQuery, pageSize, batchSize]);

  // Trigger data fetch when conditions are met
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Manual refetch function
  const refetch = useCallback(() => {
    setHasDataBeenFetched(false);
    setData(defaultData);
    fetchData();
  }, [fetchData, defaultData]);

  return {
    data,
    isLoading,
    error,
    loadingProgress,
    refetch,
    isAuthenticated,
    hasDataBeenFetched,
    componentRef
  };
};

export default useElasticsearch;