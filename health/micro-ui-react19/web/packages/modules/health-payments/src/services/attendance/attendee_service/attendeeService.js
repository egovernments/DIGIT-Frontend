import Urls from "../../urls";
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
  create: (data, tenantId) =>
    Request({
      data: data,
      url: Urls.attendee.enrollAttendee,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      params: { tenantId },
    }),
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
      params: {},
    }),

  paymentSetUpCreate: (data, tenantId) =>
    Request({
      data: data,
      url: Urls.paymentSetUp.create,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      params: {},
    }),

  paymentSetUpUpdate: (data, tenantId) =>
    Request({
      data: data,
      url: Urls.paymentSetUp.update,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      params: {},
    }),

  mdmsRatesCreate: (data, tenantId) =>
    Request({
      data: data,
      url: Urls.paymentSetUp.mdmsRatesCreate,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      params: {},
    }),

  mdmsRatesUpdate: (data, tenantId) =>
    Request({
      data: data,
      url: Urls.paymentSetUp.mdmsRatesUpdate,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      params: {},
    }),
};

export default AttendeeService;
