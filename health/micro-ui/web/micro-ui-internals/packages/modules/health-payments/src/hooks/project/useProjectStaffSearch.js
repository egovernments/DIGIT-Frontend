import ProjectService from "../../services/project/ProjectService";
import { useQuery } from "react-query";
const useProjectStaffSearch = ({data, params, config = {}}) => {
  return useQuery(["SEARCH_PROJECT_STAFF",data,config.queryKey], () => ProjectService.staffSearch({
    body: data,
    params,
  }), { ...config });
};

export default useProjectStaffSearch;