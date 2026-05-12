import Urls from "../../urls";

const AttendeeService = {
  search: (tenantId, filters, searchParams, data) =>
    Digit.CustomService.getResponse({
      url: Urls.attendee.search,
      useCache: false,
      method: "POST",
      userService: true,
      body: data,
      params: { tenantId, ...filters, ...searchParams },
    }),
  create: (data, tenantId) =>
    Digit.CustomService.getResponse({
      body: data,
      url: Urls.attendee.enrollAttendee,
      useCache: false,
      method: "POST",
      userService: true,
      params: { tenantId },
    }),
  delete: (data, tenantId) =>
    Digit.CustomService.getResponse({
      body: data,
      url: Urls.attendee.deenrollAttendee,
      useCache: false,
      method: "POST",
      userService: true,
      params: {},
    }),
  paymentSetUpCreate: (data, tenantId) =>
    Digit.CustomService.getResponse({
      body: data,
      url: Urls.paymentSetUp.create,
      useCache: false,
      method: "POST",
      userService: true,
      params: {},
    }),
  paymentSetUpUpdate: (data, tenantId) =>
    Digit.CustomService.getResponse({
      body: data,
      url: Urls.paymentSetUp.update,
      useCache: false,
      method: "POST",
      userService: true,
      params: {},
    }),
  mdmsRatesCreate: (data, tenantId) =>
    Digit.CustomService.getResponse({
      body: data,
      url: Urls.paymentSetUp.mdmsRatesCreate,
      useCache: false,
      method: "POST",
      userService: true,
      params: {},
    }),
  mdmsRatesUpdate: (data, tenantId) =>
    Digit.CustomService.getResponse({
      body: data,
      url: Urls.paymentSetUp.mdmsRatesUpdate,
      useCache: false,
      method: "POST",
      userService: true,
      params: {},
    }),
};

export default AttendeeService;
