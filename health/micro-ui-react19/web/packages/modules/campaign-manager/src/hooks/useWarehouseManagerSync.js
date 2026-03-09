import { useMemo } from "react";
import useSimpleElasticsearch from "./useSimpleElasticsearch";
import { getKibanaDetails } from "../utils/getProjectServiceUrl";

/**
 * Fetches warehouse manager sync stats from two ES indexes:
 *
 * 1. projectStaffIndex — total WMs assigned (role = WAREHOUSE_MANAGER)
 * 2. userSyncIndex     — unique WMs who have synced at least once (syncedUserId + role filter)
 *
 * Returns: { totalManagers, syncedManagers, syncRate, isLoading, error }
 */
const useWarehouseManagerSync = ({ enabled = true }) => {
  const staffIndex = getKibanaDetails("projectStaffIndex") || "project-staff-index-v1";
  const syncIndex = getKibanaDetails("userSyncIndex") || "user-sync-index-v1";

  // --- Query 1: Total warehouse managers from project-staff index ---
  const staffQuery = useMemo(() => ({
    bool: {
      must: [
        { term: { "Data.role.keyword": "WAREHOUSE_MANAGER" } },
      ],
    },
  }), []);

  const staffAggs = useMemo(() => ({
    total_users: {
      value_count: { field: "Data.userId.keyword" },
    },
  }), []);

  const staffConfig = useMemo(() => ({
    indexName: staffIndex,
    query: staffQuery,
    sourceFields: ["Data.userId"],
    aggs: staffAggs,
    maxRecordLimit: 1,
    enabled,
    autoFetch: true,
  }), [staffIndex, staffQuery, staffAggs, enabled]);

  const { metadata: staffMeta, loading: staffLoading, error: staffError } = useSimpleElasticsearch(staffConfig);

  // --- Query 2: Unique synced warehouse managers from user-sync index ---
  const syncQuery = useMemo(() => ({
    bool: {
      must: [
        { exists: { field: "Data.syncedUserId.keyword" } },
        { terms: { "Data.role.keyword": ["WAREHOUSE_MANAGER"] } },
      ],
    },
  }), []);

  const syncAggs = useMemo(() => ({
    unique_synced_users: {
      cardinality: { field: "Data.syncedUserId.keyword" },
    },
  }), []);

  const syncConfig = useMemo(() => ({
    indexName: syncIndex,
    query: syncQuery,
    sourceFields: ["Data.syncedUserId"],
    aggs: syncAggs,
    maxRecordLimit: 1,
    enabled,
    autoFetch: true,
  }), [syncIndex, syncQuery, syncAggs, enabled]);

  const { metadata: syncMeta, loading: syncLoading, error: syncError } = useSimpleElasticsearch(syncConfig);

  // --- Compute stats ---
  const result = useMemo(() => {
    const totalManagers = staffMeta?.aggregations?.total_users?.value || 0;
    const syncedManagers = syncMeta?.aggregations?.unique_synced_users?.value || 0;
    const syncRate = totalManagers > 0 ? Math.round((syncedManagers / totalManagers) * 100) : 0;

    return { totalManagers, syncedManagers, syncRate };
  }, [staffMeta, syncMeta]);

  return {
    ...result,
    isLoading: staffLoading || syncLoading,
    error: staffError || syncError,
  };
};

export default useWarehouseManagerSync;
