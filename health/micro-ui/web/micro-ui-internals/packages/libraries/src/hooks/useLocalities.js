import { useQuery } from "@tanstack/react-query";
import { getLocalities } from "../services/molecules/getLocalities";
import { LocalityService } from "../services/elements/Localities";

const useLocalities = (tenant, boundaryType = "admin", config, t) => {
  return useQuery({
    queryKey: ["BOUNDARY_DATA", tenant, boundaryType],
    queryFn: () => getLocalities[boundaryType.toLowerCase()](tenant),
    select: (data) => {
      return LocalityService.get(data).map((key) => ({
        ...key,
        i18nkey: t(key.i18nkey),
      }));
    },
    staleTime: Infinity,
    ...config,
  });
};

export default useLocalities;
