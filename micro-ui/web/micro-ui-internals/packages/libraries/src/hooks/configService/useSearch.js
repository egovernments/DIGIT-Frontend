import ConfigServiceService from "../../services/elements/ConfigService";
import { useQuery } from "react-query";

const useConfigServiceSearch = (data, config) => {
  return useQuery(
    ["config_service_search", data?.criteria?.schemaCode, data?.criteria?.tenantId],
    () => ConfigServiceService.Search(data),
    { ...config }
  );
};

export default useConfigServiceSearch;
