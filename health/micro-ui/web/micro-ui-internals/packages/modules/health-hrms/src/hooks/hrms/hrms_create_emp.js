import { useQuery, useMutation } from "react-query";
import HrmsService from "../../services/hrms/HRMS_service";

export const useHRMSCreate = (tenantId, config = {}) => {
  return useMutation((data) => HrmsService.create(data, tenantId));
};

export default useHRMSCreate;
