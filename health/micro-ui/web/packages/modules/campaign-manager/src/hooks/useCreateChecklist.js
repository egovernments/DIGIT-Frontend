import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import createChecklistService from "./services/createChecklistService";

const useCreateChecklist = (tenantId) => {
  const mutationFn = useCallback(
    async (reqData) => {
      const res = await createChecklistService(reqData, tenantId);
      return res;
    },
    [tenantId]
  );

  return useMutation({
    mutationFn,
  });
};

export default useCreateChecklist;
