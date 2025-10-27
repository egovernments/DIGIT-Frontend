import { useQuery, useQueryClient } from "react-query";
import PGRService from "../../services/pgr/PGRService";

export const usePGRSearch = (searchparams, tenantId, filters, config = {}) => {
  const queryClient = useQueryClient();
  const { isLoading, error, isError, data } = useQuery(["PGR_SEARCH", searchparams, tenantId, filters,], () => PGRService.search(tenantId, filters, searchparams), config);

  return { isLoading, error, isError, data, revalidate: () => queryClient.invalidateQueries(["PGR_SEARCH", searchparams, tenantId, filters,]) };
};

export default usePGRSearch;