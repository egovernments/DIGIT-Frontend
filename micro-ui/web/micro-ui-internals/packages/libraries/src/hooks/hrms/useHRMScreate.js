import { useQuery, useMutation } from "@tanstack/react-query";
import HrmsService from "../../services/elements/HRMS";

export const useHRMSCreate = (tenantId, config = {}) => {
  return useMutation({
    mutationFn: (data) => HrmsService.create(data, tenantId),
    ...config, // Spread any additional configuration passed to the hook
  });
};

export default useHRMSCreate;
