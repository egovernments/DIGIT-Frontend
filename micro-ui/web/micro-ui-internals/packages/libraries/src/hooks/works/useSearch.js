import React from "react";
import { useQuery } from "react-query";
import { WorksService } from "../../services/elements/Works";


const useSearch = ({ tenantId, filters, config = {} }) => useQuery(
    ["ESTIMATE_SEARCH", tenantId, ...Object.keys(filters)?.map(e => filters?.[e])],
    () => WorksService.estimateSearch({ tenantId, filters }),
    {
        // select: (data) => data.Licenses,
        ...config
    }
)

export default useSearch
