import { WorksSearch } from "../../services/molecules/Works/Search";
import { useQuery } from "react-query";


//cache time is req as 0, so that the user wont see the previously fetched data while current project is being fetched.
const useViewProjectDetails = (t, tenantId, searchParams, filters, headerLocale, config = {cacheTime : 0}) => {
    return useQuery(
        ["SEARCH_PROJECTS", tenantId, searchParams?.projectNumber],
        () => WorksSearch.viewProjectDetailsScreen(t, tenantId, searchParams, filters, headerLocale),
        config
    );
}
export default useViewProjectDetails;

