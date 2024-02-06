import { WorksSearch } from "../../services/molecules/Works/Search";
import { useQuery } from "react-query";

const useViewProjectClosureDetails = (tenantId, config = { }) => {
    return useQuery(
        ["PROJECTCLOSURE", "PROJECTCLOSURESCREEN", tenantId],
        () => WorksSearch.viewProjectClosureScreen(tenantId),
        config
    );
}

export default useViewProjectClosureDetails