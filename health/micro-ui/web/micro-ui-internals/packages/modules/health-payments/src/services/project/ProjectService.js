export const ProjectService = {
    staffSearch: async ({body, params}) => {
        try {
            const response = await Digit.CustomService.getResponse({
              url: "/health-project/staff/v1/_search",
              useCache: false,
              method: "POST",
              userService: true,
              body,
              params,
            });
            return response?.ProjectStaff;
          } catch (error) {
            if (error?.response?.data?.Errors) {
              throw new Error(error.response.data.Errors[0].message);
            }
            throw new Error("An unknown error occurred");
          }
    },

    projectSearch: async ({body, params}) => {
      try {
          const response = await Digit.CustomService.getResponse({
            url: "/health-project/v1/_search",
            useCache: false,
            method: "POST",
            userService: true,
            body,
            params,
          });
          return response?.Project;
        } catch (error) {
          if (error?.response?.data?.Errors) {
            throw new Error(error.response.data.Errors[0].message);
          }
          throw new Error("An unknown error occurred");
        }
  }
   
}

  
  export default ProjectService;