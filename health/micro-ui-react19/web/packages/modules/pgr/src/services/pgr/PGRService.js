import Urls from "../../utils/urls";

const PGRService = {
  search: (tenantId, filters, searchParams) =>
    Digit.CustomService.getResponse({
      url: Urls.pgr.search,
      useCache: false,
      method: "POST",
      userService: true,
      params: { tenantId, ...filters, ...searchParams },
    }),
  create: (data, tenantId) =>
    Digit.CustomService.getResponse({
      body: data,
      url: Urls.pgr.create,
      useCache: false,
      method: "POST",
      userService: true,
      params: { tenantId },
    }),
  update: (details) =>
    Digit.CustomService.getResponse({
      url: Urls.pgr.update,
      body: details,
      useCache: false,
      method: "POST",
      params: { tenantId: details.tenantId },
      userService: true,
    }),
};

export default PGRService;