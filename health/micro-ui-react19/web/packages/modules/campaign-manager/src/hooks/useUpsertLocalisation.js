import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import createLocalisationService from "./services/createLocalisationService";

const useUpsertLocalisation = (tenantId, module, locale, config = {}) => {
  const mutationFn = useCallback(
    (reqData) => createLocalisationService(reqData, tenantId, module, locale),
    [tenantId, module, locale]
  );

  return useMutation({
    mutationFn,
    ...config,
  });
};

export default useUpsertLocalisation;
