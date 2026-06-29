import { useQuery } from "@tanstack/react-query";
import { DSSService } from "../services/DSSService";

const useDSSGeoJson = (moduleCode, tenantId, selector, geoJsonConfig) => {
  return useQuery({
    queryKey: [`DSS_DASHBOARD_${selector}`, moduleCode],
    queryFn: () => {
      const geoJsonUrl = geoJsonConfig?.MdmsRes?.["map-config"]?.GeoJsonMapping?.find((item) => item?.code === selector[0])?.url;
      return DSSService.getDashboardGeoJsonConfig(geoJsonUrl);
    },
    enabled: !!geoJsonConfig,
  });
};

export default useDSSGeoJson;
