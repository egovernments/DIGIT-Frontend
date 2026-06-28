import { useMemo, useCallback } from "react";

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

  var filtersKey = JSON.stringify(filters);
  var requestDateKey = JSON.stringify(requestDate);

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

  var overallMetrics = useMemo(function () {
    if (!overallMetricsRaw) return { totalFieldWorkers: 0, onlineNow: 0, recordsToday: 0, syncWarnings: 0 };
    var rd = overallMetricsRaw.responseData;
    var raw =
      (rd && rd.customData && rd.customData.rawResponse) ||
      (overallMetricsRaw.customData && overallMetricsRaw.customData.rawResponse) ||
      {};
    return {
      totalFieldWorkers: raw.totalUsersCreated != null ? raw.totalUsersCreated : 0,
      onlineNow: raw.totalUsersActive != null ? raw.totalUsersActive : 0,
      recordsToday: raw.totalRecordsCount != null ? raw.totalRecordsCount : 0,
      syncWarnings: raw.inactiveUsers != null ? raw.inactiveUsers : 0,
    };
  }, [overallMetricsRaw]);

  var usersSummary = useMemo(function () {
    if (!usersSummaryRaw) return [];
    var rd = usersSummaryRaw.responseData;
    var raw =
      (rd && rd.customData && rd.customData.rawResponse && rd.customData.rawResponse.mergedUsersSummary) ||
      (usersSummaryRaw.customData && usersSummaryRaw.customData.rawResponse && usersSummaryRaw.customData.rawResponse.mergedUsersSummary) ||
      (rd && rd.data) ||
      [];
    return raw.map(function (user) {
      return {
        syncedUserId: user.userId,
        userName: user.nameOfUser || user.userName || user.userId,
        userId: user.userName || user.userId,
        role: user.role || "Unknown",
        geoBoundary: user.fullLocation || [user.province, user.district].filter(Boolean).join(" - "),
        lastSyncTimestamp: user.latestSyncTime,
        recordsToday: user.totalRecords != null ? user.totalRecords : 0,
        active: user.active === true,
        status: user.active === true || user.active === "ACTIVE" ? "ONLINE" : "OFFLINE",
        province: user.province,
        district: user.district,
      };
    });
  }, [usersSummaryRaw]);

  var refetch = useCallback(
    function () {
      if (refetchOverall) refetchOverall();
      if (refetchUsers) refetchUsers();
    },
    [refetchOverall, refetchUsers]
  );

  return {
    overallMetrics: overallMetrics,
    overallLoading: overallLoading,
    usersSummary: usersSummary,
    usersLoading: usersLoading,
    isLoading: overallLoading || usersLoading,
    refetch: refetch,
    buildAggregationRequestDto: buildAggregationRequestDto,
  };
};

export { buildAggregationRequestDto };
export default useUserActivityData;
