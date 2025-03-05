import { useQuery, useQueryClient } from "@tanstack/react-query";
import HrmsService from "../../services/elements/HRMS";

export const useHRMSCount = (tenantId, config = {}) => {
  return useQuery({
    queryKey: ['HRMS_COUNT', tenantId],
    queryFn: () => HrmsService.count(tenantId),
    ...config,
  });
};

export default useHRMSCount;
