import { useQuery, useMutation } from "react-query";
import HrmsService from "../../services/hrms/HRMSService";

export const useHRMSCreate = (tenantId, config = {}) => {
  return useMutation((data) => HrmsService.create(data, tenantId));
};

export default useHRMSCreate;
