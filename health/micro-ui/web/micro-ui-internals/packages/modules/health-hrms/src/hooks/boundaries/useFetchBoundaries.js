import fetchBoundaries from "../../services/boundary/boundary_search";
import { useQuery } from "react-query";

const useBoundriesFetch = (tenantId) => {
    debugger
  return useQuery(["FETCH_BOUNDRIES",], () => fetchBoundaries({tenantId}));
};

export default useBoundriesFetch;