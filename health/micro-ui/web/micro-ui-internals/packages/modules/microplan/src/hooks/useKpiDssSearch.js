import { useQuery } from "react-query";
import { useMyContext } from "../utils/context";
import searchDssChartV2 from "./services/searchDssChartV2";

const useKpiDssSearch = (moduleAndPlanConfig) => {
    const { state } = useMyContext();
    const module = moduleAndPlanConfig?.module;
    const planId = moduleAndPlanConfig?.planId;
    const campaignType = moduleAndPlanConfig?.campaignType;
    const status = moduleAndPlanConfig?.status;
    const boundaries = moduleAndPlanConfig?.boundariesForKpi;
    const config = state?.DssKpiConfigs;
    const queryString = `dss-${module}-${planId}_${campaignType}_${status}_${JSON.stringify(boundaries)}`;
    const { isLoading, data, isFetching, refetch } = useQuery([queryString, "/dashboard-analytics/dashboard/getChartV2"], () => searchDssChartV2(module, planId, status, config, campaignType, boundaries), {
        ...{},
        cacheTime: 0,
        staleTime: 0,
        onError: (err) => console.error("Error fetching dss chart:", err),
    });

    return {
        isLoading,
        isFetching,
        data,
        refetch,
        revalidate: () => { },
    };
};

export default useKpiDssSearch;
