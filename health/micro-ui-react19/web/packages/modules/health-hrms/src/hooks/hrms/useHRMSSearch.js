import { useQuery } from "@tanstack/react-query";
import HrmsService from "../../services/hrms/HRMSService";

const useHRMSSearch = (searchparams, tenantId, filters, isupdated, config = {}) => {
  return useQuery({
    queryKey: ["HRMS_SEARCH", searchparams, tenantId, filters, isupdated],
    queryFn: () => HrmsService.search(tenantId, filters, searchparams),
    gcTime: 0,
    staleTime: 0,
    ...config,
  });
};

export default useHRMSSearch;
