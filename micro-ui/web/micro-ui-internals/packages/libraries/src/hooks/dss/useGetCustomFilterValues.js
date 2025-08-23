import { useQuery } from "@tanstack/react-query";
import { DSSService } from "../../services/elements/DSS";

const useGetCustomFilterValues = (filterConfigs, config={}) => {
  return useQuery({
    queryKey: [`DSS_CUSTOM_FILTER_CONFIG_${JSON.stringify(filterConfigs)}`],
    queryFn: () => DSSService.getFiltersConfigData(filterConfigs),
    ...config,
  });
};

export default useGetCustomFilterValues;
