import Urls from "../urls";
import AttendeeService from "./attendee_service/attendeeService";


export const AttendanceService = {


  attendance_boundary_Search: async ({ body, params }) => {
    try {
      const response = await Digit.CustomService.getResponse({
        url: "/boundary-service/boundary-relationships/_search",
        useCache: false,
        method: "POST",
        userService: true,
        body,
        params,
      });

      return response.TenantBoundary;
    } catch (error) {
      if (error?.response?.data?.Errors) {
        throw new Error(error.response.data.Errors[0].message);
      }
      throw new Error("An unknown error occurred");
    }
  },

  //health-attendance/v1/_search

  attendance_registers_Search: async ({ body, params }) => {
    try {

      const response = await Digit.CustomService.getResponse({
        url: Urls.attendee.registerSearch,
        useCache: false,
        method: "POST",
        userService: true,
        body,
        params,
      });

      return response;
    } catch (error) {
      if (error?.response?.data?.Errors) {
        throw new Error(error.response.data.Errors[0].message);
      }
      throw new Error("An unknown error occurred");
    }
  },

  //INFO:: 

  deEnrollment_attendee: async ({ body, params }) => {
    try {

      const response = await Digit.CustomService.getResponse({
        url: Urls.attendee.deenrollAttendee,
        useCache: false,
        method: "POST",
        userService: true,
        body,
        params,
      });

      return response;
    } catch (error) {
      if (error?.response?.data?.Errors) {
        throw new Error(error.response.data.Errors[0].message);
      }
      throw new Error("An unknown error occurred");
    }

  },


  searchIndividual: async ({ name, locallity, tenantId }) => {
    try {

      //  if (data?.SelectEmployeePhoneNumber && data?.SelectEmployeePhoneNumber?.trim().length > 0) {
      const result = await AttendeeService.search(tenantId, null, { limit: 10, offset: 0 }, {

        "Individual": {

          "name": {
            "givenName": name

          },

          //  "mobileNumber": null,

          "locality": {
            "id": null,
            "tenantId": null,
            "code": locallity,
            "geometry": null,
            "auditDetails": null,
            "additionalDetails": null
          }
        }

      });

      return result.Individual;
    } catch (error) {
      throw error; // throw on error
    }
  }

}


export default AttendanceService;