import { useMutation } from "@tanstack/react-query";
import HrmsService from "../../services/hrms/HRMSService";

const useHRMSUpdate = (tenantId, config = {}) => {
  return useMutation({
    mutationFn: (data) => HrmsService.update(data, tenantId),
    ...config,
  });
};

export default useHRMSUpdate;
