import { useMutation } from "@tanstack/react-query";
import HrmsService from "../../services/hrms/HRMSService";

export const useHRMSCreate = (tenantId, config = {}) => {
  return useMutation({ mutationFn: (data) => HrmsService.create(data, tenantId) });
};

export default useHRMSCreate;
