import { DssChartConfig } from "../../configs/DssChartConfig";

const searchDssChartV2 = async (module, planId, campaignType, boundaries=[]) => {
    try {

        // Validate inputs
        if (!module || !planId || !campaignType) {
            console.error("Invalid module or planId or campaignType provided");
            throw new Error("Invalid module or planId or campaignType provided");
        }

        // Find the configuration for the provided module
        const moduleConfig = DssChartConfig.find(config => config.module === module);

        if (!moduleConfig) {
            console.error(`No DSS Chart configuration found for module: ${module}`);
            throw new Error(`No DSS Chart configuration found for module: ${module}`);
        }

        // Find the configuration for the given campaignType
        const campaignConfig = moduleConfig.kpiConfig.find(kpi => kpi.campaignType === campaignType);

        if (!campaignConfig) {
            console.error(`No DSS Chart configuration found for campaignType: ${campaignType}`);
            throw new Error(`No DSS Chart configuration found for campaignType: ${campaignType}`);
        }

        const filters = boundaries.reduce((acc, boundary) => {
            if (!acc[boundary.type]) {
                acc[boundary.type] = [];
            }
            acc[boundary.type].push(boundary.code);
            return acc;
        }, {});

        // Add other required filters
        filters["planConfigurationId"] = [planId];
        const tenantId = Digit.ULBService.getCurrentTenantId();
        filters["tenantId"] = [tenantId];


        // Construct request bodies for all active charts in the campaignType
        const requests = campaignConfig.charts
            .filter(chart => chart.active) // Include only active charts
            .map(chart => ({
                aggregationRequestDto: {
                    visualizationType: chart.visualizationType,
                    visualizationCode: chart.visualizationCode,
                    filters: filters,
                    moduleLevel: chart.moduleLevel,
                },
                headers: {
                    tenantId: tenantId,
                }
            }));

        // Send all requests in parallel
        const responses = await Promise.all(
            requests.map(body =>
                Digit.CustomService.getResponse({
                    url: "/dashboard-analytics/dashboard/getChartV2",
                    useCache: false,
                    method: "POST",
                    userService: false,
                    body,
                })
            )
        );

        // Extract and map headerValue from responses
        const finalResponse = campaignConfig.charts
            .filter(chart => chart.active) // Ensure only active charts are included
            .sort((a, b) => a.order - b.order) // Sort by the 'order' field
            .reduce((acc, chart, index) => {
                const response = responses[index]; // Match response to chart by index
                const headerValue = response?.responseData?.data?.[0]?.headerValue || 0;

                // Add chart code and headerValue to final response in order
                acc[chart.localeKey] = headerValue;
                return acc;
            }, {});

        return finalResponse; // Return an object with visualizationCode as keys and headerValues as values
    } catch (error) {
        console.error(error);
        if (error?.response?.data?.Errors) {
            throw new Error(error.response.data.Errors[0].message);
        }
        throw new Error("An unknown error occurred");
    }
};

export default searchDssChartV2;
