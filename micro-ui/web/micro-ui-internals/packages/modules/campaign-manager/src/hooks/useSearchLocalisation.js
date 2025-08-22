import { useQuery } from "@tanstack/react-query";
import searchLocalisationService from "./services/searchLocalisationService";

export const useSearchLocalisation = ({
  queryKey = "",
  tenantId,
  params = {},
  module,
  locale,
  isMultipleLocale,
  fetchCurrentLocaleOnly,
  config = {},
}) => {
  return useQuery({
    queryKey: [`SEARCH_APP_LOCALISATION_${queryKey}`, tenantId, module, fetchCurrentLocaleOnly],
    queryFn: () => searchLocalisationService({ tenantId, params, module, locale, isMultipleLocale, fetchCurrentLocaleOnly }),
    ...config,
  });
};
