import { useQuery } from "react-query";
import searchPlanEmployeeConfig from "./services/searchPlanEmployeeConfig";

const usePlanSearchEmployee = ({ tenantId, body, limit = 5, offset = 0, roles, config = {} }) => {
  return useQuery(
    ["PLAN_SEARCH_EMPLOYEE", tenantId, body, limit, offset, roles, config?.queryKey],
    () => searchPlanEmployeeConfig({ tenantId, body, limit, offset, roles }),
    {
      ...config,
    }
  );
};

export default usePlanSearchEmployee;
