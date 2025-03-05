import { useQuery } from "@tanstack/react-query";
import { DSSService } from "../../services/elements/DSS";

const useDashoardConfig = (moduleCode) => {
  return useQuery({
    queryKey: [`DSS_DASHBOARD_CONFIG_${moduleCode}`],
    queryFn: () => DSSService.getDashboardConfig(moduleCode),
  });
};

export default useDashoardConfig;
