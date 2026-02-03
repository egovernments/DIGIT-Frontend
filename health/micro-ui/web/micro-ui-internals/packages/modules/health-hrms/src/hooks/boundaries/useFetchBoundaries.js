import fetchBoundaries from "../../services/boundary/BoundarySearch";
import { useQuery } from "react-query";

const useBoundriesFetch = ({tenantId, hierarchyType, config = {}}) => {
    
  return useQuery(["FETCH_BOUNDRIES", tenantId, hierarchyType], () => fetchBoundaries({tenantId, hierarchyType}), config);
};

export default useBoundriesFetch;