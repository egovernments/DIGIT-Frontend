export const AttendanceService = {
    

    attendance_boundary_Search: async ({body, params}) => {
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

  attendance_registers_Search: async ({body, params}) => {
    try {
      
        const response = await Digit.CustomService.getResponse({
          url: "/health-attendance/v1/_search",
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

deEnrollment_attendee: async ({body, params}) => {
    try {
      
        const response = await Digit.CustomService.getResponse({
          url: "/health-attendance/attendee/v1/_delete",
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
}


}

  
  export default AttendanceService;