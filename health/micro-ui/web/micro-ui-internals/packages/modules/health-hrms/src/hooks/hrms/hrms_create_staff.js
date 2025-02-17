import { useQuery, useMutation } from "react-query";
import { StaffService } from "../../services/hrms/Staff_service";

export const useHRMSStaffCreate = (tenantId, config = {}) => {
  return useMutation((data) => StaffService.createStaff(data));
};

export default useHRMSStaffCreate;
