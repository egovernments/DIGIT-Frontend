import { useQuery } from "react-query";
import SearchHRMSEmployeeConfig from "./services/SearchHRMSEmployeeConfig";

const useSearchHRMSEmployee = ({ tenantId, body, limit = 5, offset = 0, roles, microplanId, filters = {}, config = {} }) => {
  return useQuery(
    ["SEARCH_EMPLOYEE_HRMS_WITH_PLANTAG", tenantId, body, limit, offset, roles, microplanId, filters, config?.queryKey],
    () => SearchHRMSEmployeeConfig({ tenantId, body, limit, offset, roles, microplanId, filters }),
    {
      ...config,
    }
  );
};

export default useSearchHRMSEmployee;
