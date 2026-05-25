import { useQuery, useQueryClient } from "@tanstack/react-query";
import PGRService from "../../services/pgr/PGRService";

export const usePGRSearch = (searchparams, tenantId, filters, config = {}) => {
  const queryClient = useQueryClient();
  const { isLoading, error, isError, data } = useQuery({
    queryKey: ["PGR_SEARCH", searchparams, tenantId, filters],
    queryFn: () => PGRService.search(tenantId, filters, searchparams),
    ...config,
  });

  return {
    isLoading,
    error,
    isError,
    data,
    revalidate: () => queryClient.invalidateQueries({ queryKey: ["PGR_SEARCH", searchparams, tenantId, filters] }),
  };
};

export default usePGRSearch;
