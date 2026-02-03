import { useMutation } from "@tanstack/react-query";
import updateChecklistService from "./services/updateChecklistService";

const useUpdateChecklist = (tenantId, config = {}) => {
  return useMutation({
    mutationFn: (reqData) => updateChecklistService(reqData, tenantId),
    ...config,
  });
};

export default useUpdateChecklist;
