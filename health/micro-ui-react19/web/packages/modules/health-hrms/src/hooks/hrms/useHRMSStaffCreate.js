import { useMutation } from "@tanstack/react-query";
import { StaffService } from "../../services/hrms/StaffService";

const useHRMSStaffCreate = (tenantId, config = {}) => {
  return useMutation({
    mutationFn: (data) => StaffService.createStaff(data),
    ...config,
  });
};

export default useHRMSStaffCreate;
