import { useQuery } from "react-query";
import { DSSService } from "../services/DSSService";

const useDSSGeoJson = (moduleCode, tenantId, selector, geoJsonConfig) => {
  const boundaryCode = selector?.[0];

  return useQuery(
    [`DSS_DASHBOARD_${boundaryCode}`, moduleCode],
    () => {
      // Boundary CODE -> MDMS map-config.GeoJsonMapping -> S3 url. The code is what the
      // GeoJSON features and the boundary service agree on; the display name is localised and
      // so cannot be a lookup key.
      const geoJsonUrl = DSSService.resolveGeoJsonUrl(geoJsonConfig, boundaryCode);
      return DSSService.getDashboardGeoJsonConfig(geoJsonUrl);
    },
    {
      enabled: !!geoJsonConfig && !!boundaryCode,
      // Ward-level GeoJSON runs to tens of MB, and the key is per-boundary, so the app-wide
      // 50-minute cacheTime meant every boundary ever visited stayed parsed on the heap.
      // A short window keeps the active boundary (and a back-step) without accumulating.
      cacheTime: 15 * 60 * 1000,
      staleTime: 10 * 60 * 1000,
    }
  );
};

export default useDSSGeoJson;
