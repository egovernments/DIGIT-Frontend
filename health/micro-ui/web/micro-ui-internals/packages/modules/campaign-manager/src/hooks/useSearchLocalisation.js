import { useQuery } from "@tanstack/react-query";
import searchLocalisationService from "./services/searchLocalisationService";

export const useSearchLocalisation = ({ tenantId, params = {}, module, locale, isMultipleLocale, config = {} }) => {
  return useQuery({
    queryKey:["SEARCH_APP_LOCALISATION", tenantId, params, module, locale, isMultipleLocale, config],
    queryFn:() => searchLocalisationService({ tenantId, params, module, locale, isMultipleLocale }),
    ...config
  });
};
