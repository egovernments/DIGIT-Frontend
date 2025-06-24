import { Surveys } from "../../services/elements/Surveys";
import { useQuery } from "@tanstack/react-query";

const useSearch = (filters, config) => {
  return useQuery({
    queryKey: [
      "search_surveys",
      filters?.uuid,
      filters?.title,
      filters?.tenantIds,
      filters?.postedBy,
      filters?.offset,
      filters?.limit,
    ],
    queryFn: () => Surveys.search(filters),
    ...config,
  });
};

export default useSearch;
