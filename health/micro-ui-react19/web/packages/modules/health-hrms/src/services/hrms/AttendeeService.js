import Urls from "../urls";

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

  delete: (data, tenantId) =>
    Digit.CustomService.getResponse({
      body: data,
      url: Urls.attendee.deenrollAttendee,
      useCache: false,
      method: "POST",
      userService: true,
      params: {},
    }),
};

export default AttendeeService;
