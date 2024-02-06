import { useQuery } from "react-query";
import { WorksService } from "../../services/elements/Works";

const useSearchOrg = (payload,config) => {
    return useQuery(["ORG_SEARCH",payload], () => WorksService.searchOrg(payload),config)
}

export default useSearchOrg;