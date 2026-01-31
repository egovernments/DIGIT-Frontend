import { useQuery } from "react-query";
import searchPlanEmployeeWithTaggingConfig from "./services/searchPlanEmployeeWithTaggingConfig";

const usePlanSearchEmployeeWithTagging = ({ tenantId, body, limit = 5, offset = 0, names, config = {} }) => {
  return useQuery(
    ["PLAN_SEARCH_EMPLOYEE_WITH_TAGGING", names,tenantId, body, limit, offset, config?.queryKey],
    () => searchPlanEmployeeWithTaggingConfig({ tenantId, body, limit, offset, names}),
    {
      ...config,
    }
  );
};

export default usePlanSearchEmployeeWithTagging;
