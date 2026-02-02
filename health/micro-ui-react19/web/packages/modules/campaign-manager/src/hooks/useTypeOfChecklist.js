import { useMutation } from "@tanstack/react-query";
import createTypeOfChecklist from "./services/createTypeOfChecklist";

const useTypeOfChecklist = (tenantId, config = {}) => {
  return useMutation({
    mutationFn: async (reqData) => {
      return await createTypeOfChecklist(reqData, tenantId);
    },
    ...config,
  });
};

export default useTypeOfChecklist;
