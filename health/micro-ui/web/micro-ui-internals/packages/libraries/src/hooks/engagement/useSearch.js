import { Engagement } from "../../services/elements/Engagement";
import { useMutation, useQuery } from "@tanstack/react-query";

const useSearch = (filters, config) => {
  return useQuery({
    queryKey: [
      "search_engagement",
      filters?.name,
      filters?.category,
      filters?.tenantIds,
      filters?.postedBy,
      filters?.offset,
      filters?.limit
    ],
    queryFn: () => Engagement.search(filters),
    ...config
  });
};

export default useSearch;
