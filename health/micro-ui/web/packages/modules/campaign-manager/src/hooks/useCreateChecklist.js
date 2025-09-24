import { useMutation } from "@tanstack/react-query";
import createChecklistService from "./services/createChecklistService";

const useCreateChecklist = (tenantId) => {
  return useMutation({
    mutationFn: async (reqData) => {
      const res = await createChecklistService(reqData, tenantId);

      return res;
    },
  });
};

export default useCreateChecklist;
