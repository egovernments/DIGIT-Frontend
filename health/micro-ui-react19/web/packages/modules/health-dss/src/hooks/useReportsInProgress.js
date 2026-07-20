import { useMemo } from "react";

// Polls every 5s, but ONLY while the last known response actually had something in
// progress - otherwise this would hit the network forever even when nothing is running.
// @tanstack/react-query v5's refetchInterval accepts a (query) => number|false callback,
// so the on/off toggle is derived straight from query.state.data - no extra local state
// needed to track it, and (unlike a plain boolean captured once) a transient fetch error
// doesn't reset query.state.data, so polling doesn't silently die on one bad response.
// The very first fetch on mount always happens regardless (refetchInterval only governs
// the recurring poll), and a manual refetch() (e.g. right after triggering a new report)
// re-arms polling once it resolves non-empty.
const useReportsInProgress = ({ tenantId, campaignIdentifier, reportName, config = {} }) => {
  const reqCriteria = useMemo(
    () => ({
      url: `/airflow-trigger-api/api/reports-in-progress`,
      changeQueryName: `REPORTS_IN_PROGRESS_${campaignIdentifier}_${reportName || "ALL"}`,
      body: { tenantId, campaignIdentifier, reportName },
      params: {},
      headers: {
        "auth-token": Digit.UserService.getUser()?.access_token || null,
      },
      // This body never varies between polls, so CustomService's default useCache:true
      // would otherwise replay the very first response forever instead of hitting the
      // network - exactly why a run's progress/stage would appear frozen.
      options: { useCache: false },
      config: {
        enabled: !!tenantId && !!campaignIdentifier,
        select: (data) => data?.data || [],
        gcTime: 0,
        refetchIntervalInBackground: false,
        refetchInterval: (query) => ((query?.state?.data?.data || []).length > 0 ? 5000 : false),
        ...config,
      },
    }),
    [tenantId, campaignIdentifier, reportName, config]
  );

  return Digit.Hooks.DSS.useAPIHook(reqCriteria);
};

export default useReportsInProgress;
