import { Request } from "@egovernments/digit-ui-libraries";

export const TLService = {
    TLsearch: async ({ tenantId, filters }) => {
        return await Request({
            url: "/tl-services/v1/_search",
            useCache: false,
            method: "POST",
            auth: true,
            userService: true,
            params: { tenantId, ...filters },
        });
    },
};
