import { useMutation } from "@tanstack/react-query";
import createLocalisationService from "./services/createLocalisationService";

const useUpsertLocalisation = (tenantId, module, locale, config = {}) => {
  return useMutation({
    mutationFn: (reqData) => createLocalisationService(reqData, tenantId, module, locale),
    ...config,
  });
};

export default useUpsertLocalisation;
