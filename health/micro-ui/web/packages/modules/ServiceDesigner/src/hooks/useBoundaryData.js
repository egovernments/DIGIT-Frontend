export const useBoundaryData = (tenantId = "dev", hierarchyType = "REVENUE") => {
  const requestSearchCriteria = {
    url: `/boundary-service/boundary-relationships/_search?tenantId=${tenantId}&hierarchyType=${hierarchyType}&includeChildren=true`,
    changeQueryName: `BOUNDARY_DATA_${tenantId}_${hierarchyType}`,
    body: {
      RequestInfo: {
        apiId: "Rainmaker",
        authToken: "",
        userInfo: {
          id: 23695,
          uuid: "45393546-c2a1-48f2-879b-3a768ca4ec2a",
          userName: "7349125125",
          name: "Debasish",
          mobileNumber: "7349125125",
          emailId: null,
          locale: null,
          type: "EMPLOYEE",
          roles: [
            {
              name: "Localisation admin",
              code: "LOC_ADMIN",
              tenantId: tenantId
            },
            {
              name: "STUDIO ADMIN",
              code: "STUDIO_ADMIN",
              tenantId: tenantId
            },
            {
              name: "MDMS ADMIN",
              code: "MDMS_ADMIN",
              tenantId: tenantId
            }
          ],
          active: true,
          tenantId: tenantId,
          permanentCity: null
        },
        msgId: "1753686272883|en_IN",
        plainAccessRequest: {}
      }
    },
    config: {
      enabled: !!tenantId && !!hierarchyType,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      select: (data) => {
        // Transform the boundary data into dropdown options
        const cities = [];
        if (data?.boundaryRelationships) {
          data.boundaryRelationships.forEach(boundary => {
            if (boundary.children) {
              boundary.children.forEach(child => {
                cities.push({
                  name: child.name,
                  value: child.code,
                  i18nKey: child.i18nKey
                });
              });
            }
          });
        }
        return cities;
      }
    }
  };

  return Digit.Hooks.useCustomAPIHook(requestSearchCriteria);
}; 