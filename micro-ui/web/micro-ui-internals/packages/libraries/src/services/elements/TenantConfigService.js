import { ServiceRequest } from "../atoms/Utils/Request";
import Urls from "../atoms/urls";

export const TenantConfigSearch = {
  tenant: (stateCode) =>
    ServiceRequest({
      serviceName: "tenantConfigSearch",
      url: Urls.TenantConfigSearch,
      data: {},
      useCache: true,
      params: { code: stateCode },
    }),
};
