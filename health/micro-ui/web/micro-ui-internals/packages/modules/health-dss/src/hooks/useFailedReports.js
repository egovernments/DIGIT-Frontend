import { useQuery } from "react-query";

const failedReportsService = async ({ tenantId, campaignIdentifier, reportName }) => {
  const response = await Digit.CustomService.getResponse({
    url: "/airflow-trigger-api/api/report-status",
    body: { tenantId, campaignIdentifier, reportName, latestOnly: true },
    // Same reasoning as useReportsInProgress - this body never varies for a given report,
    // so CustomService's default useCache:true would otherwise replay the very first response.
    useCache: false,
  });
  return (response?.data || []).filter((row) => row?.isFailed);
};

// Unlike useReportsInProgress, failures don't need a live 20s poll - a failed run's status
// doesn't change on its own, so a plain fetch-on-mount (refetch() available for on-demand
// refresh) is enough.
const useFailedReports = ({ tenantId, campaignIdentifier, reportName, config = {} }) => {
  return useQuery(
    ["FAILED_REPORTS", tenantId, campaignIdentifier, reportName],
    () => failedReportsService({ tenantId, campaignIdentifier, reportName }),
    {
      enabled: !!tenantId,
      cacheTime: 0,
      ...config,
    }
  );
};

export default useFailedReports;
