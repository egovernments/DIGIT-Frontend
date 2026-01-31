import { useMutation } from "react-query";
import planEmployeeUpdateService from "./services/planEmployeeUpdateService";

const usePlanEmployeeUpdate = (tenantId) => {
  return useMutation((reqData) => {
    return planEmployeeUpdateService(reqData, tenantId);
  });
};

export default usePlanEmployeeUpdate;
