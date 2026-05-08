import Urls from "../urls";
import { Request } from "@egovernments/digit-ui-libraries";

const AttendeeService = {
  search: (tenantId, filters, searchParams, data) =>
    Request({
      url: Urls.attendee.search,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      data: data,
      params: { tenantId, ...filters, ...searchParams },
    }),
  delete: (data, tenantId) =>
    Request({
      data: data,
      url: Urls.attendee.deenrollAttendee,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      params: {},
    }),
};

export default AttendeeService;
