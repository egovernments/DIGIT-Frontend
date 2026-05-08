import { useMutation } from "@tanstack/react-query";
import { StaffService } from "../../services/hrms/StaffService";

const useHRMSStaffDelete = (tenantId, config = {}) => {
  return useMutation({
    mutationFn: (data) => StaffService.delete_staff(data),
    ...config,
  });
};

export default useHRMSStaffDelete;
