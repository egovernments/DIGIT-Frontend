import { WorksSearch } from "../../services/molecules/Works/Search";
import { useQuery } from "react-query";

const useViewLOIDetails = (t, tenantId, loiNumber,subEstiamteNumber, config = {}) => {
    
    return useQuery(
        ["LOI_WORKS_SEARCH", "LOI_SEARCH", tenantId, loiNumber, subEstiamteNumber],
        () => WorksSearch.viewLOIScreen(t, tenantId, loiNumber, subEstiamteNumber),
        config
    );
}

export default useViewLOIDetails