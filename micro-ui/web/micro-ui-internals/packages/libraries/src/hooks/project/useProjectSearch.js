import React from "react";
import { useQuery } from "react-query";
import { WorksService } from "../../services/elements/Works";

//using this hook for searching only one project with projectNumber/id etc
const useProjectSearch = ({ tenantId, searchParams, filters = { limit: 10, offset: 0 }, config = {} }) => {
    
    return useQuery(
        ["PROJECT_SEARCH", tenantId, filters],
        () => WorksService.searchProject(tenantId, searchParams, filters),
        {
            ...config,
            cacheTime:0,
            select: (data) => {
                return data?.Project?.[0]
            }
    
        }
    )
}

export default useProjectSearch
