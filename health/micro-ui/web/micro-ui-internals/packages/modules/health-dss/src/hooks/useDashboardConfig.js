import { useQuery } from "react-query";
import { DSSService } from "../services/getDashboardConfig";

const useDashboardConfig = (moduleCode) => {
    return useQuery(`DSS_DASHBOARD_CONFIG_${moduleCode}`, () => DSSService.getDashboardConfig(moduleCode));
};

export default useDashboardConfig;
