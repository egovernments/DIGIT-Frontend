import { useQuery } from "react-query";
import searchLocalisationService from "./services/searchLocalisationService";

export const useSearchLocalisation = ({ tenantId, params = {}, module, locale, isMultipleLocale, config = {} }) => {
  return useQuery(
    ["SEARCH_APP_LOCALISATION", tenantId, module],
    () => searchLocalisationService({ tenantId, params, module, locale, isMultipleLocale }),
    config
  );
};
