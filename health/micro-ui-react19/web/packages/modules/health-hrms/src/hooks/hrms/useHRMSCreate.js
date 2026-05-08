import { useMutation } from "@tanstack/react-query";
import HrmsService from "../../services/hrms/HRMSService";

const useHRMSCreate = (tenantId, config = {}) => {
  return useMutation({
    mutationFn: (data) => HrmsService.create(data, tenantId),
    ...config,
  });
};

export default useHRMSCreate;
