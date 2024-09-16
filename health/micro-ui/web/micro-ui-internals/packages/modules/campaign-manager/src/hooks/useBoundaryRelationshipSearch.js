export const useBoundaryRelationshipSearch = ({BOUNDARY_HIERARCHY_TYPE , tenantId}) => {
    const reqCriteria = {
        url: `/boundary-service/boundary-relationships/_search`,
        changeQueryName: `${BOUNDARY_HIERARCHY_TYPE}`,
        params: {
          tenantId: tenantId,
          hierarchyType: BOUNDARY_HIERARCHY_TYPE,
          includeChildren: true
        },
        body: {},
        config: {
          cacheTime: 1000000,
        },
      };
    
    const { data: hierarchyData, refetch, isLoading } = Digit.Hooks.useCustomAPIHook(reqCriteria);
    return hierarchyData?.TenantBoundary?.[0]?.boundary;
  };
  