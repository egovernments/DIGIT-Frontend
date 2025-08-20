import Urls from "../../../../../health-hrms/src/services/urls";
import { Request } from "@egovernments/digit-ui-libraries";
const AttendeeService = {
//   search: (tenantId, filters, searchParams) =>
//     Request({
//       url: Urls.hrms.search,
//       useCache: false,
//       method: "POST",
//       auth: true,
//       userService: true,
//       params: { tenantId, ...filters, ...searchParams },
//     }),
//   create: (data, tenantId) =>
//     Request({
//       data: data,
//       url: Urls.hrms.create,
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