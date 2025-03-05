import { Surveys } from "../../services/elements/Surveys";
import { useMutation, useQuery } from "@tanstack/react-query";
/* import { isObject, isObjectLike } from "lodash"; */

const useSearch = (filters, config) => {
    const { filterForm, searchForm, tableForm } = filters
    const { status } = filterForm
    const { title, tenantIds, postedBy } = searchForm
    const { sortBy, limit, offset, sortOrder } = tableForm;
    const validTenantId = typeof tenantIds === 'object' ? tenantIds.code : tenantIds;
    const validStatus = typeof status === 'object' ? status.code : status;

    const finalFilters = {
        tenantIds: validTenantId,
        status: validStatus === "ALL" ? "" : validStatus,
        title,
        postedBy,
        limit,
        offset
    }

    //clearing out empty string params from payload
    Object.keys(finalFilters).forEach(key => {
        if (finalFilters[key] === '') {
            delete finalFilters[key];
        }
    });


    return useQuery({
        queryKey: [
          "search_surveys",
          title,
          tenantIds,
          postedBy,
          status,
          offset,
          limit,
        ],
        queryFn: () => Surveys.search(finalFilters),
        refetchInterval: 6000, // 6 seconds
        ...config,
      });
    };

export default useSearch;
