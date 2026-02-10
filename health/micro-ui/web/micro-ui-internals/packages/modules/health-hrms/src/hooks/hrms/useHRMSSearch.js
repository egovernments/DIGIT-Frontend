import { useQuery, useQueryClient } from "react-query";
import HrmsService from "../../services/hrms/HRMSService";

export const useHRMSSearch = (searchparams, tenantId, filters, isupdated, config = {}) => {
  return useQuery(["HRMS_SEARCH", searchparams, tenantId, filters, isupdated], () => HrmsService.search(tenantId, filters, searchparams), {
    cacheTime: 0,
    staleTime: 0,
    ...config,
  });
};

export default useHRMSSearch;
