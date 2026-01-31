import { useMutation } from "@tanstack/react-query";
import createChecklistService from "./services/createChecklistService";

const useCreateChecklist = (tenantId) => {
  return useMutation({
    mutationFn: (reqData) => createChecklistService(reqData, tenantId),
  });
};

export default useCreateChecklist;
