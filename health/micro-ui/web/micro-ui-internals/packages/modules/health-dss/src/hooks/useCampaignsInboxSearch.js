import { useQueries } from "react-query";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProjectService from "../services/ProjectService";

const useCampaignsInboxSearch = ({ state, body, params, config = {} }) => {
  const { pathname } = useLocation();
  const nowEpoch = Date.now();
  const campaignTypes = state?.filterForm?.inboxFilter?.filterValues?.campaignType || [];
  const boundaryTypes = state?.filterForm?.inboxFilter?.filterValues?.boundary || [];
  const dateRange = state?.searchForm?.dateRange || "";

  // Step 1: State to store the staff data
  const [staffResponse, setStaffResponse] = useState(null);

  // Step 2: Fetching project staff
  const fetchStaff = async () => {
    try {
      const staffData = await ProjectService.staffSearch({ body, params });
      setStaffResponse(staffData);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  // Step 3: Call fetchStaff once on mount and when body/params change
  useEffect(() => {
    fetchStaff();
  }, []);

  // Step 4: Fetching projects using each projectId from staff response
  const projectQueries = useQueries(
    (staffResponse || []).map((staff) => {
      const pastCampaignsInbox = pathname.includes("past-campaigns");
      const liveCampaignsInbox = pathname.includes("live-campaigns");

      const filter = {
        id: staff.projectId,
        tenantId: Digit.ULBService.getCurrentTenantId(),
      };

      // Add date filters based on the URL
      if (pastCampaignsInbox) {
        // startdate earlier and end date one day less than todays date
        filter.startDate = -5353313289000;
        filter.endDate = nowEpoch - 24 * 60 * 60 * 1000;
      }
      // TODO : need to update the live campaigns filter once verified
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
        enabled: !!staffResponse,
      };
    })
  );

  // Step 5: Handling loading/error states
  const isLoading = projectQueries.some((q) => q.isLoading);
  const isFetching = projectQueries.some((q) => q.isFetching);

  // Step 6: Combining all project results
  const projects =
    projectQueries
      .map((q) => q.data)
      .filter(Boolean)
      .flat() || [];

  // Step 7: Aggregate refetch function
  const refetch = async () => {
    await fetchStaff();
    await Promise.all(projectQueries.map((q) => q.refetch()));
  };

  // Step 8: Refetching the data when the body or params changes
  useEffect(() => {
    refetch();
  }, [dateRange, campaignTypes, boundaryTypes, body, params?.limit, params?.offset, config?.queryKey]);

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
