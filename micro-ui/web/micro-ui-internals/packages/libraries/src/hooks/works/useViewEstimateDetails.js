import { WorksSearch } from "../../services/molecules/Works/Search";
import { useQuery } from "react-query";

const useViewEstimateDetails = (t, tenantId,estimateNumber, config = {cacheTime:0}) => {
    return useQuery(
        ["ESTIMATE_WORKS_SEARCH", "ESTIMATE_SEARCH", tenantId, estimateNumber],
        () => WorksSearch.viewEstimateScreen(t, tenantId, estimateNumber),
        config
    );
}

export default useViewEstimateDetails