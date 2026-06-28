import { useQueries } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ProjectService from "../services/ProjectService";

const useInboxSearch = ({ state, body, params, config = {} }) => {
  const { campaignName, campaignType } = state?.searchForm || {};
  const nowEpoch = Date.now();
  const campaignTypeCode = campaignType?.[0]?.code;

  const [staffResponse, setStaffResponse] = useState(null);

  const fetchStaff = async () => {
    try {
      const staffData = await ProjectService.staffSearch({ body, params });
      setStaffResponse(staffData);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  useEffect(() => {
    if (state?.searchForm && Object.keys(state?.searchForm).length !== 0) {
      fetchStaff();
    }
  }, []);

  const projectQueries = useQueries({
    queries: (staffResponse || []).map((staff) => {
      const pastCampaignsInbox = Digit.SessionStorage.get("HCM_SELECTED_TAB_INDEX") === 1;
      const liveCampaignsInbox = Digit.SessionStorage.get("HCM_SELECTED_TAB_INDEX") === 2;

      const EARLIEST_CAMPAIGN_DATE = -5353313289000;

      const filter = {
        id: staff.projectId,
        tenantId: Digit.ULBService.getCurrentTenantId(),
        name: campaignName,
        projectType: campaignTypeCode,
      };

      if (pastCampaignsInbox) {
        filter.startDate = EARLIEST_CAMPAIGN_DATE;
        filter.endDate = nowEpoch - 24 * 60 * 60 * 1000;
      } else if (liveCampaignsInbox) {
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
    }),
  });

  const isLoading = projectQueries.some((q) => q.isLoading);
  const isFetching = projectQueries.some((q) => q.isFetching);

  const projects =
    projectQueries
      .map((q) => q.data)
      .filter(Boolean)
      .flat() || [];

  const refetch = async () => {
    await fetchStaff();
    await Promise.all(projectQueries.map((q) => q.refetch()));
  };

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
    revalidate: () => {},
  };
};

export default useInboxSearch;
