import { useMemo } from "react";

const useStockSearch = ({ tenantId, dateRange, transformFn, referenceId, enabled = true }) => {
  const stockSearchCriteria = useMemo(() => {
    const dateFilter = {};
    if (dateRange?.startDate) {
      dateFilter.fromDate = dateRange.startDate.getTime();
    }
    if (dateRange?.endDate) {
      dateFilter.toDate = dateRange.endDate.getTime();
    }

    return {
      url: `/stock/v1/_search`,
      params: { tenantId, offset: 0, limit: 1000 },
      body: {
        Stock: {
          ...dateFilter,
          // referenceId,
        },
      },
      config: {
        enabled: enabled && !!tenantId,
        select: (data) => {
          const stocks = data?.Stock || [];
          return transformFn ? transformFn(stocks) : stocks;
        },
      },
    };
  }, [tenantId, dateRange, transformFn, referenceId]);

  return Digit.Hooks.useCustomAPIHook(stockSearchCriteria);
};

export default useStockSearch;
