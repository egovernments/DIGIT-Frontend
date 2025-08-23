import { useQuery } from "@tanstack/react-query";
import { getLocalities } from "../services/molecules/getLocalities";
import { LocalityService } from "../services/elements/Localities";

/**
 * Hook to fetch and transform localities data based on tenant and boundary type.
 */
const useLocalities = (tenant, boundaryType = "admin", config, t, language) => {
  return useQuery({
    queryKey: ["BOUNDARY_DATA", tenant, boundaryType, language],
    queryFn: () => getLocalities[boundaryType.toLowerCase()](tenant),
    select: (data) => {
      return LocalityService.get(data).map((key) => {
        return {
          ...key,
          i18nkey: t(key.i18nkey), // Translates each i18n key using the passed function
        };
      });
    },
    staleTime: Infinity, // Prevents refetching unless manually invalidated
    ...config,
  });
};

export default useLocalities;
