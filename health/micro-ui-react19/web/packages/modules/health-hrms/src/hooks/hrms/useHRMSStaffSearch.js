import { useMutation } from "@tanstack/react-query";
import { StaffService } from "../../services/hrms/StaffService";

export const useHRMSStaffSearch = (tenantId, config = {}) => {
  return useMutation({ mutationFn: (data) => StaffService.search_staff(data, tenantId) });
};

export default useHRMSStaffSearch;
