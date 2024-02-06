import { WorksSearch } from "../../services/molecules/Works/Search";
import { useQuery } from "react-query";

const useViewProjectClosureDetailsBills = (tenantId="pb.amritsar", config = {}) => {
    return useQuery(
        ["PROJECTCLOSURE", "PROJECTCLOSURESCREENBills", tenantId],
        () => WorksSearch.viewProjectClosureScreenBills(tenantId),
        config
    );
}

export default useViewProjectClosureDetailsBills