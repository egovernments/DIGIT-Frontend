import { Request } from "@egovernments/digit-ui-libraries";
import axios from "axios";

export const DSSService = {
    getDashboardConfig: (moduleCode) => {
        const tenantId = Digit.ULBService.getCurrentTenantId();

        return Request({
            url: "/dashboard-analytics/dashboard/getDashboardConfig" + `/${moduleCode}`,
            useCache: false,
            params: { tenantId: tenantId },
            userService: false,
            method: "GET",
            authHeader: true,
        });
    },

    getCharts: (data) => {
        const tenantId = Digit.ULBService.getCurrentTenantId();
        return Request({
            url: "/dashboard-analytics/dashboard/getChartV2",
            useCache: false,
            userService: false,
            method: "POST",
            params: { tenantId: tenantId },
            auth: true,
            data,
        });
    },

    getDashboardGeoJsonConfig: async (url) => {
        try {
            const response = await axios.get(url);
            return response?.data; // Properly return the response
        } catch (error) {
            console.error("Error fetching GeoJsonConfig:", error); // Log error for debugging
            return {}; // Return an empty object on error
        }
    },
};

