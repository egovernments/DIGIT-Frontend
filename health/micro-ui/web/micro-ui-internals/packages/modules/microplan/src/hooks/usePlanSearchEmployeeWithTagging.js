import { useQuery } from "react-query";
import searchPlanEmployeeWithTaggingConfig from "./services/searchPlanEmployeeWithTaggingConfig";

const usePlanSearchEmployeeWithTagging = ({ tenantId, body, limit = 5, offset = 0, config = {} }) => {
  return useQuery(
    ["PLAN_SEARCH_EMPLOYEE_WITH_TAGGING", tenantId, body, limit, offset, config?.queryKey],
    () => searchPlanEmployeeWithTaggingConfig({ tenantId, body, limit, offset,}),
    {
      ...config,
    }
  );
};

export default usePlanSearchEmployeeWithTagging;
