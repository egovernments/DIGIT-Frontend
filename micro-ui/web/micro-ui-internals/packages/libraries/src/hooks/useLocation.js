import { useQuery } from 'react-query';
import { LocationService } from "../services/elements/Location";

const useLocation = (tenantId, locationType, config = {},includeChildren,includeParents) => {
    switch(locationType) {
        case 'Locality':
            return useQuery(["LOCALITY_DETAILS", tenantId ], () => LocationService.getLocalities(tenantId), config);   
        case 'Ward':
            return useQuery(["WARD_DETAILS", tenantId], () => LocationService.getWards(tenantId,includeChildren,includeParents), config);
        default:
            break
    } 
}

export default useLocation;
