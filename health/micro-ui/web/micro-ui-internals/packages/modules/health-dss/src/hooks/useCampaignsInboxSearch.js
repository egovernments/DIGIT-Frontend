import { useQuery, useQueries } from "react-query";
import ProjectService from "../services/ProjectService";

const useCampaignsInboxSearch = ({ body, params, config = {} }) => {
  // Step 1: Fetching project staff
  const data1 = {
    ProjectStaff: {
      staffId: [Digit.UserService.getUser().info.uuid],
    },
  };
  const staffQuery = useQuery(["STAFF_SEARCH", body, config.queryKey], () => ProjectService.staffSearch({ body: data1, params }), { ...config });

  // Step 2: Fetching projects using each projectId from staff response
  const projectQueries = useQueries(
    (staffQuery?.data || []).map((staff) => ({
      queryKey: ["PROJECT_SEARCH_BY_ID", staff.projectId],
      queryFn: () =>
        ProjectService.projectSearch({
          body: {
            Projects: [
              {
                id: staff.projectId,
                tenantId: Digit.ULBService.getCurrentTenantId(),
              },
            ],
          },
          params: params,
        }),
      enabled: !!staffQuery,
    }))
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
