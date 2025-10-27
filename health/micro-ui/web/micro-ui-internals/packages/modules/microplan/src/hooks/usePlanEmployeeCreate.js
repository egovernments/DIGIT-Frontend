import { useMutation } from "react-query";
import planEmployeeCreateService from "./services/planEmployeeCreateService";

const usePlanEmployeeCreate = (tenantId) => {
  return useMutation((reqData) => {
    return planEmployeeCreateService(reqData, tenantId);
  });
};

export default usePlanEmployeeCreate;
