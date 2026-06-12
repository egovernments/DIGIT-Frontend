import { useState, useEffect, useRef, useMemo } from "react";

/**
 * Paginated version of Digit.Hooks.useCustomAPIHook.
 * Automatically fetches all pages when TotalCount exceeds the page size.
 * Drop-in replacement: same criteria shape, same return value ({ data, isLoading }).
 *
 * @param {Object} criteria - Same shape as useCustomAPIHook criteria
 * @param {number} pageSize - Page size per request (default 1000)
 */
const usePaginatedAPIHook = (criteria, pageSize = 1000) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef(null);

  const { url, params, body, config, changeQueryName } = criteria || {};
  const enabled = config?.enabled !== false;

  // Keep latest values in refs to avoid stale closures in async code
  const urlRef = useRef(url);
  const paramsRef = useRef(params);
  const bodyRef = useRef(body);
  const selectRef = useRef(config?.select);
  urlRef.current = url;
  paramsRef.current = params;
  bodyRef.current = body;
  selectRef.current = config?.select;

  // Stable key to control when the effect re-runs
  const paramsStr = JSON.stringify(params);
  const bodyStr = JSON.stringify(body);
  const stableKey = useMemo(() => {
    if (!enabled) return null;
    return changeQueryName || `${url}_${paramsStr}_${bodyStr}`;
  }, [enabled, url, changeQueryName, paramsStr, bodyStr]);

  useEffect(() => {
    if (!stableKey) {
      setData(null);
      setIsLoading(false);
      return;
    }

    // Abort any in-flight request chain
    if (abortRef.current) abortRef.current.cancelled = true;
    const controller = { cancelled: false };
    abortRef.current = controller;

    const fetchAllPages = async () => {
      setIsLoading(true);
      try {
        const currentUrl = urlRef.current;
        const currentParams = paramsRef.current;
        const currentBody = bodyRef.current;

        // Fetch first page
        const firstResponse = await Digit.CustomService.getResponse({
          url: currentUrl,
          params: { ...currentParams, limit: pageSize, offset: 0 },
          body: currentBody,
        });

        if (controller.cancelled) return;

        const totalCount = firstResponse?.TotalCount ?? 0;

        // Single page — apply select and return
        if (totalCount <= pageSize) {
          const result = selectRef.current ? selectRef.current(firstResponse) : firstResponse;
          if (!controller.cancelled) setData(result);
          return;
        }

        // Multiple pages needed — fetch remaining and merge array fields
        const combinedResponse = { ...firstResponse };
        for (let offset = pageSize; offset < totalCount; offset += pageSize) {
          const pageResponse = await Digit.CustomService.getResponse({
            url: currentUrl,
            params: { ...currentParams, limit: pageSize, offset },
            body: currentBody,
          });

          if (controller.cancelled) return;

          Object.keys(pageResponse).forEach((key) => {
            if (Array.isArray(pageResponse[key]) && Array.isArray(combinedResponse[key])) {
              combinedResponse[key] = [...combinedResponse[key], ...pageResponse[key]];
            }
          });
        }

        const result = selectRef.current ? selectRef.current(combinedResponse) : combinedResponse;
        if (!controller.cancelled) setData(result);
      } catch (error) {
        console.error("Paginated fetch error:", error);
        if (!controller.cancelled) setData(null);
      } finally {
        if (!controller.cancelled) setIsLoading(false);
      }
    };

    fetchAllPages();

    return () => {
      controller.cancelled = true;
    };
  }, [stableKey, pageSize]);

  return { data, isLoading };
};

export default usePaginatedAPIHook;
