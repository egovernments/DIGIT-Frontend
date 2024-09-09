import { useMutation } from "react-query";
import createChecklistService from "./services/createChecklistService";

const useCreateChecklist = (tenantId) => {
  return useMutation((reqData) => {
    return createChecklistService(reqData, tenantId);
  });
};

export default useCreateChecklist;
