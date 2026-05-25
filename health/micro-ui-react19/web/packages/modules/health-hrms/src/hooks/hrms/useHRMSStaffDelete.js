import { useMutation } from "@tanstack/react-query";
import { StaffService } from "../../services/hrms/StaffService";

export const useHRMSStaffDelete = (tenantId, config = {}) => {
  return useMutation({ mutationFn: (data) => StaffService.delete_staff(data) });
};

export default useHRMSStaffDelete;
