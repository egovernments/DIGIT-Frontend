import { useQuery } from "react-query";
import searchPlanWithCensus from "./services/searchPlanWithCensus";
const usePlanSearchWithCensus = ({ tenantId, microplanId, body, limit = 5, offset = 0, roles, config = {} }) => {
  return useQuery(
    ["PLAN_SEARCH_EMPLOYEE_WITH_TAGGING", tenantId, microplanId, body, limit, offset, roles, config?.queryKey],
    () => searchPlanWithCensus({ tenantId, microplanId, body, limit, offset, roles }),
    {
      ...config,
    }
  );
};

export default usePlanSearchWithCensus;
