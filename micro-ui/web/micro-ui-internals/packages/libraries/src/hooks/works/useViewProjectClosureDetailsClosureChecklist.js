import { WorksSearch } from "../../services/molecules/Works/Search";
import { useQuery } from "react-query";

const useViewProjectClosureDetailsClosureChecklist = (tenantId = "pb.amritsar", questions, config = {},t) => {
    return useQuery(
        ["PROJECTCLOSURE", "PROJECTCLOSURESCREENClosureChecklist", tenantId],
        () => WorksSearch.viewProjectClosureScreenClosureChecklist(tenantId, questions,t),
        config
    );
}

export default useViewProjectClosureDetailsClosureChecklist