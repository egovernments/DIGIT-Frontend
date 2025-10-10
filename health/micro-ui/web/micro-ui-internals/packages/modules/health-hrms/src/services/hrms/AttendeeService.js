import Urls from "../urls";
import { Request } from "@egovernments/digit-ui-libraries";
const AttendeeService = {
  search: (tenantId, filters, searchParams,data) =>
    Request({
      url: Urls.attendee.search,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      data:data,
      params: { tenantId, ...filters, ...searchParams },
    }),
//   create: (data, tenantId) =>
//     Request({
//       data: data,
//       url: Urls.attendee.enrollAttendee,
//       useCache: false,
//       method: "POST",
//       auth: true,
//       userService: true,
//       params: { tenantId },
//     }),
//   update: (data, tenantId) =>
//     Request({
//       data: data,
//       url: Urls.hrms.update,
//       useCache: false,
//       method: "POST",
//       auth: true,
//       userService: true,
//       params: { tenantId },
//     }),
 
delete: (data, tenantId) =>
    Request({
      data: data,
      url: Urls.attendee.deenrollAttendee,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      params: {  },
    }),

};

export default AttendeeService;