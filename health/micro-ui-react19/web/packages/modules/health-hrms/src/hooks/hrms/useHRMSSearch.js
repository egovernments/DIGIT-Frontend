import { useQuery } from "@tanstack/react-query";
import HrmsService from "../../services/hrms/HRMSService";

export const useHRMSSearch = (searchparams, tenantId, filters, isupdated, config = {}) => {
  return useQuery({
    queryKey: ["HRMS_SEARCH", searchparams, tenantId, filters, isupdated],
    queryFn: () => HrmsService.search(tenantId, filters, searchparams),
    ...config,
    gcTime: 0,
    staleTime: 0,
  });
};

export default useHRMSSearch;
