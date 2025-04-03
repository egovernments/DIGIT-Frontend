import fetchBoundaries from "../../services/boundary/BoundaryService";
import { useQuery } from "react-query";

const useFetchBoundaries = (tenantId) => {
    
  return useQuery(["FETCH_BOUNDARIES",], () => fetchBoundaries({tenantId}));
};

export default useFetchBoundaries;