import { useMemo, useCallback } from "react";

/**
 * Hook to fetch user activity tracking data via the dashboard-analytics getChartV2 API.
 *
 * Uses 2 visualization codes on the main screen:
 * 1. overallUsersMetrics   → Summary cards (total workers, online, records, sync warnings)
 * 2. usersSummaryTable     → Main table (userId, userName, role, province, district, etc.)
 *
 * Popup-level calls (individualUsersMetrics, usersRecordsSummaryTable) are handled
 * inside UserProfilePopup to avoid firing API calls when no user is selected.
 */

var buildAggregationRequestDto = function (config) {
  var filters = config.filters || {};
  var requestDate = config.requestDate || {};
  return {
    visualizationType: config.visualizationType || "METRIC",
    visualizationCode: config.visualizationCode,
    queryType: "",
    filters: Object.assign({}, filters, config.campaignNumber ? { campaignNumber: config.campaignNumber } : {}),
    moduleLevel: "",
    aggregationFactors: null,
    requestDate: {
      startDate: requestDate.startDate || 0,
      endDate: requestDate.endDate || Date.now(),
      interval: requestDate.interval || "month",
      title: requestDate.title || "",
    },
  };
};

var EMPTY_FILTERS = {};
var EMPTY_DATE = {};

var useUserActivityData = function (params) {
  var filters = params.filters || EMPTY_FILTERS;
  var requestDate = params.requestDate || EMPTY_DATE;
  var campaignNumber = params.campaignNumber;
  var enabled = params.enabled !== undefined ? params.enabled : true;

  // Stabilize object references to prevent infinite re-renders
  var filtersKey = JSON.stringify(filters);
  var requestDateKey = JSON.stringify(requestDate);

  // ─── 1. Overall summary cards (overallUsersMetrics) ───
  // eslint-disable-next-line react-hooks/exhaustive-deps
  var overallMetricsDto = useMemo(
    function () {
      return buildAggregationRequestDto({
        visualizationCode: "overallUsersMetrics",
        filters: filters,
        requestDate: requestDate,
        campaignNumber: campaignNumber,
      });
    },
    [filtersKey, requestDateKey, campaignNumber]
  );

  var overallResult = Digit.Hooks.DSS.useGetChartV2(overallMetricsDto);
  var overallMetricsRaw = enabled ? overallResult.data : null;
  var overallLoading = enabled ? overallResult.isLoading : false;
  var refetchOverall = overallResult.refetch;

  // ─── 2. Users summary table (usersSummaryTable) ───
  // eslint-disable-next-line react-hooks/exhaustive-deps
  var usersSummaryDto = useMemo(
    function () {
      return buildAggregationRequestDto({
        visualizationCode: "usersSummaryTable",
        filters: filters,
        requestDate: requestDate,
        campaignNumber: campaignNumber,
      });
    },
    [filtersKey, requestDateKey, campaignNumber]
  );

  var usersResult = Digit.Hooks.DSS.useGetChartV2(usersSummaryDto);
  var usersSummaryRaw = enabled ? usersResult.data : null;
  var usersLoading = enabled ? usersResult.isLoading : false;
  var refetchUsers = usersResult.refetch;

  // ─── Transform: Overall summary cards ───
  // totalFieldWorkers ← overallUsersMetrics.totalUsersCreated
  // onlineNow         ← overallUsersMetrics.totalUsersActive
  // recordsToday      ← overallUsersMetrics.totalRecordsCount
  // syncWarnings      ← overallUsersMetrics.inactiveUsers
  var overallMetrics = useMemo(function () {
    if (!overallMetricsRaw) return { totalFieldWorkers: 0, onlineNow: 0, recordsToday: 0, syncWarnings: 0 };
    // Try responseData.customData.rawResponse first, then customData.rawResponse
    var rd = overallMetricsRaw.responseData;
    var raw = (rd && rd.customData && rd.customData.rawResponse)
      || (overallMetricsRaw.customData && overallMetricsRaw.customData.rawResponse)
      || {};
    return {
      totalFieldWorkers: raw.totalUsersCreated != null ? raw.totalUsersCreated : 0,
      onlineNow: raw.totalUsersActive != null ? raw.totalUsersActive : 0,
      recordsToday: raw.totalRecordsCount != null ? raw.totalRecordsCount : 0,
      syncWarnings: raw.inactiveUsers != null ? raw.inactiveUsers : 0,
    };
  }, [overallMetricsRaw]);

  // ─── Transform: Users summary table ───
  // userName       ← usersSummaryTable[].nameOfUser (TODO: backend to add nameOfUser to response)
  // userId         ← usersSummaryTable[].userName (e.g. "USR-000568")
  // role           ← usersSummaryTable[].role
  // geoBoundary    ← usersSummaryTable[].fullLocation (fallback: province - district)
  // lastSyncTimestamp ← usersSummaryTable[].latestSyncTime (TODO: backend fixing null values)
  // recordsToday   ← usersSummaryTable[].totalRecords
  // status         ← usersSummaryTable[].active (true → ONLINE, false/null → OFFLINE)
  //                   (TODO: backend will send inactive status when active is null)
  var usersSummary = useMemo(function () {
    if (!usersSummaryRaw) return [];
    // Try responseData.customData.rawResponse.mergedUsersSummary first
    var rd = usersSummaryRaw.responseData;
    var raw = (rd && rd.customData && rd.customData.rawResponse && rd.customData.rawResponse.mergedUsersSummary)
      || (usersSummaryRaw.customData && usersSummaryRaw.customData.rawResponse && usersSummaryRaw.customData.rawResponse.mergedUsersSummary)
      || (rd && rd.data)
      || [];
    return raw.map(function (user) {
      return {
        syncedUserId: user.userId,
        // TODO: backend will add nameOfUser to response — currently falling back to userName
        userName: user.nameOfUser || user.userName || user.userId,
        userId: user.userName || user.userId,
        role: user.role || "Unknown",
        geoBoundary: user.fullLocation || [user.province, user.district].filter(Boolean).join(" - "),
        // TODO: backend fixing latestSyncTime null values
        lastSyncTimestamp: user.latestSyncTime,
        recordsToday: user.totalRecords != null ? user.totalRecords : 0,
        active: user.active === true,
        // TODO: backend will send inactive status explicitly when active is null
        status: user.active === true ? "ONLINE" : "OFFLINE",
        province: user.province,
        district: user.district,
      };
    });
  }, [usersSummaryRaw]);

  // ─── Refetch ───
  var refetch = useCallback(function () {
    if (refetchOverall) refetchOverall();
    if (refetchUsers) refetchUsers();
  }, [refetchOverall, refetchUsers]);

  return {
    // Summary cards data
    overallMetrics: overallMetrics,
    overallLoading: overallLoading,

    // Main table data
    usersSummary: usersSummary,
    usersLoading: usersLoading,

    // General
    isLoading: overallLoading || usersLoading,
    refetch: refetch,

    // Export buildAggregationRequestDto for use in popup
    buildAggregationRequestDto: buildAggregationRequestDto,
  };
};

export { buildAggregationRequestDto };
export default useUserActivityData;
