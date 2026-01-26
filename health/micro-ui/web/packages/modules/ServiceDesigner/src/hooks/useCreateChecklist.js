import { useMutation } from "@tanstack/react-query";
import createChecklistService from "./services/createChecklistService";

const useCreateChecklist = (tenantId) => {
  return useMutation({
    mutationFn: (reqData) => {
      let val = createChecklistService(reqData, tenantId);
      val.then(result => {
        // handle result if needed
      });
      return val;
    }
  });
};

export default useCreateChecklist;