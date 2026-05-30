import { useState, useRef, useCallback, useEffect } from "react";
import { STOCK_BATCH_SIZE, STOCK_SEARCH_MAX_RETRIES, STOCK_SEARCH_RETRY_INTERVAL } from "../utils";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const SESSION_KEY = "HCM_BATCH_STOCK_PROGRESS";

const INITIAL_BATCH_STATUS = {
  total: 0,
  completed: 0,
  failed: 0,
  verified: 0,
  currentBatch: 0,
  statusKey: "",
  statusParams: {},
  totalRecords: 0,
  processedRecords: 0,
  failedRecords: 0,
};

/**
 * Persist batch progress to sessionStorage so it survives page refresh.
 */
const saveToSession = (data) => {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...data, updatedAt: Date.now() }));
  } catch (e) {
    // sessionStorage may be full or unavailable; ignore
  }
};

const loadFromSession = () => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

const clearSession = () => {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch (e) {
    // ignore
  }
};

/**
 * Custom hook for batched stock creation with verification.
 *
 * Splits a large stock payload into batches of STOCK_BATCH_SIZE, creates each batch
 * sequentially via /stock/v1/bulk/_create, verifies each batch via
 * /stock/v1/_search using clientReferenceIds (with up to 3 retries),
 * and tracks progress + failed records throughout.
 *
 * Persists progress to sessionStorage after each batch so the UI can
 * recover last-known state if the page is refreshed mid-processing.
 *
 * statusKey values emitted:
 *   HCM_BATCH_STARTING, HCM_BATCH_CREATING, HCM_BATCH_VERIFYING,
 *   HCM_BATCH_ALL_SUCCESS, HCM_BATCH_PROCESSING_COMPLETE
 */
const useBatchStockCreation = ({ tenantId }) => {
  // Check for recovery data on mount
  const recoveredData = useRef(loadFromSession());

  const [batchStatus, setBatchStatus] = useState(() => {
    const recovered = recoveredData.current;
    if (recovered?.batchStatus) return recovered.batchStatus;
    return { ...INITIAL_BATCH_STATUS };
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [failedRecords, setFailedRecords] = useState(() => {
    const recovered = recoveredData.current;
    return recovered?.failedRecords || [];
  });
  const [isComplete, setIsComplete] = useState(() => {
    const recovered = recoveredData.current;
    return recovered?.isComplete || false;
  });
  const [result, setResult] = useState(() => {
    const recovered = recoveredData.current;
    return recovered?.result || null;
  });
  // Flag: true if current state was loaded from sessionStorage (not from a live run)
  const [isRecovered, setIsRecovered] = useState(() => {
    const recovered = recoveredData.current;
    return !!(recovered?.batchStatus && (recovered.isComplete || recovered.batchStatus.completed > 0));
  });

  const abortRef = useRef(false);

  const stockMutationReq = {
    url: `/stock/v1/bulk/_create`,
    params: {},
    body: {},
    config: { enabled: false },
  };
  const stockMutation = Digit.Hooks.useCustomAPIMutationHook(stockMutationReq);

  /**
   * Persist current state to sessionStorage.
   */
  const persistProgress = useCallback((statusOverride, failedOverride, resultOverride, completeOverride) => {
    saveToSession({
      batchStatus: statusOverride,
      failedRecords: failedOverride,
      result: resultOverride,
      isComplete: completeOverride,
    });
  }, []);

  /**
   * Search stock records by clientReferenceIds with retry logic.
   */
  const searchStockWithRetry = useCallback(
    async (clientReferenceIds, batchIndex, totalBatches, updateStatus) => {
      let missingIds = [...clientReferenceIds];

      for (let attempt = 1; attempt <= STOCK_SEARCH_MAX_RETRIES; attempt++) {
        if (abortRef.current) return { allVerified: false, failedIds: missingIds };

        await delay(STOCK_SEARCH_RETRY_INTERVAL);

        if (abortRef.current) return { allVerified: false, failedIds: missingIds };

        updateStatus("HCM_BATCH_VERIFYING", {
          current: batchIndex + 1,
          total: totalBatches,
          attempt,
          maxAttempts: STOCK_SEARCH_MAX_RETRIES,
        });

        try {
          const response = await Digit.CustomService.getResponse({
            url: "/stock/v1/_search",
            params: { offset: 0, limit: missingIds.length, tenantId },
            body: {
              RequestInfo: {
                apiId: "hcm",
                ver: ".01",
                ts: Date.now(),
                action: "_search",
                did: "1",
                key: "1",
                authToken: Digit.UserService.getUser()?.access_token,
                tenantId,
              },
              Stock: {
                clientReferenceId: missingIds,
              },
            },
          });

          const foundRecords = response?.Stock || [];
          const foundIds = new Set(foundRecords.map((r) => r.clientReferenceId));
          missingIds = missingIds.filter((id) => !foundIds.has(id));

          if (missingIds.length === 0) {
            return { allVerified: true, failedIds: [] };
          }
        } catch (error) {
          console.error(`Search attempt ${attempt} failed for batch ${batchIndex + 1}:`, error);
        }
      }

      return { allVerified: false, failedIds: missingIds };
    },
    [tenantId]
  );

  /**
   * Verify a batch of stock records by searching for their clientReferenceIds.
   */
  const verifyBatch = useCallback(
    async (batchRecords, batchIndex, totalBatches, updateStatus) => {
      const clientReferenceIds = batchRecords.map((r) => r.clientReferenceId);
      const { failedIds } = await searchStockWithRetry(clientReferenceIds, batchIndex, totalBatches, updateStatus);
      return failedIds;
    },
    [searchStockWithRetry]
  );

  /**
   * Main entry point: process the full stock payload in batches.
   */
  const processBatches = useCallback(
    async (stockPayload) => {
      abortRef.current = false;
      setIsRecovered(false);

      const batches = [];
      for (let i = 0; i < stockPayload.length; i += STOCK_BATCH_SIZE) {
        batches.push(stockPayload.slice(i, i + STOCK_BATCH_SIZE));
      }

      const totalBatches = batches.length;
      const totalRecords = stockPayload.length;
      let completedBatches = 0;
      let processedRecords = 0;
      let allFailed = [];

      const initialStatus = {
        ...INITIAL_BATCH_STATUS,
        total: totalBatches,
        statusKey: "HCM_BATCH_STARTING",
        statusParams: {},
        totalRecords,
      };

      setBatchStatus(initialStatus);
      setFailedRecords([]);
      setIsProcessing(true);
      setIsComplete(false);
      setResult(null);
      persistProgress(initialStatus, [], null, false);

      const updateStatus = (statusKey, statusParams = {}) => {
        setBatchStatus((prev) => {
          const updated = { ...prev, statusKey, statusParams };
          return updated;
        });
      };

      for (let i = 0; i < batches.length; i++) {
        if (abortRef.current) break;

        const batch = batches[i];
        if (!batch.length) continue;

        const creatingStatus = {
          statusKey: "HCM_BATCH_CREATING",
          statusParams: { current: i + 1, total: totalBatches },
          currentBatch: i + 1,
        };
        setBatchStatus((prev) => ({ ...prev, ...creatingStatus }));

        let batchCreationFailed = false;

        try {
          await stockMutation.mutateAsync({
            url: `/stock/v1/bulk/_create`,
            body: {
              RequestInfo: {
                apiId: "hcm",
                ver: ".01",
                ts: Date.now(),
                action: "_create",
                did: "1",
                key: "1",
                authToken: Digit.UserService.getUser()?.access_token,
                tenantId,
              },
              Stock: batch,
            },
          });
        } catch (error) {
          console.error(`Batch ${i + 1} creation failed:`, error);
          batchCreationFailed = true;
        }

        if (batchCreationFailed) {
          const batchFailed = batch.map((record) => ({
            stockRecord: record,
            reason: "CREATION_FAILED",
          }));
          allFailed = [...allFailed, ...batchFailed];
          setFailedRecords((prev) => [...prev, ...batchFailed]);
        } else {
          const failedIds = await verifyBatch(batch, i, totalBatches, updateStatus);

          if (abortRef.current) break;

          if (failedIds.length > 0) {
            const failedIdSet = new Set(failedIds);
            const batchFailed = batch
              .filter((record) => failedIdSet.has(record.clientReferenceId))
              .map((record) => ({
                stockRecord: record,
                reason: "CREATION_FAILED",
              }));
            allFailed = [...allFailed, ...batchFailed];
            setFailedRecords((prev) => [...prev, ...batchFailed]);
          }
        }

        completedBatches++;
        processedRecords += batch.length;

        const updatedStatus = {
          total: totalBatches,
          completed: completedBatches,
          failed: allFailed.length,
          verified: processedRecords - allFailed.length,
          currentBatch: i + 1,
          statusKey: "HCM_BATCH_CREATING",
          statusParams: { current: i + 1, total: totalBatches },
          totalRecords,
          processedRecords,
          failedRecords: allFailed.length,
        };
        setBatchStatus(updatedStatus);

        // Persist after each batch completes
        persistProgress(updatedStatus, allFailed, null, false);

        // Yield to the event loop so React can re-render
        await delay(0);
      }

      let finalResult;
      if (allFailed.length === 0) {
        finalResult = "success";
      } else if (allFailed.length === totalRecords) {
        finalResult = "all_failed";
      } else {
        finalResult = "partial_failure";
      }

      const finalStatus = {
        total: totalBatches,
        completed: completedBatches,
        failed: allFailed.length,
        verified: processedRecords - allFailed.length,
        currentBatch: totalBatches,
        statusKey: finalResult === "success" ? "HCM_BATCH_ALL_SUCCESS" : "HCM_BATCH_PROCESSING_COMPLETE",
        statusParams: { failedCount: allFailed.length },
        totalRecords,
        processedRecords,
        failedRecords: allFailed.length,
      };

      setBatchStatus(finalStatus);
      setResult(finalResult);
      setIsProcessing(false);
      setIsComplete(true);

      // Persist final state
      persistProgress(finalStatus, allFailed, finalResult, true);
    },
    [tenantId, stockMutation, verifyBatch, persistProgress]
  );

  const reset = useCallback(() => {
    abortRef.current = true;
    setBatchStatus({ ...INITIAL_BATCH_STATUS });
    setIsProcessing(false);
    setFailedRecords([]);
    setIsComplete(false);
    setResult(null);
    setIsRecovered(false);
    clearSession();
  }, []);

  const abort = useCallback(() => {
    abortRef.current = true;
  }, []);

  return {
    processBatches,
    batchStatus,
    isProcessing,
    failedRecords,
    isComplete,
    result,
    reset,
    abort,
    isRecovered,
  };
};

export default useBatchStockCreation;
