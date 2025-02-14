import initializePGRModule from "../../services/PGRInitialization";
import { useQuery } from "react-query";

const usePGRInitialization = ({tenantId}) => {
  return useQuery(["PGR_INITIALIZATION",], () => initializePGRModule({tenantId}));
};

export default usePGRInitialization;