import ProjectService from "../../services/project/ProjectService";
import { useQuery } from "@tanstack/react-query";
const useProjectSearch = ({data, params, config = {}}) => {
  return useQuery({
    queryKey: ["SEARCH_PROJECT",data,config.queryKey],
    queryFn: () => ProjectService.projectSearch({
      body: data,
      params,
    }),
    ...config,
  });
};

export default useProjectSearch;