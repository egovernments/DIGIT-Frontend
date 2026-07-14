import { useEffect, useState } from "react";
import { useQuery } from "react-query";

const reportsInProgressService = async ({ tenantId, campaignIdentifier, reportName }) => {
  const response = await Digit.CustomService.getResponse({
    url: "/airflow-trigger-api/api/reports-in-progress",
    body: { tenantId, campaignIdentifier, reportName },
    // CustomService caches identical url+body forever in window.Digit.RequestCache -
    // this body never varies, so without this every poll would silently replay the
    // very first response instead of hitting the network.
    useCache: false,
  });
  return response?.data || [];
};

// Polls every 20s, but ONLY while the last fetch actually returned something in
// progress - otherwise this would hit the network forever even when nothing is
// running. react-query 3.6.1 (pinned here) passes refetchInterval straight to
// setInterval as a plain number/false - it doesn't support the newer
// (data) => number|false function form - so the on/off toggle is driven by local
// state instead, updated whenever the query's data changes. The very first fetch
// on mount always happens regardless (refetchInterval only governs the recurring
// poll), and a manual refetch() (e.g. right after triggering a new report) still
// works and re-arms polling once it resolves non-empty.
const useReportsInProgress = ({ tenantId, campaignIdentifier, reportName, config = {} }) => {
  const [hasInProgress, setHasInProgress] = useState(false);

  const query = useQuery(
    ["REPORTS_IN_PROGRESS", tenantId, campaignIdentifier, reportName],
    () => reportsInProgressService({ tenantId, campaignIdentifier, reportName }),
    {
      enabled: !!tenantId,
      refetchInterval: hasInProgress ? 20000 : false,
      refetchIntervalInBackground: false,
      cacheTime: 0,
      ...config,
    }
  );

  useEffect(() => {
    setHasInProgress((query.data || []).length > 0);
  }, [query.data]);

  return query;
};

export default useReportsInProgress;
