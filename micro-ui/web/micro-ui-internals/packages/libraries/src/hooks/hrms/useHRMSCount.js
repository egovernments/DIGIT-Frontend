import { useQuery, useQueryClient } from "react-query";
import HrmsService from "../../services/elements/HRMS";

export const useHRMSCount = (tenantId, filters, searchparams, config = {}) => {
  return useQuery(["HRMS_COUNT", tenantId, filters, searchparams], () => HrmsService.count(tenantId, filters, searchparams), config);
};

export default useHRMSCount;
