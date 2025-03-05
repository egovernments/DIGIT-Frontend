import { useQuery } from "@tanstack/react-query";
import { DSSService } from "../../services/elements/DSS";

const useGetCustomFilterRequestValues = (filterConfigs, config={}) => {
  return useQuery({
    queryKey: [`DSS_CUSTOM_FILTER_REQUEST_VAL_${JSON.stringify(filterConfigs)}`],
    queryFn: () => DSSService.getCustomFiltersDynamicValues(filterConfigs),
    ...config,
  });
};

export default useGetCustomFilterRequestValues;
