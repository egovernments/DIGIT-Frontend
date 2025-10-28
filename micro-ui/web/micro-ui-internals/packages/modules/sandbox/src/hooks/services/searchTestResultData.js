export const searchTestResultData = async ({ t, individualId, tenantId }) => {
  
  const response = await Digit.CustomService.getResponse({
    url: "/individual/v1/_search",
   
    params: {
      tenantId: "pg.citya",
      offset: 0,
      limit: 10,
      
    },
    body: {
        Individual: {
          "tenantId": "pg.citya",
          "individualId": individualId,
        },
      },
   
  });

 
  return {
    details: [
    
              {
                key: "Applicant name",
                value: response?.Individual?.[0]?.name?.givenName || "NA",
              },
              {
                key: "Applicant Id",
                value: response?.Individual?.[0]?.identifiers?.[0].individualId || "NA",
              },
  
            ],
          }
        }
