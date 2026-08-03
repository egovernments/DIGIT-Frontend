import { useMemo, useState, useEffect, useRef } from "react";
import useFacilityStockMetrics from "./useFacilityStockMetrics";

/**
 * Computes per-facility, per-commodity stock metrics for every facility reachable downstream of
 * the user's own facility, PLUS the user's own facility itself — via real Elasticsearch aggregation
 * queries, merged client-side. Nothing here scans the full unfiltered stock-transaction dump.
 *
 * 1. commodityDispatchEdges — unique sender→receiver facility-ID pairs for stockEntryType=ISSUED
 *    (facility-count-scale, not transaction-count-scale). Feeds the BFS below.
 * 2 & 3. The two per-facility metric aggregations (see useFacilityStockMetrics.js), scoped to
 *    [...descendantIds, ...userFacilityIds].
 * 4. commodityFacilityMetadata — one row per facility (name + boundaryHierarchyCode) via top_hits.
 *
 * BFS over the dispatch edges (graph reachability an ES aggregation can't express) still runs
 * client-side, but over a compact edge map (unique facility pairs) instead of building that edge
 * map by scanning every raw transaction.
 *
 * @param {Object} params
 * @param {string} params.tenantId
 * @param {string} params.campaignNumber
 * @param {Set} params.userFacilityIds - the user's own facility ID(s)
 * @param {string} [params.cycle] - Optional cycle code (e.g. "01") to scope every query to a single campaign cycle
 * @param {boolean} params.enabled
 * @returns {{ rows: Array, descendantIds: Set, allFacilityIds: Array, facilityMetadataMap: Object, isLoading: boolean, error: any, refetch: Function }}
 */
const useStockSummaryAggregate = ({ tenantId, campaignNumber, userFacilityIds, cycle, enabled = true }) => {
  const edgesReqCriteria = useMemo(() => ({
    url: `/dashboard-analytics/dashboard/getChartV2`,
    body: {
      aggregationRequestDto: {
        visualizationCode: "commodityDispatchEdges",
        visualizationType: "table",
        queryType: "",
        requestDate: { startDate: 0, endDate: Date.now(), interval: "day", title: "home" },
        filters: { campaignNumber: campaignNumber || "", stockEntryType: "ISSUED", ...(cycle ? { cycle } : {}) },
        aggregationFactors: null,
      },
      headers: { tenantId: tenantId || "" },
    },
    config: {
      enabled: enabled && !!tenantId && !!campaignNumber,
      refetchOnMount: "always",
      select: (data) => data?.responseData?.data || [],
    },
    changeQueryName: `stockDispatchEdges_${tenantId}_${campaignNumber}_${cycle || ""}`,
  }), [tenantId, campaignNumber, cycle, enabled]);

  const { data: edgeRows = [], isLoading: edgesLoading, isFetching: edgesFetching, error: edgesError, refetch: refetchEdges } = Digit.Hooks.useCustomAPIHook(edgesReqCriteria);

  // BFS over ISSUED sender→receiver edges, starting from the user's own facilities, to find every
  // facility downstream in the dispatch chain.
  const descendantIds = useMemo(() => {
    const getLabel = (row, name) => row?.plots?.find((p) => p.name === name)?.label;
    const shippedTo = {};
    (edgeRows || []).forEach((row) => {
      const senderId = getLabel(row, "Sender");
      const receiverId = getLabel(row, "Receiver");
      if (!senderId || !receiverId) return;
      if (!shippedTo[senderId]) shippedTo[senderId] = new Set();
      shippedTo[senderId].add(receiverId);
    });

    const ids = new Set();
    if (userFacilityIds?.size > 0) {
      const queue = [...userFacilityIds];
      const visited = new Set([...userFacilityIds]);
      while (queue.length) {
        const current = queue.shift();
        (shippedTo[current] || new Set()).forEach((childId) => {
          if (!visited.has(childId)) {
            visited.add(childId);
            ids.add(childId);
            queue.push(childId);
          }
        });
      }
    } else {
      // Fallback when the user's facility is not yet known: include every facility that ever
      // appears as a receiver in the edge list.
      Object.values(shippedTo).forEach((receivers) => receivers.forEach((id) => ids.add(id)));
    }
    return ids;
  }, [edgeRows, userFacilityIds]);

  // Widened scope: descendants PLUS the user's own facility(ies), so the metric aggregations also
  // cover the user's own current stock balance (replaces facilityStockMap/facilityCommoditySummaries'
  // reliance on the raw dump — see StockSummaryTab.js).
  const allFacilityIds = useMemo(() => {
    const ids = new Set(descendantIds);
    (userFacilityIds || new Set()).forEach((id) => ids.add(id));
    return [...ids];
  }, [descendantIds, userFacilityIds]);

  // Gated on the edges query having fully settled (not just loaded once, but not currently
  // refetching either) — otherwise this could fire against a stale/narrower facility scope (e.g.
  // just userFacilityIds, before descendantIds resolves) and the resulting under-scoped data would
  // sit there silently (react-query's keepPreviousData hides the transition from `isLoading`) until
  // the next refetch happens to correct it.
  const {
    rows,
    isLoading: metricsLoading,
    error: metricsError,
    refetch: refetchMetrics,
  } = useFacilityStockMetrics({
    tenantId,
    campaignNumber,
    facilityIds: allFacilityIds,
    cycle,
    enabled: enabled && !edgesLoading && !edgesFetching,
  });

  // Per-facility name + boundaryHierarchyCode via terms(facilityId)+top_hits(1) — one row per
  // facility, not one per transaction.
  const facilityIdsKey = JSON.stringify(allFacilityIds);
  const metadataReqCriteria = useMemo(() => ({
    url: `/dashboard-analytics/dashboard/getChartV2`,
    body: {
      aggregationRequestDto: {
        visualizationCode: "commodityFacilityMetadata",
        visualizationType: "metric",
        queryType: "",
        requestDate: { startDate: 0, endDate: Date.now(), interval: "day", title: "home" },
        filters: { campaignNumber: campaignNumber || "", facilityId: JSON.parse(facilityIdsKey), ...(cycle ? { cycle } : {}) },
        aggregationFactors: null,
      },
      headers: { tenantId: tenantId || "" },
    },
    config: {
      enabled: enabled && !!tenantId && !!campaignNumber && !edgesLoading && !edgesFetching && JSON.parse(facilityIdsKey).length > 0,
      refetchOnMount: "always",
      select: (data) => data?.responseData?.customData?.rawResponse?.facilityMetadata || [],
    },
    changeQueryName: `stockFacilityMetadata_${tenantId}_${campaignNumber}_${facilityIdsKey}_${cycle || ""}`,
  }), [tenantId, campaignNumber, facilityIdsKey, cycle, enabled, edgesLoading, edgesFetching]);

  const { data: metadataRows = [], isLoading: metadataLoading, isFetching: metadataFetching, error: metadataError, refetch: refetchMetadata } = Digit.Hooks.useCustomAPIHook(metadataReqCriteria);

  const facilityMetadataMap = useMemo(() => {
    const map = {};
    (metadataRows || []).forEach((row) => {
      if (row?.facilityId) {
        map[row.facilityId] = { facilityName: row.facilityName, boundaryHierarchyCode: row.boundaryHierarchyCode };
      }
    });
    return map;
  }, [metadataRows]);

  // Includes isFetching (not just isLoading) for every query — react-query's keepPreviousData
  // means isLoading alone stays false during a background refetch after the facilityIdsKey widens
  // (e.g. once the edges query resolves and descendantIds grows), which would otherwise let the
  // UI silently show data scoped to the old, narrower key until the new key's fetch completes.
  const isLoading = edgesLoading || edgesFetching || metricsLoading || metadataLoading || metadataFetching;
  const error = edgesError || metricsError || metadataError || null;

  // A manual `refetch()` bypasses each query's `enabled` gate (react-query only checks `enabled`
  // for automatic fetch triggers, not for an explicit .refetch() call) — calling refetchMetrics()/
  // refetchMetadata() in the same tick as refetchEdges() would re-fetch them against the CURRENT
  // (possibly stale/narrower) facilityIdsKey, since those functions are closures bound to whatever
  // facility scope was current when they were created, not "refetch with today's scope". Instead,
  // request a refresh here and let this effect fire the metrics/metadata refetch once edges has
  // genuinely settled post-refresh — at that point the component has re-rendered with the
  // (possibly widened) facilityIdsKey, so refetchMetrics/refetchMetadata are freshly bound to it.
  //
  // lastHandledRefreshId guards against re-firing on an UNRELATED later edges loading/fetching
  // transition (e.g. a natural refetchOnMount on remount) — without it, once refreshRequestId had
  // been bumped even once, every future edgesLoading/edgesFetching flip would re-trigger this.
  const [refreshRequestId, setRefreshRequestId] = useState(0);
  const lastHandledRefreshId = useRef(0);

  useEffect(() => {
    if (refreshRequestId > lastHandledRefreshId.current && !edgesLoading && !edgesFetching) {
      lastHandledRefreshId.current = refreshRequestId;
      refetchMetrics?.();
      refetchMetadata?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshRequestId, edgesLoading, edgesFetching, facilityIdsKey]);

  const refetch = () => {
    refetchEdges?.();
    setRefreshRequestId((id) => id + 1);
  };

  return { rows, descendantIds, allFacilityIds, facilityMetadataMap, isLoading, error, refetch };
};

export default useStockSummaryAggregate;
