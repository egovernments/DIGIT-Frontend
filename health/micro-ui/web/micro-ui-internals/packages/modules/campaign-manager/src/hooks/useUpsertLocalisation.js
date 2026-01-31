import { useMutation } from "react-query";
import createLocalisationService from "./services/createLocalisationService";

const useUpsertLocalisation = (tenantId, module, locale) => {
  return useMutation((reqData) => {
    return createLocalisationService(reqData, tenantId, module, locale);
  });
};

export default useUpsertLocalisation;
