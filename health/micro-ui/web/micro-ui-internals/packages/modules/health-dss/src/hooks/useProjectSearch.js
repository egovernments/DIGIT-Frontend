import ProjectService from "../services/ProjectService";
import { useQuery } from "react-query";
const useProjectSearch = ({data, params, config = {}}) => {
  return useQuery(["SEARCH_PROJECT",data,config.queryKey], () => ProjectService.projectSearch({
    body: data,
    params,
  }), { ...config });
};

export default useProjectSearch;