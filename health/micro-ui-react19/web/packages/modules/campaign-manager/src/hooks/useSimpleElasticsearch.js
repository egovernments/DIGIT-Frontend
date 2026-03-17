import { useCallback, useEffect, useRef, useState } from "react";
import { simpleElasticsearchWorkerString } from "../workers/simpleElasticsearchWorkerString";
import { getKibanaDetails } from "../utils/getProjectServiceUrl";

const buildAuthKey = () => {
  const user = getKibanaDetails("username");
  const pass = getKibanaDetails("password");
  if (user && pass) return `Basic ${btoa(`${user}:${pass}`)}`;
  const token = getKibanaDetails("token");
  if (token) return `Basic ${token}`;
  return null;
};
const defaultAuthKey = buildAuthKey();

const useSimpleElasticsearch = (config) => {
  const {
    indexName,
    query,
    sourceFields,
    aggs,
    maxRecordLimit = 10000,
    kibanaPath = getKibanaDetails("kibanaPath") || "kibana/api/console/proxy",
    authKey = defaultAuthKey,
    enabled = true,
    autoFetch = true,
  } = config;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({
    progress: 0,
    batchesCompleted: 0,
    totalBatches: 0,
    recordsReceived: 0,
  });
  const [metadata, setMetadata] = useState({
    totalRecords: 0,
    totalAvailable: 0,
    batchesProcessed: 0,
    config: null,
  });

  const workerRef = useRef(null);
  const requestIdRef = useRef(null);

  // Initialize worker
  useEffect(() => {
    if (!enabled) return;

    try {
      const blob = new Blob([simpleElasticsearchWorkerString], { type: "application/javascript" });
      const workerUrl = URL.createObjectURL(blob);
      workerRef.current = new Worker(workerUrl);

      workerRef.current.onmessage = (e) => {
        const { type, payload } = e.data;

        switch (type) {
          case "FETCH_START":
            setLoading(true);
            setError(null);
            setProgress({ progress: 0, batchesCompleted: 0, totalBatches: 0, recordsReceived: 0 });
            break;

          case "FETCH_PROGRESS":
            setProgress({
              progress: payload.progress,
              batchesCompleted: payload.batchesCompleted,
              totalBatches: payload.totalBatches,
              recordsReceived: payload.recordsReceived,
            });
            break;

          case "FETCH_SUCCESS":
            setData(payload.hits);
            setMetadata({
              totalRecords: payload.totalRecords,
              totalAvailable: payload.totalAvailable,
              batchesProcessed: payload.batchesProcessed,
              aggregations: payload.aggregations,
              config: payload.config,
            });
            setLoading(false);
            setProgress({
              progress: 100,
              batchesCompleted: payload.batchesProcessed,
              totalBatches: payload.config?.totalBatches || payload.batchesProcessed,
              recordsReceived: payload.totalRecords,
            });
            break;

          case "FETCH_ERROR":
            console.error("Elasticsearch fetch failed:", e.data.error);
            setError(e.data.error);
            setLoading(false);
            break;

          case "FETCH_CANCELLED":
            setLoading(false);
            break;

          case "WORKER_ERROR":
            console.error("Worker error:", e.data.error);
            setError(`Worker error: ${e.data.error}`);
            setLoading(false);
            break;

          default:
            break;
        }
      };

      workerRef.current.onerror = (error) => {
        console.error("Worker error:", error);
        setError(`Worker initialization error: ${error.message}`);
        setLoading(false);
      };
    } catch (error) {
      console.error("Failed to initialize worker:", error);
      setError(`Worker initialization failed: ${error.message}`);
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [enabled]);

  const fetchData = useCallback(() => {
    if (!workerRef.current) {
      setError("Worker not initialized");
      return;
    }

    if (!indexName || !query || !sourceFields) {
      setError("Missing required parameters: indexName, query, and sourceFields");
      return;
    }

    // Cancel any existing request
    if (requestIdRef.current) {
      workerRef.current.postMessage({
        type: "CANCEL_REQUEST",
        payload: { requestId: requestIdRef.current },
      });
    }

    requestIdRef.current = Date.now().toString();

    // Use configured kibanaBaseUrl for deployed environments; fall back to window.location.origin (dev proxy)
    const kibanaBaseUrl = getKibanaDetails("kibanaBaseUrl");
    const resolvedOrigin = kibanaBaseUrl || window.location.origin;

    workerRef.current.postMessage({
      type: "FETCH_DATA",
      payload: {
        indexName,
        query,
        sourceFields,
        aggs,
        maxRecordLimit,
        kibanaPath,
        authKey,
        origin: resolvedOrigin,
        requestId: requestIdRef.current,
      },
    });
  }, [indexName, query, sourceFields, aggs, maxRecordLimit, kibanaPath, authKey]);

  const cancelFetch = useCallback(() => {
    if (workerRef.current && requestIdRef.current) {
      workerRef.current.postMessage({
        type: "CANCEL_REQUEST",
        payload: { requestId: requestIdRef.current },
      });
    }
  }, []);

  // Auto-fetch on config change
  useEffect(() => {
    if (enabled && autoFetch && indexName && query && sourceFields) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, autoFetch, indexName, JSON.stringify(query), JSON.stringify(sourceFields), JSON.stringify(aggs), authKey]);

  return {
    data,
    loading,
    error,
    progress,
    metadata,
    fetchData,
    cancelFetch,
    refetch: fetchData,
    isLoading: loading,
    hasError: !!error,
    hasData: data.length > 0,
  };
};

export default useSimpleElasticsearch;
