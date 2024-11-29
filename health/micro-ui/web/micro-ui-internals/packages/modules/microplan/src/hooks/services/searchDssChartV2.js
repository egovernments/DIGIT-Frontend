import { DssChartConfig } from "../../configs/DssChartConfig";

const searchDssChartV2 = async (module, planId, campaignType, boundaries = []) => {
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

        // Collect all unique visualizationCodes (both primary and concatenateKey) for requests
        const charts = campaignConfig.charts.filter(chart => chart.active); // Only active charts
        const visualizationCodes = new Set();

        charts.forEach(chart => {
            visualizationCodes.add(chart.visualizationCode);
            if (chart.concatenateKey) {
                visualizationCodes.add(chart.concatenateKey);
            }
        });

        // Construct request bodies for all unique visualizationCodes
        const requests = Array.from(visualizationCodes).map(visualizationCode => ({
            aggregationRequestDto: {
                visualizationType: "METRIC", // Assume METRIC as default type
                visualizationCode: visualizationCode,
                filters: filters,
                moduleLevel: module, // Assuming moduleLevel matches the module
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

        // Map responses for quick access
        const responseMap = responses.reduce((acc, response) => {
            const code = response?.responseData?.visualizationCode;
            const headerValue = response?.responseData?.data?.[0]?.headerValue || 0;
            if (code) acc[code] = headerValue;
            return acc;
        }, {});

        // Construct the final response with concatenated values where applicable
        const finalResponse = charts
            .sort((a, b) => a.order - b.order) // Sort by the 'order' field
            .reduce((acc, chart) => {
                const primaryValue = responseMap[chart.visualizationCode] || 0;

                if (chart.concatenateKey) {
                    const concatenateValue = responseMap[chart.concatenateKey] || 0;
                    acc[chart.localeKey] = `${primaryValue} ${chart.concateChars || ""} ${concatenateValue}`;
                } else {
                    acc[chart.localeKey] = primaryValue;
                }

                return acc;
            }, {});

        return finalResponse; // Return an object with localeKeys as keys and final values as values
    } catch (error) {
        console.error(error);
        if (error?.response?.data?.Errors) {
            throw new Error(error.response.data.Errors[0].message);
        }
        throw new Error("An unknown error occurred");
    }
};

export default searchDssChartV2;