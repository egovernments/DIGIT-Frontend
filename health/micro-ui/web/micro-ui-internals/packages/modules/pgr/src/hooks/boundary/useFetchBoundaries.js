import fetchBoundaries from "../../services/boundary/BoundaryService";
import { useQuery } from "react-query";

const useFetchBoundaries = (tenantId, config = {}) => {
    
  return useQuery(["FETCH_BOUNDARIES",], () => fetchBoundaries({tenantId}), config);
};

export default useFetchBoundaries;