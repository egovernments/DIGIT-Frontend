export const createComplaintService = (data, tenantId) =>
  Digit.CustomService.getResponse({
    url: "/pgr-services/v2/requests/_create",
    useCache: false,
    method: "POST",
    userService: true,
    body: { service: data, tenantId },
  });

export const updateComplaintService = (data, tenantId) =>
  Digit.CustomService.getResponse({
    url: "/pgr-services/v2/requests/_update",
    useCache: false,
    method: "POST",
    userService: true,
    body: { service: data, tenantId },
  });

export const searchComplaintsService = (params, tenantId) =>
  Digit.CustomService.getResponse({
    url: "/pgr-services/v2/requests/_search",
    useCache: false,
    method: "POST",
    userService: true,
    body: { RequestInfo: {}, tenantId, ...params },
  });

export const countComplaintsService = (tenantId, params = {}) =>
  Digit.CustomService.getResponse({
    url: "/pgr-services/v2/requests/_count",
    useCache: false,
    method: "POST",
    userService: true,
    body: { RequestInfo: {}, tenantId, ...params },
  });
