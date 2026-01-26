import { useMutation } from "@tanstack/react-query";
import createMdmsChecklistService from "./services/createMdmsChecklistService";

const useCreateMdmsChecklist = (tenantId,isUpdate) => {
  return useMutation({mutationFn: (reqData) => {
    return createMdmsChecklistService(reqData, isUpdate);
  }});
};

export default useCreateMdmsChecklist;