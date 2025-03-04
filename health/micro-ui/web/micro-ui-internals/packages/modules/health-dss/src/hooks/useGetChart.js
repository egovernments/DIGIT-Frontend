import { useQuery } from "react-query";
import { DSSService } from "../services/getDashboardConfig";

const getRequest = (type, code, requestDate, filters, moduleLevel = "", addlFilter) => {
    let newFilter = { ...{ ...filters, ...addlFilter } };
    let updatedFilter = Object.keys(newFilter)
        .filter((ele) => newFilter[ele]?.length > 0)
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

const useGetChart = (args, enabled = true) => {
    const { key, type, tenantId, requestDate, filters, moduleLevel, addlFilter } = args;
    // const campaignInfo = Digit.SessionStorage.get("campaigns-info");
    // const campaignCode = Object.keys(campaignInfo)?.[0];
    // const projectTypeId = campaignInfo?.[campaignCode]?.[0]?.["projectTypeId"]?.toString() || "";
    const updatedFilters = {
        ...filters,
        projectTypeId: filters?.projectTypeId,
    };
    return useQuery(
        [args],
        () =>
            DSSService.getCharts({
                ...getRequest(type, key, requestDate, updatedFilters, moduleLevel, addlFilter),
                headers: {
                    tenantId,
                },
            }),
        {
            select: defaultSelect,
            enabled,
        }
    );
};

export default useGetChart;
