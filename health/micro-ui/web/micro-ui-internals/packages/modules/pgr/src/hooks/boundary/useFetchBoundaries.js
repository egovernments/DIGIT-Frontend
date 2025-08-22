import fetchBoundaries from "../../services/boundary/BoundaryService";
import { useQuery } from "react-query";

const useFetchBoundaries = ({tenantId, hierarchyType, config = {}}) => {
    
  return useQuery(["FETCH_BOUNDARIES",tenantId, hierarchyType], () => fetchBoundaries({tenantId, hierarchyType}), config);
};

export default useFetchBoundaries; 