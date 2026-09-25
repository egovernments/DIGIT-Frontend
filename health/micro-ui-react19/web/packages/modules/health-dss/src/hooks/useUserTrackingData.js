import { useState, useEffect, useMemo, useCallback } from "react";
import useSimpleElasticsearch from "./useSimpleElasticSearch";
import { getKibanaDetails } from "../utils/getProjectServiceUrls";

const USER_SYNC_SOURCE_FIELDS = [
  "Data.syncedUserId",
  "Data.syncedUserName",
  "Data.role",
  "Data.boundaryHierarchy",
  "Data.syncedTimeStamp",
  "Data.syncedDate",
  "Data.taskDates",
  "Data.createdTime",
  "Data.clientCreatedTime",
  "Data.additionalDetails",
];

const PROJECT_STAFF_SOURCE_FIELDS = [
  "Data.userId",
  "Data.nameOfUser",
  "Data.userName",
  "Data.role",
  "Data.boundaryHierarchy",
  "Data.boundaryHierarchyCode",
  "Data.localityCode",
  "Data.projectName",
  "Data.campaignId",
  "Data.campaignNumber",
  "Data.projectType",
  "Data.taskDates",
];

const USER_SYNC_AGGS = {
  unique_users: {
    cardinality: { field: "Data.syncedUserId.keyword" },
  },
  users: {
    terms: { field: "Data.syncedUserId.keyword", size: 10000 },
    aggs: {
      latest_sync: {
        top_hits: {
          sort: [{ "Data.syncedTimeStamp": { order: "desc" } }],
          size: 1,
          _source: USER_SYNC_SOURCE_FIELDS,
        },
      },
      total_records: {
        value_count: { field: "Data.syncedUserId.keyword" },
      },
    },
  },
};

const useUserSyncData = ({ campaignId, enabled = true }) => {
  const indexName = getKibanaDetails("userSyncIndex") || "user-sync-index-v1";

  const query = useMemo(() => {
    if (campaignId) {
      return { bool: { must: [{ term: { "Data.campaignId.keyword": campaignId } }] } };
    }
    return { match_all: {} };
  }, [campaignId]);

  const esConfig = useMemo(
    () => ({ indexName, query, sourceFields: USER_SYNC_SOURCE_FIELDS, aggs: USER_SYNC_AGGS, maxRecordLimit: 10000, enabled, autoFetch: true }),
    [indexName, query, enabled]
  );

  const { data: esHits, loading, error, metadata, refetch } = useSimpleElasticsearch(esConfig);
  return { data: esHits, loading, error, metadata, refetch };
};

const useProjectStaffData = ({ userIds = [], campaignId, enabled = true }) => {
  const indexName = getKibanaDetails("projectStaffIndex") || "project-staff-index-v1";

  const query = useMemo(() => {
    const mustClauses = [];
    if (userIds.length > 0) mustClauses.push({ terms: { "Data.userId.keyword": userIds } });
    if (campaignId) mustClauses.push({ term: { "Data.campaignId.keyword": campaignId } });
    if (mustClauses.length === 0) return { match_all: {} };
    return { bool: { must: mustClauses } };
  }, [userIds, campaignId]);

  const esConfig = useMemo(
    () => ({
      indexName,
      query,
      sourceFields: PROJECT_STAFF_SOURCE_FIELDS,
      maxRecordLimit: 10000,
      enabled: enabled && userIds.length > 0,
      autoFetch: true,
    }),
    [indexName, query, enabled, userIds]
  );

  const { data: esHits, loading, error, metadata, refetch } = useSimpleElasticsearch(esConfig);
  return { data: esHits, loading, error, metadata, refetch };
};

const buildUserSyncMap = (hits) => {
  const userMap = {};
  if (!hits?.length) return userMap;
  for (const hit of hits) {
    const d = hit.Data || hit._source?.Data || hit;
    const userId = d.syncedUserId;
    if (!userId) continue;
    const syncTimestamp = d.syncedTimeStamp || d["@timestamp"];
    const existing = userMap[userId];
    if (!existing) {
      userMap[userId] = {
        syncedUserId: userId,
        syncedUserName: d.syncedUserName,
        role: d.role,
        boundaryHierarchy: d.boundaryHierarchy,
        lastSyncTimestamp: syncTimestamp,
        recordCount: 1,
        syncRecords: [d],
      };
    } else {
      existing.recordCount += 1;
      existing.syncRecords.push(d);
      if (new Date(syncTimestamp) > new Date(existing.lastSyncTimestamp)) {
        existing.lastSyncTimestamp = syncTimestamp;
        existing.syncedUserName = d.syncedUserName || existing.syncedUserName;
        existing.role = d.role || existing.role;
        existing.boundaryHierarchy = d.boundaryHierarchy || existing.boundaryHierarchy;
      }
    }
  }
  return userMap;
};

const buildStaffMap = (hits) => {
  const staffMap = {};
  if (!hits?.length) return staffMap;
  for (const hit of hits) {
    const d = hit.Data || hit._source?.Data || hit;
    const userId = d.userId;
    if (!userId) continue;
    staffMap[userId] = {
      nameOfUser: d.nameOfUser,
      userName: d.userName,
      role: d.role,
      boundaryHierarchy: d.boundaryHierarchy,
      boundaryHierarchyCode: d.boundaryHierarchyCode,
      localityCode: d.localityCode,
      projectName: d.projectName,
      campaignId: d.campaignId,
      campaignNumber: d.campaignNumber,
      projectType: d.projectType,
    };
  }
  return staffMap;
};

const formatBoundary = (hierarchy) => {
  if (!hierarchy) return "";
  const parts = [];
  if (hierarchy.administrativeProvince) parts.push(hierarchy.administrativeProvince);
  if (hierarchy.locality) parts.push(hierarchy.locality);
  if (hierarchy.village) parts.push(hierarchy.village);
  if (parts.length > 0) return parts.join(" / ");
  return Object.values(hierarchy).filter(Boolean).join(" / ");
};

const useUserTrackingData = ({ campaignId, enabled = true }) => {
  const [combinedData, setCombinedData] = useState([]);

  const { data: syncHits, loading: syncLoading, error: syncError, metadata: syncMetadata, refetch: refetchSync } = useUserSyncData({ campaignId, enabled });

  const userSyncMap = useMemo(() => buildUserSyncMap(syncHits), [syncHits]);
  const uniqueUserIds = useMemo(() => Object.keys(userSyncMap), [userSyncMap]);

  const { data: staffHits, loading: staffLoading, error: staffError, refetch: refetchStaff } = useProjectStaffData({
    userIds: uniqueUserIds,
    campaignId,
    enabled: enabled && uniqueUserIds.length > 0,
  });

  const staffMap = useMemo(() => buildStaffMap(staffHits), [staffHits]);

  useEffect(() => {
    if (syncLoading || staffLoading) return;
    if (uniqueUserIds.length === 0) {
      setCombinedData([]);
      return;
    }
    const combined = uniqueUserIds.map((userId) => {
      const sync = userSyncMap[userId];
      const staff = staffMap[userId] || {};
      const syncBoundary = sync.boundaryHierarchy;
      const staffBoundary = staff.boundaryHierarchy;
      return {
        syncedUserId: userId,
        userName: staff.nameOfUser || sync.syncedUserName || userId,
        userId: staff.userName || sync.syncedUserName || userId,
        role: staff.role || sync.role || "Unknown",
        geoBoundary: formatBoundary(staffBoundary || syncBoundary),
        lastSyncTimestamp: sync.lastSyncTimestamp,
        recordsToday: sync.recordCount,
        campaign: staff.projectName || "",
        campaignId: staff.campaignId || campaignId,
        projectType: staff.projectType || "",
        activityLog: (sync.syncRecords || []).map((record) => ({
          timestamp: record.syncedTimeStamp || record["@timestamp"],
          actionType: "Record Submitted",
          detail: `${record.additionalDetails?.nameOfIndividual || "Record"} - ${record.additionalDetails?.familyname || ""}`.trim(),
          outcome: "Success",
          gps: record.additionalDetails?.latLng || "",
        })),
      };
    });
    setCombinedData(combined);
  }, [userSyncMap, staffMap, uniqueUserIds, syncLoading, staffLoading, campaignId]);

  const isLoading = syncLoading || staffLoading;
  const error = syncError || staffError;

  const refetch = useCallback(() => {
    refetchSync();
    if (uniqueUserIds.length > 0) refetchStaff();
  }, [refetchSync, refetchStaff, uniqueUserIds]);

  return { data: combinedData, isLoading, error, metadata: syncMetadata, refetch, totalUsers: uniqueUserIds.length };
};

export default useUserTrackingData;
