import { useQuery, useQueryClient } from "@tanstack/react-query";
import HrmsService from "../../services/elements/HRMS";

export const useHRMSSearch = (searchparams, tenantId, filters, isupdated, config = {}) => {
  return useQuery({
    queryKey: ["HRMS_SEARCH", searchparams, tenantId, filters, isupdated],
    queryFn: () => HrmsService.search(tenantId, filters, searchparams),
    ...config
  });
};

export default useHRMSSearch;
