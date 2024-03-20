import { WorksSearch } from "../../services/molecules/Works/Search";
import { useQuery } from "react-query";

const useViewProjectClosureDetailsKickoffChecklist = (tenantId = "pb.amritsar", questions,config = {},t) => {
    return useQuery(
        ["PROJECTCLOSURE", "PROJECTCLOSURESCREENKickoffChecklist", tenantId],
        () => WorksSearch.viewProjectClosureScreenFieldSurvey(tenantId, questions,t),
        config
    );
}

export default useViewProjectClosureDetailsKickoffChecklist