import { useQuery, useMutation } from "react-query";
import { StaffService } from "../../services/hrms/Staff_service";

export const useHRMSStaffSearch = (tenantId, config = {}) => {
  return useMutation((data) => StaffService.search_staff(data,tenantId));
};

export default useHRMSStaffSearch;
