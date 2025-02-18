import { useQuery, useMutation } from "react-query";
import HrmsService from "../../services/hrms/HRMS_service";

export const useHRMSUpdate = (tenantId, config = {}) => {
  return useMutation((data) => HrmsService.update(data, tenantId));
};

export default useHRMSUpdate;
