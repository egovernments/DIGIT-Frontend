import { useCallback, useEffect, useRef, useState } from "react";
import { simpleElasticsearchWorkerString } from "../workers/simpleElasticsearchWorkerString";
import  { getKibanaDetails } from "../utils/getProjectServiceUrl";

/**
 * Simple Elasticsearch Hook - User Configurable
 * 
 * @param {Object} config - Configuration object
 * @param {string} config.indexName - Elasticsearch index name (required)
 * @param {Object} config.query - Elasticsearch query object (required)
 * @param {Array} config.sourceFields - Array of source fields to fetch (required)
 * @param {number} config.maxRecordLimit - Maximum records to fetch (default: 100000)
 * @param {number} config.maxBatchSize - Maximum records per batch (default: 10000)
 * @param {number} config.parallelBatches - Number of parallel batch requests (default: 4)
 * @param {string} config.kibanaPath - Kibana path (default: 'kibana')
 * @param {string} config.authKey - Authorization key
 * @param {string} config.username - Kibana username for authentication
 * @param {string} config.password - Kibana password for authentication
 * @param {boolean} config.requiresAuth - Whether authentication is required (default: true)
 * @param {boolean} config.enabled - Whether to auto-fetch (default: true)
 * @param {boolean} config.autoFetch - Whether to start fetching immediately (default: true)
 */

const user = getKibanaDetails('BasicUsername');
const pass= getKibanaDetails('BasicPassword');
const auth = btoa(`${user}:${pass}`);
const basicAuth = `Basic ${auth}`;

const useSimpleElasticsearch = (config) => {
  const {
    indexName,
    query,
    sourceFields,
    maxRecordLimit = 100000,
    maxBatchSize = 10000,
    parallelBatches = 4,
    kibanaPath = getKibanaDetails('kibanaPath') || 'kibana',
    authKey=basicAuth,
    username=  getKibanaDetails('username'),
    password= getKibanaDetails('password'),
    requiresAuth = true,
    enabled = true,
    autoFetch = true
  } = config;

  // State
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({
    progress: 0,
    batchesCompleted: 0,
    totalBatches: 0,
    recordsReceived: 0
  });
  const [metadata, setMetadata] = useState({
    totalRecords: 0,
    totalAvailable: 0,
    batchesProcessed: 0,
    config: null
  });
  const [lastFailTime, setLastFailTime] = useState(null);
  const [retryAttempts, setRetryAttempts] = useState(0);

  // Refs
  const workerRef = useRef(null);
  const abortControllerRef = useRef(null);
  const requestIdRef = useRef(null);

  // Initialize worker
  useEffect(() => {
    if (!enabled) return;

    try {
      // Create worker from string
      const blob = new Blob([simpleElasticsearchWorkerString], { type: 'application/javascript' });
      const workerUrl = URL.createObjectURL(blob);
      workerRef.current = new Worker(workerUrl);

      // Handle worker messages
      workerRef.current.onmessage = (e) => {
        const { type, payload } = e.data;

        switch (type) {
          case 'AUTHENTICATION_START':
            console.log('🔐 Authentication started');
            setLoading(true);
            setError(null);
            break;

          case 'AUTHENTICATION_SUCCESS':
            console.log('✅ Authentication successful');
            break;

          case 'AUTHENTICATION_ERROR':
            console.error('❌ Authentication failed', e.data);
            setError(`Authentication failed: ${e.data.error}`);
            setLoading(false);
            break;

          case 'FETCH_START':
            console.log('🚀 Fetch started', payload);
            setLoading(true);
            setError(null);
            setProgress({ progress: 0, batchesCompleted: 0, totalBatches: 0, recordsReceived: 0 });
            break;

          case 'FETCH_PROGRESS':
            console.log('📈 Progress update', payload);
            setProgress({
              progress: payload.progress,
              batchesCompleted: payload.batchesCompleted,
              totalBatches: payload.totalBatches,
              recordsReceived: payload.recordsReceived
            });
            break;

          case 'FETCH_SUCCESS':
            console.log('✅ Fetch completed successfully', payload);
            setData(payload.hits);
            setMetadata({
              totalRecords: payload.totalRecords,
              totalAvailable: payload.totalAvailable,
              batchesProcessed: payload.batchesProcessed,
              config: payload.config
            });
            setLoading(false);
            setProgress({
              progress: 100,
              batchesCompleted: payload.batchesProcessed,
              totalBatches: payload.config.totalBatches,
              recordsReceived: payload.totalRecords
            });
            // Reset retry tracking on success
            setLastFailTime(null);
            setRetryAttempts(0);
            break;

          case 'FETCH_ERROR':
            console.error('❌ Fetch failed', e.data);
            setError(e.data.error);
            setLoading(false);
            break;

          case 'FETCH_CANCELLED':
            console.log('🚫 Fetch cancelled', payload);
            setLoading(false);
            break;

          case 'AUTHENTICATION_REQUIRED':
            console.warn('🔐 Authentication required', payload);
            setError('Authentication required');
            setLoading(false);
            setLastFailTime(Date.now());
            setRetryAttempts(prev => prev + 1);
            break;

          case 'WORKER_ERROR':
            console.error('⚠️ Worker error', e.data);
            setError(`Worker error: ${e.data.error}`);
            setLoading(false);
            break;

          default:
            console.warn('Unknown message type:', type);
        }
      };

      workerRef.current.onerror = (error) => {
        console.error('Worker error:', error);
        setError(`Worker initialization error: ${error.message}`);
        setLoading(false);
      };

      console.log('✅ Simple Elasticsearch worker initialized');

    } catch (error) {
      console.error('Failed to initialize worker:', error);
      setError(`Worker initialization failed: ${error.message}`);
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [enabled]);

  // Fetch data function
  const fetchData = useCallback(async (customConfig = {}) => {
    if (!workerRef.current) {
      setError('Worker not initialized');
      return;
    }

    // Check cooldown period to prevent rapid retries
    const COOLDOWN_PERIOD = 10000; // 10 seconds
    const MAX_RETRY_ATTEMPTS = 3;
    
    if (lastFailTime && Date.now() - lastFailTime < COOLDOWN_PERIOD) {
      console.warn(`🔄 Cooldown active. Please wait ${Math.ceil((COOLDOWN_PERIOD - (Date.now() - lastFailTime)) / 1000)} more seconds`);
      setError(`Please wait ${Math.ceil((COOLDOWN_PERIOD - (Date.now() - lastFailTime)) / 1000)} seconds before retrying`);
      return;
    }
    
    if (retryAttempts >= MAX_RETRY_ATTEMPTS) {
      setError(`Maximum retry attempts (${MAX_RETRY_ATTEMPTS}) exceeded. Please check your configuration and refresh the page.`);
      return;
    }

    // Validate required parameters
    if (!indexName || !query || !sourceFields) {
      setError('Missing required parameters: indexName, query, and sourceFields are required');
      return;
    }

    // Validate authentication parameters if required
    if (requiresAuth && (!username || !password)) {
      setError('Authentication required: username and password must be provided when requiresAuth is true');
      return;
    }

    // Cancel any existing request
    if (requestIdRef.current) {
      workerRef.current.postMessage({
        type: 'CANCEL_REQUEST',
        payload: { requestId: requestIdRef.current }
      });
    }

    // Generate new request ID
    requestIdRef.current = Date.now().toString();

    // Merge configuration
    const fetchConfig = {
      indexName,
      query,
      sourceFields,
      maxRecordLimit,
      maxBatchSize,
      parallelBatches,
      kibanaPath,
      authKey,
      username,
      password,
      requiresAuth,
      origin: window.location.origin,
      requestId: requestIdRef.current,
      ...customConfig
    };

    console.log('🚀 Starting fetch with config:', fetchConfig);

    // Send fetch request to worker
    workerRef.current.postMessage({
      type: 'FETCH_DATA',
      payload: fetchConfig
    });

  }, [indexName, query, sourceFields, maxRecordLimit, maxBatchSize, parallelBatches, kibanaPath, authKey]);

  // Cancel fetch function
  const cancelFetch = useCallback(() => {
    if (workerRef.current && requestIdRef.current) {
      workerRef.current.postMessage({
        type: 'CANCEL_REQUEST',
        payload: { requestId: requestIdRef.current }
      });
    }
  }, []);

  // Auto-fetch on mount/config change
  useEffect(() => {
    if (enabled && autoFetch && indexName && query && sourceFields) {
      // Reset retry tracking when config changes
      setLastFailTime(null);
      setRetryAttempts(0);
      
      // Check if authentication is required and credentials are provided
      if (requiresAuth) {
        if (username && password) {
          fetchData();
        }
      } else {
        fetchData();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, autoFetch, indexName, JSON.stringify(query), JSON.stringify(sourceFields), authKey, username, password, requiresAuth]);

  return {
    // Data
    data,
    loading,
    error,
    progress,
    metadata,
    
    // Actions
    fetchData,
    cancelFetch,
    
    // Utils
    refetch: fetchData,
    isLoading: loading,
    hasError: !!error,
    hasData: data.length > 0,
    
    // Progress helpers
    progressPercentage: progress.progress,
    batchProgress: progress.totalBatches > 0 ? `${progress.batchesCompleted}/${progress.totalBatches}` : '0/0',
    recordsProgress: progress?.recordsReceived?.toLocaleString?.()
  };
};

export default useSimpleElasticsearch;