import { useQuery } from "@tanstack/react-query";
import { WorksSearch } from "../services/elements/works";

const useEstimateDetailsScreen = (t, tenantId, estimateNumber, config = {}, isStateChanged = false) => {
  return useQuery({
    queryKey: ["ESTIMATE_WORKS_SEARCH", "ESTIMATE_SEARCH", tenantId, estimateNumber, isStateChanged],
    queryFn: () => WorksSearch.viewEstimateScreen(t, tenantId, estimateNumber),
    staleTime: 0,
    ...config,
  });
};

export default useEstimateDetailsScreen;
