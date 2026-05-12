import Urls from "../urls";

const HrmsService = {
  search: (tenantId, filters, searchParams) =>
    Digit.CustomService.getResponse({
      url: Urls.hrms.search,
      useCache: false,
      method: "POST",
      userService: true,
      params: { tenantId, ...filters, ...searchParams },
    }),
  create: (data, tenantId) =>
    Digit.CustomService.getResponse({
      body: data,
      url: Urls.hrms.create,
      useCache: false,
      method: "POST",
      userService: true,
      params: { tenantId },
    }),
  update: (data, tenantId) =>
    Digit.CustomService.getResponse({
      body: data,
      url: Urls.hrms.update,
      useCache: false,
      method: "POST",
      userService: true,
      params: { tenantId },
    }),
  count: (tenantId) =>
    Digit.CustomService.getResponse({
      url: Urls.hrms.count,
      useCache: false,
      method: "POST",
      userService: true,
      params: { tenantId },
    }),
};

export default HrmsService;
