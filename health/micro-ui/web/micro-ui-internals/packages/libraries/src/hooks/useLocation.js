import { useQuery } from "@tanstack/react-query";
import { LocationService } from "../services/elements/Location";

const useLocation = (tenantId, locationType, config = {}) => {
    switch (locationType) {
      case 'Locality':
        return useQuery({
          queryKey: ["LOCALITY_DETAILS", tenantId],
          queryFn: () => LocationService.getLocalities(tenantId),
          ...config,
        });
      case 'Ward':
        return useQuery({
          queryKey: ["WARD_DETAILS", tenantId],
          queryFn: () => LocationService.getWards(tenantId),
          ...config,
        });
      default:
        return null; // or another default behavior
    }
  };

export default useLocation;
