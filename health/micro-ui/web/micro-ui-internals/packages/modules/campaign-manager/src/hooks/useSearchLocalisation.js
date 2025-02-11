import { useQuery } from "react-query";
import searchLocalisationService from "./services/searchLocalisationService";

export const useSearchLocalisation = ({ tenantId, params = {}, module, locale, isMultipleLocale, config = {} }) => {
  return useQuery(
    ["SEARCH_APP_LOCALISATION", tenantId, params, module, locale, isMultipleLocale, config],
    () => searchLocalisationService({ tenantId, params, module, locale, isMultipleLocale }),
    config
  );
};
