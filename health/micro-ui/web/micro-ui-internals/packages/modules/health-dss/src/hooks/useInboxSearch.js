import { useQueries } from "react-query";
import { useEffect, useState } from "react";
import ProjectService from "../services/ProjectService";

//TODO : We need to show past,live and future campaigns as the api doesnot support this we are showing all campaigns in one tab and past in one tab need to update filter for live campaigns once enhancememnt is done in the api
const useInboxSearch = ({ state, body, params, config = {} }) => {
  const { campaignName, campaignType } = state?.searchForm || {};
  const nowEpoch = Date.now();
  const campaignTypeCode = campaignType?.[0]?.code;

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
    if (state?.searchForm && Object.keys(state?.searchForm).length !== 0) {
      fetchStaff();
    }
  }, []);

  // Step 4: Fetching projects using each projectId from staff response
  const projectQueries = useQueries(
    (staffResponse || []).map((staff) => {
      const pastCampaignsInbox = Digit.SessionStorage.get("HCM_SELECTED_TAB_INDEX") === 1;
      const liveCampaignsInbox = Digit.SessionStorage.get("HCM_SELECTED_TAB_INDEX") === 2;

      // Constants for date filtering
      const EARLIEST_CAMPAIGN_DATE = -5353313289000; // Represents earliest possible campaign date

      const filter = {
        id: staff.projectId,
        tenantId: Digit.ULBService.getCurrentTenantId(),
        name: campaignName,
        projectType: campaignTypeCode,
      };

      // Add date filters based on the tab selected
      if (pastCampaignsInbox) {
        // startdate earlier and end date one day less than todays date
        filter.startDate = EARLIEST_CAMPAIGN_DATE;
        filter.endDate = nowEpoch - 24 * 60 * 60 * 1000;
      }

      // TODO : need to update the live campaigns filter once verified
      else if (liveCampaignsInbox) {
        filter.startDate = nowEpoch;
        filter.endDate = nowEpoch + 2 * 365 * 24 * 60 * 60 * 1000;
      }

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
    if (state?.searchForm && Object.keys(state?.searchForm).length !== 0) {
      refetch();
    }
  }, [campaignName, campaignTypeCode, body, params?.limit, params?.offset, config?.queryKey]);

  return {
    isLoading,
    isFetching,
    data: {
      Project: projects,
    },
    refetch,
    revalidate: () => { },
  };
};

export default useInboxSearch;
