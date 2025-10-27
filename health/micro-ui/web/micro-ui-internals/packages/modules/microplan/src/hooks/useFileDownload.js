import { useQuery } from "react-query";
import SearchFileIds from "./services/SearchFileIds";

const useFileDownload = (data, config = {}) => {
  return useQuery(["SEARCH_FILES",data,config?.queryKey], () => SearchFileIds(data), { ...config });
};

export default useFileDownload;

