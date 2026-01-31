import { useQuery, useMutation } from "react-query";
import { StaffService } from "../../services/hrms/StaffService";

export const useHRMSStaffCreate = (tenantId, config = {}) => {
  return useMutation((data) => StaffService.createStaff(data));
};

export default useHRMSStaffCreate;
