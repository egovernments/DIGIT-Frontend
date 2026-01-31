import { useEffect, useState, useRef } from "react";

const DEFAULT_LIMIT = 100000;

export const useFetchAllBoundaryHierarchies = ({ tenantId, config = {} }) => {
  const [allBoundaries, setAllBoundaries] = useState([]);
  const [totalCount, setTotalCount] = useState(null);
  const [offset, setOffset] = useState(0);

  const previousTenant = useRef("");
  const fetchingMore = useRef(false);

  const requestBody = {
    BoundaryTypeHierarchySearchCriteria: {
      tenantId,
      offset,
      limit: DEFAULT_LIMIT,
      hierarchyType: config?.refetchKey || null,
    },
  };

  const { isLoading, data, isError, error } = Digit.Hooks.useCustomAPIHook({
    url: "/boundary-service/boundary-hierarchy-definition/_search",
    body: requestBody,
    config: {
      enabled: !!tenantId,
      staleTime: config.staleTime || Infinity,
      cacheTime: config.cacheTime || 15 * 60 * 1000,
      ...config,
    },
  });

  useEffect(() => {
    if (tenantId !== previousTenant.current) {
      setAllBoundaries([]);
      setOffset(0);
      setTotalCount(null);
      previousTenant.current = tenantId;
      fetchingMore.current = false;
    }
  }, [tenantId]);

  useEffect(() => {
    if (data?.BoundaryHierarchy?.length) {
      const boundaries = data.BoundaryHierarchy.map((item) => ({
        id: item?.id,
        tenantId: item?.tenantId,
        hierarchyType: item?.hierarchyType,
        i18nKey: `HIERARCHY_TYPE_${item?.hierarchyType}`,
        boundaryHierarchy: item?.boundaryHierarchy,
      }));

      setAllBoundaries((prev) => [...prev, ...boundaries]);

      if (totalCount === null) {
        setTotalCount(data?.totalCount || boundaries.length);
      }

      fetchingMore.current = false;
    }
  }, [data]);

  useEffect(() => {
    if (
      totalCount !== null &&
      allBoundaries.length < totalCount &&
      !isLoading &&
      !fetchingMore.current
    ) {
      fetchingMore.current = true;
      setOffset((prev) => prev + DEFAULT_LIMIT);
    }
  }, [totalCount, allBoundaries, isLoading]);

  return {
    data: allBoundaries,
    totalCount,
    isLoading,
    isError,
    error,
  };
};
