import { useQuery, useQueries } from "react-query";
import { useLocation } from "react-router-dom";
import ProjectService from "../services/ProjectService";

const useCampaignsInboxSearch = ({ body, params, config = {} }) => {
  const { pathname } = useLocation();
  const nowEpoch = Date.now();

  // Step 1: Fetching project staff
  const staffQuery = useQuery(["STAFF_SEARCH", body, config.queryKey], () => ProjectService.staffSearch({ body, params }), { ...config });

  // Step 2: Fetching projects using each projectId from staff response
  const projectQueries = useQueries(
    (staffQuery?.data || []).map((staff) => {
      const pastCampaignsInbox = pathname.includes("past-campaigns");
      const liveCampaignsInbox = pathname.includes("live-campaigns");

      const filter = {
        id: staff.projectId,
        tenantId: Digit.ULBService.getCurrentTenantId(),
        // name: body.state?.filterValues?.campaignName || "",
      };

      // Add date filters based on the URL
      if (pastCampaignsInbox) {
        // startdate earlier and end date one day less than todays date
        filter.startDate = -5353313289000;
        filter.endDate = nowEpoch - 24 * 60 * 60 * 1000;
      }
      // TODO : need to update the luve campaigns filter once verified
      //  else if (liveCampaignsInbox) {
      //   filter.startDate = nowEpoch;
      //   filter.endDate = nowEpoch + (365 * 24 * 60 * 60 * 1000) + 1000;
      // }
      return {
        queryKey: ["PROJECT_SEARCH_BY_ID", staff.projectId],
        queryFn: () =>
          ProjectService.projectSearch({
            body: { Projects: [filter] },
            params: params,
          }),
        enabled: !!staffQuery,
      };
    })
  );

  // Step 3: Handling loading/error states
  const isLoading = staffQuery.isLoading || projectQueries.some((q) => q.isLoading);
  const isFetching = staffQuery.isFetching || projectQueries.some((q) => q.isFetching);

  // Step 4: Combining all project results
  const projects =
    projectQueries
      .map((q) => q.data)
      .filter(Boolean)
      .flat() || [];

  // Step 5: Aggregate refetch function
  const refetch = async () => {
    await staffQuery.refetch();
    await Promise.all(projectQueries.map((q) => q.refetch()));
  };

  return {
    isLoading,
    isFetching,
    data: {
      Project: projects,
    },
    refetch,
    revalidate: () => {},
  };
};

export default useCampaignsInboxSearch;
