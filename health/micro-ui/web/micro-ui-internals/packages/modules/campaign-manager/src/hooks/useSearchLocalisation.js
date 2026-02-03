import { useQuery } from "react-query";
import searchLocalisationService from "./services/searchLocalisationService";

export const useSearchLocalisation = ({ queryKey="", tenantId, params = {}, module, locale, isMultipleLocale, fetchCurrentLocaleOnly, config = {} }) => {
  return useQuery(
    [`SEARCH_APP_LOCALISATION_${queryKey}`, tenantId, module, fetchCurrentLocaleOnly],
    () => searchLocalisationService({ tenantId, params, module, locale, isMultipleLocale, fetchCurrentLocaleOnly }),
    config
  );
};
