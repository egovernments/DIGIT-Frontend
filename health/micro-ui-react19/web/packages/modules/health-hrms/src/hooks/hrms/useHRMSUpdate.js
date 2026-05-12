import { useMutation } from "@tanstack/react-query";
import HrmsService from "../../services/hrms/HRMSService";

export const useHRMSUpdate = (tenantId, config = {}) => {
  return useMutation({ mutationFn: (data) => HrmsService.update(data, tenantId) });
};

export default useHRMSUpdate;
