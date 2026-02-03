import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import updateChecklistService from "./services/updateChecklistService";

const useUpdateChecklist = (tenantId, config = {}) => {
  const mutationFn = useCallback(
    async (reqData) => await updateChecklistService(reqData, tenantId),
    [tenantId]
  );

  return useMutation({
    mutationFn,
    ...config,
  });
};

export default useUpdateChecklist;
