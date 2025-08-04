import { useQuery, useMutation } from "react-query";
import { StaffService } from "../../services/hrms/StaffService";

export const useHRMSStaffDelete = (tenantId, config = {}) => {
  return useMutation((data) => StaffService.delete_staff(data));
};

export default useHRMSStaffDelete;
