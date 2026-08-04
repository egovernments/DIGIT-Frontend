import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const PAGE_SIZE = 1000;

/**
 * Hook that fetches all pages of a search API by paginating through results
 * using offset/limit and totalCount from the response.
 *
 * @param {Object} params
 * @param {string} params.url - API endpoint
 * @param {Object} params.params - URL query params (limit/offset will be managed internally)
 * @param {Object} params.body - Request body
 * @param {string} params.dataKey - Key in response containing the array (e.g. "ProjectFacilities", "Facilities")
 * @param {Object} params.config - React Query config (enabled, select, staleTime, cacheTime, etc.)
 * @param {string} params.changeQueryName - Custom query key identifier
 * @returns {{ data: any, isLoading: boolean, isFetching: boolean, refetch: Function }}
 */
const usePaginatedSearch = ({
  url,
  params: queryParams = {},
  body = {},
  dataKey,
  config = {},
  changeQueryName = "PaginatedSearch",
}) => {
  const { select, enabled = true, ...restConfig } = config;

  const stableBody = useMemo(() => JSON.stringify(body), [body]);
  const stableParams = useMemo(() => JSON.stringify(queryParams), [queryParams]);

  const queryKey = useMemo(
    () => ["paginated", url, changeQueryName, stableBody, stableParams],
    [url, changeQueryName, stableBody, stableParams]
  );

  const fetchAllPages = async () => {
    const allResults = [];
    let offset = 0;
    let totalCount = null;

    const parsedParams = JSON.parse(stableParams);
    const parsedBody = JSON.parse(stableBody);

    // Remove any caller-provided limit/offset since we manage them
    const { limit: _l, offset: _o, ...cleanParams } = parsedParams;

    while (true) {
      const response = await Digit.CustomService.getResponse({
        url,
        params: { ...cleanParams, limit: PAGE_SIZE, offset },
        body: parsedBody,
      });

      const pageData = response?.[dataKey] || [];
      allResults.push(...pageData);

      // Get totalCount from first response
      if (totalCount === null) {
        totalCount = response?.totalCount ?? response?.TotalCount ?? pageData.length;
      }

      offset += PAGE_SIZE;

      // Stop if we've fetched all records or got an empty page
      if (pageData.length < PAGE_SIZE || allResults.length >= totalCount) {
        break;
      }
    }

    // Reconstruct the response shape so `select` functions work as before
    return { [dataKey]: allResults, totalCount: totalCount ?? allResults.length };
  };

  const { isLoading, isFetching, data, refetch } = useQuery(queryKey, fetchAllPages, {
    cacheTime: restConfig.cacheTime ?? 1000,
    staleTime: restConfig.staleTime ?? 5000,
    keepPreviousData: true,
    retry: 2,
    refetchOnWindowFocus: false,
    enabled,
    select,
    ...restConfig,
  });

  return { data, isLoading, isFetching, refetch };
};

export default usePaginatedSearch;
