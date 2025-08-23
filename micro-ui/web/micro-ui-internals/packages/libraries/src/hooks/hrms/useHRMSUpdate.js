import { useQuery, useMutation } from "@tanstack/react-query";
import HrmsService from "../../services/elements/HRMS";

export const useHRMSUpdate = (tenantId, config = {}) => {
  return useMutation({
    mutationFn: (data) => HrmsService.update(data, tenantId),
    ...config, // Spread any additional configuration passed to the hook
  });
};

export default useHRMSUpdate;
