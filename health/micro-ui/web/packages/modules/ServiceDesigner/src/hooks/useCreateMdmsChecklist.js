import { useMutation } from "react-query";
import createMdmsChecklistService from "./services/createMdmsChecklistService";

const useCreateMdmsChecklist = (tenantId,isUpdate) => {
  return useMutation((reqData) => {
    return createMdmsChecklistService(reqData, isUpdate);
  });
};

export default useCreateMdmsChecklist;