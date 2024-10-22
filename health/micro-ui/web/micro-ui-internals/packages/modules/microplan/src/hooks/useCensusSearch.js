import censusSearchConfig from "./services/censusSearchConfig";
import { useQuery } from "react-query";
const useCensusSearch = (data, config = {}) => {
  return useQuery(["SEARCH_CENSUS",data,config.queryKey], () => censusSearchConfig(data), { ...config });
};

export default useCensusSearch;