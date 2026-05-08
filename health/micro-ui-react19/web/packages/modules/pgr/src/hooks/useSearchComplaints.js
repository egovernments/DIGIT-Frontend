import { useQuery } from "@tanstack/react-query";
import { searchComplaintsService } from "./services/complaintService";

const useSearchComplaints = (params, tenantId, config = {}) => {
  return useQuery({
    queryKey: ["pgr-search-complaints", tenantId, params],
    queryFn: () => searchComplaintsService(params, tenantId),
    gcTime: 0,
    staleTime: 0,
    enabled: !!tenantId,
    ...config,
  });
};

export default useSearchComplaints;
