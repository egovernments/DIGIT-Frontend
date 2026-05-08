import { useQuery } from "@tanstack/react-query";
import fetchBoundaries from "../../services/boundary/BoundarySearch";

const useBoundriesFetch = ({ tenantId, hierarchyType, config = {} }) => {
  return useQuery({
    queryKey: ["FETCH_BOUNDRIES", tenantId, hierarchyType],
    queryFn: () => fetchBoundaries({ tenantId, hierarchyType }),
    ...config,
  });
};

export default useBoundriesFetch;
