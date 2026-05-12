import { useMutation } from "@tanstack/react-query";
import { StaffService } from "../../services/hrms/StaffService";

export const useHRMSStaffCreate = (tenantId, config = {}) => {
  return useMutation({ mutationFn: (data) => StaffService.createStaff(data) });
};

export default useHRMSStaffCreate;
