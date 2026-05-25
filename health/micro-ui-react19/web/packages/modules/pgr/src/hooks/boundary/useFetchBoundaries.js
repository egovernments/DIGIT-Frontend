import fetchBoundaries from "../../services/boundary/BoundaryService";
import { useQuery } from "@tanstack/react-query";

const useFetchBoundaries = ({ tenantId, hierarchyType, config = {} }) => {
  return useQuery({
    queryKey: ["FETCH_BOUNDARIES", tenantId, hierarchyType],
    queryFn: () => fetchBoundaries({ tenantId, hierarchyType }),
    ...config,
  });
};

export default useFetchBoundaries;
