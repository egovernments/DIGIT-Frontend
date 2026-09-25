// Pre-flight check before triggering a CUSTOM report: does a completed/in-progress/
// failed run already exist for this exact campaign+report+date-range? Backed by
// POST /airflow-trigger-api/api/reports-check-existing.
export const checkExistingCustomReport = async ({ tenantId, campaignIdentifier, reportName, customStartDate, customEndDate }) => {
  return Digit.CustomService.getResponse({
    url: `/airflow-trigger-api/api/reports-check-existing`,
    body: { tenantId, campaignIdentifier, reportName, customStartDate, customEndDate },
    // Same range can be checked more than once in a session (e.g. after a retry) -
    // CustomService's default useCache:true would otherwise replay a stale verdict.
    useCache: false,
  });
};
