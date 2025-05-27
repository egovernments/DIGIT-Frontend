import { useEffect, useMemo, useRef, useState } from "react";
import Urls from "../../services/urls";

const DEFAULT_LIMIT = 100;

export const usePaginatedProjectSearch = ({ tenantId, jurisdictions = [], config = {} }) => {
  const [allProjects, setAllProjects] = useState([]);
  const [totalCount, setTotalCount] = useState(null);
  const [offset, setOffset] = useState(0);

  const previousKey = useRef("");
  const fetchingMore = useRef(false);

  const jurisdictionKey = useMemo(() => JSON.stringify(jurisdictions), [jurisdictions]);

  const requestBody = useMemo(() => ({
    Project: jurisdictions.map(j => ({
      tenantId: j.tenantId,
      boundary: j.boundary,
      boundaryType: j.boundaryType,
    })),
  }), [jurisdictionKey]);

  const params = useMemo(() => ({
    tenantId,
    limit: DEFAULT_LIMIT,
    offset,
    includeDescendants: false,
  }), [tenantId, offset]);

  const { isLoading, data, isError, error } = Digit.Hooks.useCustomAPIHook({
    url: Urls.hcm.searchProject,
    params,
    body: requestBody,
    config: {
      enabled: jurisdictions.length > 0,
      staleTime: config.staleTime !== undefined ? config.staleTime : Infinity,
      cacheTime: config.cacheTime !== undefined ? config.cacheTime : 15 * 60 * 1000,
      ...config,
    },
  });

  useEffect(() => {
    if (jurisdictionKey !== previousKey.current) {
      setAllProjects([]);
      setOffset(0);
      setTotalCount(null);
      previousKey.current = jurisdictionKey;
      fetchingMore.current = false;
    }
  }, [jurisdictionKey]);

  useEffect(() => {
    if (data?.Project?.length) {
      setAllProjects(prev => [...prev, ...data.Project]);
      if (totalCount === null) {
        setTotalCount(data.TotalCount);
      }
      fetchingMore.current = false;
    }
  }, [data]);

  useEffect(() => {
    if (
      totalCount !== null &&
      allProjects.length < totalCount &&
      !isLoading &&
      !fetchingMore.current
    ) {
      fetchingMore.current = true;
      setOffset(prev => prev + DEFAULT_LIMIT);
    }
  }, [totalCount, allProjects, isLoading]);

  return {
    data: allProjects,
    totalCount,
    isLoading,
    isError,
    error,
  };
};
