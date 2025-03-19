import { useQuery, useQueryClient } from "react-query";
import PGRService from "../../services/pgr/PGRService";

export const usePGRSearch = (searchparams, tenantId, filters, isupdated, config = {}) => {
  return useQuery(["PGR_SEARCH", searchparams, tenantId, filters, isupdated], () => PGRService.search(tenantId, filters, searchparams), config);
};

export default usePGRSearch;