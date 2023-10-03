import { useQuery } from "react-query";
import { startOfMonth, endOfMonth, getTime } from "date-fns";
import { DSSService } from "../../services/elements/DSS";

const getRequest = (type, code, requestDate, filters, moduleLevel = "", addlFilter) => {
  let newFilter = { ...{ ...filters, ...addlFilter } };
  let updatedFilter = Object.keys(newFilter)
    .filter((ele) => newFilter[ele].length > 0)
    .reduce((acc, curr) => {
      acc[curr] = newFilter[curr];
      return acc;
    }, {});
  return {
    aggregationRequestDto: {
      visualizationType: type.toUpperCase(),
      visualizationCode: code,
      queryType: "",
      filters: updatedFilter,
      moduleLevel: moduleLevel,
      aggregationFactors: null,
      requestDate,
    },
  };
};
const defaultSelect = (data) => {
  if (data?.responseData) {
    if (data?.responseData?.data) {
      data.responseData.data = data?.responseData?.data?.filter((col) => col) || [];
      data.responseData.data?.forEach((row) => {
        if (row?.plots) {
          row.plots = row?.plots.filter((col) => col) || [];
        }
      });
    }
  }
  return data;
};

const useGetChart = (args) => {
  const { key, type, tenantId, requestDate, filters, moduleLevel, addlFilter, isVisible } = args;

  return useQuery(
    [args],
    () => {
      if (!isVisible && isVisible != undefined) {
        // Return fake data when isVisible is false
        return { isLoading: true, data: null };
      }

      return DSSService.getCharts({
        ...getRequest(type, key, requestDate, filters, moduleLevel, addlFilter),
        headers: {
          tenantId,
        },
      });
    },
    {
      select: (data) => {
        if (data && data.fakeData) {
          // Return null or handle the fake data as needed
          return null;
        }
        // Handle the real data here
        return defaultSelect(data);
      },
    }
  );
};


export default useGetChart;
