import { useQuery, useMutation } from "react-query";
import { StaffService } from "../../services/hrms/Staff_service";

export const useHRMSStaffDelete = (tenantId, config = {}) => {
  return useMutation((data) => StaffService.delete_staff(data));
};

export default useHRMSStaffDelete;
