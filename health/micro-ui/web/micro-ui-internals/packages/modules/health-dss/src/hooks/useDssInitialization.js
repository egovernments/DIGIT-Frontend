import { useQuery } from "react-query";
import initializeDssModule from "../services/dssInitialization";

const useDssInitialization = ({ tenantId }) => {
    return useQuery(["DSS_INITIALIZATION",], () => initializeDssModule({ tenantId }));
};

export default useDssInitialization;